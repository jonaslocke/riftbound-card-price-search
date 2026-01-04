import { getCollections } from "@/lib/mongodb/collections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "I'm Alive" });
}
