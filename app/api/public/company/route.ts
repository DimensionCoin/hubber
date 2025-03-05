import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/actions/company.actions";

// ✅ Public API for fetching company details without authentication
export async function GET(req: NextRequest) {
  try {
    // ✅ Extract `companyId` from query parameters
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch company by ID
    const company = await getCompanyById(companyId);

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // ✅ Return required fields (Now includes `address`)
    const publicCompanyData = {
      name: company.name,
      businessType: company.businessType || "N/A",
      employees: company.employees || [],
      totalRevenue: company.totalRevenue || 0,
      status: company.status || "inactive",
      companyUrl: company.companyUrl || "",
      createdAt: company.createdAt || new Date().toISOString(),
      address: {
        street: company.address?.street || "N/A",
        city: company.address?.city || "N/A",
        stateOrProvince: company.address?.stateOrProvince || "N/A",
        postalCodeOrZip: company.address?.postalCodeOrZip || "N/A",
        country: company.address?.country || "N/A",
      },
    };

    return NextResponse.json(publicCompanyData, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching company:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}
