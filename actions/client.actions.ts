import { connect } from "@/db";
import Client from "@/modals/client.model";
import Company from "@/modals/company.model";

/**
 * ✅ Create a new client and assign it to a company
 */
export const createClient = async (companyId: string, clientData: any) => {
  try {
    await connect();

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) throw new Error("Company not found");

    // Ensure companyId is included in client data
    const newClient = await Client.create({
      ...clientData,
      companyId, // ✅ Store the company ID with the client
    });

    // Attach client to the company
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { clients: newClient._id } },
      { new: true }
    );

    return { success: true, client: newClient };
  } catch (error: unknown) {
    console.error("❌ Error creating client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * ✅ Get all clients for a specific company
 */
export const getClientsByCompany = async (companyId: string) => {
  try {
    await connect();

    // Validate company exists
    const company = await Company.findById(companyId).populate("clients");
    if (!company) throw new Error("Company not found");

    return { success: true, clients: company.clients };
  } catch (error: unknown) {
    console.error("❌ Error fetching clients:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * ✅ Delete a client by ID
 */
export const deleteClient = async (companyId: string, clientId: string) => {
  try {
    await connect();

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) throw new Error("Company not found");

    // Remove client from company
    await Company.findByIdAndUpdate(companyId, {
      $pull: { clients: clientId },
    });

    // Delete client record
    await Client.findByIdAndDelete(clientId);

    return { success: true, message: "Client deleted successfully" };
  } catch (error: unknown) {
    console.error("❌ Error deleting client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * ✅ Update an existing client
 */
export const updateClient = async (
  companyId: string,
  clientId: string,
  updatedData: any
) => {
  try {
    await connect();

    // Validate company exists
    const company = await Company.findById(companyId);
    if (!company) throw new Error("Company not found");

    // Ensure client exists
    const client = await Client.findById(clientId);
    if (!client) throw new Error("Client not found");

    // Update client fields
    const updatedClient = await Client.findByIdAndUpdate(clientId, updatedData, {
      new: true,
      runValidators: true,
    });

    return { success: true, client: updatedClient };
  } catch (error: unknown) {
    console.error("❌ Error updating client:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
