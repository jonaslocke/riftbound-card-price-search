import { fetchCard } from "@/services/fetchCard";
import crypto from "crypto";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

const TIMEOUT_MS = 3000;

const CACHE_CONTROL_OK =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const CACHE_CONTROL_FALLBACK = "public, max-age=3600";

const MAX_DIMENSION = 2000;

type Ext = "jpg" | "webp" | "png";
type Mode = Ext | "og";

type ParsedFile = {
  riftboundId: string;
  ext: Ext;
  contentType: string;
};

const CONTENT_TYPE: Record<Ext, string> = {
  jpg: "image/jpeg",
  webp: "image/webp",
  png: "image/png",
};

const FALLBACK_FILE: Record<Ext, string> = {
  png: "default-card-744x1039.png",
  webp: "default-card-48x67.webp",
  jpg: "default-card-1200x630.jpg",
};

function parseFileParam(file: string): ParsedFile | null {
  const match = /^(.+)\.(jpg|webp|png)$/i.exec(file);
  if (!match) return null;

  const riftboundId = match[1];
  const ext = match[2].toLowerCase() as Ext;

  return { riftboundId, ext, contentType: CONTENT_TYPE[ext] };
}

function parseSizeParam(size: string | null): {
  width?: number;
  height?: number;
} {
  if (!size) return {};

  const trimmed = size.trim();
  if (!trimmed) return {};

  const [wStr, hStr] = trimmed.split("x");
  const width = normalizeDimension(wStr);
  const height = normalizeDimension(hStr);

  if (!width && !height) return {};
  return { width, height };
}

function normalizeDimension(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Math.floor(Math.abs(Number(value)));
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.min(n, MAX_DIMENSION);
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "HextechIndexBot/1.0" },
      cache: "force-cache",
    });
  } finally {
    clearTimeout(timer);
  }
}

function sha1Etag(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

function notModifiedResponse(etag: string): NextResponse {
  return new NextResponse(null, {
    status: 304,
    headers: {
      ETag: etag,
      "Cache-Control": CACHE_CONTROL_OK,
    },
  });
}

function okImageResponse(body: Uint8Array, etag: string, contentType: string) {
  return new NextResponse(body as BodyInit, {
    headers: {
      "Content-Type": contentType,
      ETag: etag,
      "Cache-Control": CACHE_CONTROL_OK,
    },
  });
}

function fallbackImageResponse(body: Uint8Array, contentType: string) {
  return new NextResponse(body as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": CACHE_CONTROL_FALLBACK,
    },
  });
}

async function loadFallback(ext: Ext): Promise<Buffer> {
  const fallbackPath = path.join(process.cwd(), "public", FALLBACK_FILE[ext]);
  return fs.readFile(fallbackPath);
}

async function loadCardImageBuffer(riftboundId: string): Promise<Buffer> {
  const setId = riftboundId.slice(0, 3);
  if (!setId) throw new Error("Invalid set id");

  const card = await fetchCard(setId, 0, riftboundId);
  const url = card?.media?.image_url;
  if (!url) throw new Error("Missing card image");

  const upstream = await fetchWithTimeout(url, TIMEOUT_MS);
  if (!upstream.ok) throw new Error("Upstream fetch failed");

  return Buffer.from(await upstream.arrayBuffer());
}

async function transformImage(
  input: Buffer,
  mode: Mode,
  resize: { width?: number; height?: number }
): Promise<Buffer> {
  const pipeline = () => {
    const s = sharp(input);
    if (resize.width || resize.height) {
      s.resize({ width: resize.width, height: resize.height });
    }
    return s;
  };

  switch (mode) {
    case "og": {
      const cardBuf = await sharp(input).resize({ height: 546 }).toBuffer();

      const logoBuf = await sharp(
        path.join(process.cwd(), "public", "hextech-index-hammer-gradient.svg")
      )
        .resize({ width: 96 })
        .toBuffer();

      return sharp({
        create: {
          width: 1200,
          height: 630,
          channels: 3,
          background: "#0A0F1C",
        },
      })
        .composite([
          { input: cardBuf, gravity: "centre" },
          { input: logoBuf, top: 630 - 24 - 96, left: 1200 - 24 - 96 },
        ])
        .jpeg({ quality: 70, mozjpeg: true })
        .toBuffer();
    }
    case "jpg":
      console.log(2);
      return pipeline().jpeg({ quality: 70, mozjpeg: true }).toBuffer();

    case "webp":
      console.log(3);
      return pipeline().webp().toBuffer();

    case "png":
      console.log(4);
      return pipeline().png().toBuffer();
  }
}

function resolveMode(ext: Ext, isOg: boolean): Mode {
  return isOg ? "og" : ext;
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ file: string }> }
) {
  const { file } = await ctx.params;

  const parsed = parseFileParam(file);
  if (!parsed) return new NextResponse("Invalid file", { status: 400 });

  const { riftboundId, ext, contentType } = parsed;

  const url = new URL(req.url);
  const resize = parseSizeParam(url.searchParams.get("size"));
  const isOg = url.searchParams.get("og")?.trim() === "1";
  const mode = resolveMode(ext, isOg);

  try {
    const input = await loadCardImageBuffer(riftboundId);
    const output = await transformImage(input, mode, resize);

    const etag = sha1Etag(output);
    const inm = req.headers.get("if-none-match");
    if (inm && inm === etag) return notModifiedResponse(etag);

    return okImageResponse(new Uint8Array(output), etag, contentType);
  } catch {
    const fallback = await loadFallback(ext);
    return fallbackImageResponse(new Uint8Array(fallback), contentType);
  }
}
