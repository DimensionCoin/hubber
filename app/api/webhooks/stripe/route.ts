import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // ✅ Ensures Next.js does not cache

export async function POST(request: NextRequest) {
  console.log("📌 Webhook Received");
  return new NextResponse("Webhook received!", { status: 200 });
}

export function OPTIONS() {
  return new NextResponse("OK", { status: 200 });
}
