import { NextRequest, NextResponse } from "next/server";
import {
  createCompany,
  getUserCompanies,
  addClientToCompany,
} from "@/actions/company.actions";
import { auth } from "@clerk/nextjs/server";
// ✅ Get all companies for a user
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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


// ✅ Create a new company
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyData = await req.json();
    console.log("🚀 Received company data:", companyData);

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

    companyData.employees = companyData.employees || [];
    companyData.clients = companyData.clients || [];
    companyData.totalRevenue =
      companyData.totalRevenue !== undefined ? companyData.totalRevenue : 0;
    companyData.status = companyData.status || "active";

    const newCompany = await createCompany(session.userId, companyData);
    console.log("✅ Company Created with URL:", newCompany.companyUrl);

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating company:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}

// ✅ Add a client to an existing company
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyId, clientData } = await req.json();
    console.log("🚀 Received client data for company:", {
      companyId,
      clientData,
    });

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    if (
      !clientData ||
      !clientData.firstName ||
      !clientData.lastName ||
      !clientData.email ||
      !clientData.phone ||
      !clientData.address ||
      !clientData.address.street ||
      !clientData.address.city ||
      !clientData.address.postalCodeOrZip
    ) {
      return NextResponse.json(
        { error: "Missing required client fields" },
        { status: 400 }
      );
    }

    const updatedCompany = await addClientToCompany(companyId, clientData);
    console.log("✅ Client added to company:", updatedCompany);

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error("❌ Error adding client:", error);
    return NextResponse.json(
      { error: "Failed to add client" },
      { status: 500 }
    );
  }
}
