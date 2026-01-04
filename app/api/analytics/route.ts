import { AnalyticsEventSchema } from "@/lib/analytics/schema";
import { getCollections } from "@/lib/mongodb/collections";
import { NextResponse } from "next/server";

function isAnalyticsEnabled() {
  const flag = process.env.ANALYTICS_ENABLED ?? "true";
  return flag !== "false" && flag !== "0";
}

export async function POST(request: Request) {
  if (!isAnalyticsEnabled()) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const parsed = AnalyticsEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid analytics event.", details: parsed.error.format() },
      { status: 400 }
    );
  }

  try {
    const { analyticsEvents } = await getCollections();
    await analyticsEvents.insertOne({
      ...parsed.data,
      received_at: new Date().toISOString(),
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics insert failed", error);
    return NextResponse.json(
      { error: "Failed to persist analytics event." },
      { status: 500 }
    );
  }
}
