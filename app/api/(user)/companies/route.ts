import { NextRequest, NextResponse } from "next/server";
import { createCompany, getUserCompanies } from "@/actions/company.actions";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  // ✅ Removed 'req' since it's unused
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch all companies owned by the user
    const companies = await getUserCompanies(session.userId);

    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyData = await req.json(); // ✅ Changed 'let' to 'const'
    console.log("🚀 Received company data:", companyData);

    // ✅ Validate Required Fields
    if (
      !companyData.name ||
      !companyData.phone ||
      !companyData.businessType ||
      !companyData.email ||
      !companyData.address?.country ||
      !companyData.address?.street ||
      !companyData.address?.city ||
      !companyData.address?.stateOrProvince ||
      !companyData.address?.postalCodeOrZip
    ) {
      console.error("❌ Missing required fields:", companyData);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Ensure new fields exist
    companyData.employees = companyData.employees || [];
    companyData.totalRevenue =
      companyData.totalRevenue !== undefined ? companyData.totalRevenue : 0;
    companyData.status = companyData.status || "active";

    // ✅ Create the company
    const newCompany = await createCompany(session.userId, companyData);

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
