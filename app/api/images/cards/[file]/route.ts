import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fetchCard } from "@/services/fetchCard";

const TIMEOUT_MS = 3000;

type Ext = "jpg" | "webp" | "png";

type ParsedFile = {
  riftboundId: string;
  ext: Ext;
  contentType: string;
};

const contentTypeMap: Record<Ext, string> = {
  jpg: "image/jpeg",
  webp: "image/webp",
  png: "image/png",
};

function parseFile(file: string): ParsedFile | null {
  const match = /^(.+)\.(jpg|webp|png)$/i.exec(file);
  if (!match) return null;

  const ext = match[2].toLowerCase() as Ext;

  return {
    riftboundId: match[1],
    ext,
    contentType: contentTypeMap[ext],
  };
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

function etagFor(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

function notModifiedIfMatch(req: Request, etag: string): NextResponse | null {
  const inm = req.headers.get("if-none-match");
  if (inm && inm === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  }
  return null;
}

function cacheHeaders(etag: string, contentType: string): HeadersInit {
  return {
    "Content-Type": contentType,
    ETag: etag,
    "Cache-Control":
      "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
  };
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ file: string }> }
) {
  const { file } = await ctx.params;
  const parsed = parseFile(file);

  if (!parsed) {
    return new NextResponse("Invalid file", { status: 400 });
  }

  const { riftboundId, ext, contentType } = parsed;

  const setId = riftboundId.slice(0, 3);

  if (!setId) {
    return new NextResponse("Invalid file", { status: 400 });
  }

  const card = await fetchCard(setId, 0, riftboundId);

  let isFallback = false;
  let outputBuffer: Buffer;

  try {
    if (!card?.media?.image_url) {
      throw new Error("Missing card image");
    }

    const upstream = await fetchWithTimeout(card.media.image_url, TIMEOUT_MS);

    if (!upstream.ok) {
      throw new Error("Upstream fetch failed");
    }

    const input = Buffer.from(await upstream.arrayBuffer());

    switch (ext) {
      case "png": {
        outputBuffer = await sharp(input)
          .resize({ height: 1039 })
          .png()
          .toBuffer();
        break;
      }

      case "webp": {
        outputBuffer = await sharp(input)
          .resize({ height: 67 })
          .webp({ quality: 45 })
          .toBuffer();
        break;
      }

      case "jpg": {
        const cardBuf = await sharp(input).resize({ height: 546 }).toBuffer();

        outputBuffer = await sharp({
          create: {
            width: 1200,
            height: 630,
            channels: 3,
            background: "#0A0F1C",
          },
        })
          .composite([{ input: cardBuf, gravity: "centre" }])
          .jpeg({ quality: 70, mozjpeg: true })
          .toBuffer();
        break;
      }
    }
  } catch {
    isFallback = true;

    const fallbackMap: Record<Ext, string> = {
      png: "default-card-744x1039.png",
      webp: "default-card-48x67.webp",
      jpg: "default-card-1200x630.jpg",
    };

    const fallbackPath = path.join(process.cwd(), "public", fallbackMap[ext]);

    outputBuffer = await fs.readFile(fallbackPath);
  }

  const body = new Uint8Array(outputBuffer);

  if (!isFallback) {
    const etag = etagFor(outputBuffer);
    const notModified = notModifiedIfMatch(req, etag);
    if (notModified) return notModified;

    return new NextResponse(body, {
      headers: cacheHeaders(etag, contentType),
    });
  }

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
