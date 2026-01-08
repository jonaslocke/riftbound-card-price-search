import { fetchCard } from "@/services/fetchCard";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

export const runtime = "nodejs";

const TIMEOUT_MS = 3000;

type Ext = "jpg" | "webp" | "png";

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

function parseFileParam(file: string): ParsedFile | null {
  const match = /^(.+)\.(jpg|webp|png)$/i.exec(file);
  if (!match) return null;

  const riftboundId = match[1];
  const ext = match[2].toLowerCase() as Ext;

  return { riftboundId, ext, contentType: CONTENT_TYPE[ext] };
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

export async function GET(
  req: Request,
  ctx: { params: Promise<{ file: string }> }
) {
  const { file } = await ctx.params;

  const parsed = parseFileParam(file);
  if (!parsed) return new NextResponse("Invalid file", { status: 400 });

  const { riftboundId, ext } = parsed;

  if (ext !== "jpg") {
    return new NextResponse("Invalid file extension, only accepting jpg", {
      status: 405,
    });
  }
  try {
    const setId = riftboundId.slice(0, 3);
    if (!setId) throw new Error("Invalid set id");

    const card = await fetchCard(setId, 0, riftboundId);
    const url = card?.media?.image_url;
    if (!url) throw new Error("Missing card image");

    const upstream = await fetchWithTimeout(url, TIMEOUT_MS);
    if (!upstream.ok) throw new Error("Upstream fetch failed");

    const input = Buffer.from(await upstream.arrayBuffer());

    const cardBuf = await sharp(input).resize({ height: 546 }).toBuffer();

    const logoBuf = await sharp(
      path.join(process.cwd(), "public", "hextech-index-hammer-gradient.svg")
    )
      .resize({ width: 96 })
      .toBuffer();

    const output = await sharp({
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

    return new NextResponse(new Uint8Array(output) as BodyInit, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    const fallbackPath = path.join(
      process.cwd(),
      "public",
      "default-card-1200x630.jpg"
    );
    const fallback = await fs.readFile(fallbackPath);

    return new NextResponse(new Uint8Array(fallback), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
