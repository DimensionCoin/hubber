import { NextRequest, NextResponse } from "next/server";
import {
  createClient,
  getClientsByCompany,
  updateClient,
  deleteClient,
} from "@/actions/client.actions";

/**
 * ✅ Fetch all clients for a specific company
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    const result = await getClientsByCompany(companyId);

    if (!result.clients || result.clients.length === 0) {
      return NextResponse.json({ success: true, clients: [] }, { status: 200 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching clients:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

/**
 * ✅ Create a new client (Requires `companyId`)
 */
export async function POST(req: NextRequest) {
  try {
    const { companyId, clientData } = await req.json();

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    if (
      !clientData.firstName ||
      !clientData.lastName ||
      !clientData.email ||
      !clientData.phone ||
      !clientData.address?.street ||
      !clientData.address?.city ||
      !clientData.address?.postalCodeOrZip
    ) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const result = await createClient(companyId, clientData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error creating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create client" },
      { status: 500 }
    );
  }
}

/**
 * ✅ Update an existing client
 */
export async function PATCH(req: NextRequest) {
  try {
    const { companyId, clientId, updatedData } = await req.json();

    if (!companyId || !clientId) {
      return NextResponse.json(
        { success: false, error: "Company ID and Client ID are required" },
        { status: 400 }
      );
    }

    const result = await updateClient(companyId, clientId, updatedData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error updating client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update client" },
      { status: 500 }
    );
  }
}

/**
 * ✅ Delete a client
 */
export async function DELETE(req: NextRequest) {
  try {
    const { companyId, clientId } = await req.json();

    if (!companyId || !clientId) {
      return NextResponse.json(
        { success: false, error: "Company ID and Client ID are required" },
        { status: 400 }
      );
    }

    const result = await deleteClient(companyId, clientId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error deleting client:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete client" },
      { status: 500 }
    );
  }
}
