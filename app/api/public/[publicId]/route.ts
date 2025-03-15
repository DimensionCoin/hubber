// app/api/public/[publicId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCompanyByPublicId } from "@/actions/company.actions";

export async function GET(
  req: NextRequest,
  { params }: { params: { publicId: string } }
) {
  const { publicId } = params;
  if (!publicId) {
    return NextResponse.json(
      { error: "Public ID is required" },
      { status: 400 }
    );
  }

  try {
    const company = await getCompanyByPublicId(publicId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("❌ Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}
