import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "@/actions/company.actions";

// GET: Fetch a company by companyId
export async function GET(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;

  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    const company = await getCompanyById(companyId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching company:", error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

// PUT: Update a company
export async function PUT(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const authData = await auth(); // Await the promise
  const userId = authData?.userId; // Safely access userId

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = params;
  const updateData = await req.json();

  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    const updatedCompany = await updateCompany(companyId, updateData);
    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a company
export async function DELETE(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const authData = await auth(); // Await the promise
  const userId = authData?.userId; // Safely access userId

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { companyId } = params;

  if (!companyId) {
    return NextResponse.json(
      { error: "Company ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletionResult = await deleteCompany(companyId);
    return NextResponse.json(deletionResult, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting company:", error);
    return NextResponse.json(
      { error: "Failed to delete company" },
      { status: 500 }
    );
  }
}
