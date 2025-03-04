import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/actions/company.actions";
import { auth } from "@clerk/nextjs/server";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"; // Fallback if env is missing

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract company ID from the URL
    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch the company
    const company = await getCompanyById(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // ✅ Ensure the company has a `companyUrl` (for older records)
    if (!company.companyUrl) {
      company.companyUrl = `${BASE_URL}/company/portal/${company._id}`;
    }

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching company by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}
