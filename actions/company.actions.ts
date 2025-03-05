import { connect } from "@/db";
import User from "@/modals/user.modal";
import Company from "@/modals/company.model";

const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

console.log("🚀 Using BASE_URL:", BASE_URL);

// ✅ Create a new company
export async function createCompany(userId: string, companyData: any) {
  try {
    await connect();

    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    if (!companyData.address || typeof companyData.address !== "object") {
      throw new Error("Invalid address format");
    }

    const newCompany = await Company.create({
      owner: user._id,
      name: companyData.name,
      phone: companyData.phone,
      email: companyData.email,
      businessType: companyData.businessType,
      address: {
        street: companyData.address.street,
        city: companyData.address.city,
        stateOrProvince: companyData.address.stateOrProvince,
        postalCodeOrZip: companyData.address.postalCodeOrZip,
        country: companyData.address.country,
      },
      employees: companyData.employees || [],
      clients: companyData.clients || [],
      totalRevenue: companyData.totalRevenue || 0,
      status: companyData.status || "active",
    });

    const companyUrl = `${process.env.NEXT_PUBLIC_URL}/company/portal/${newCompany._id}`;
    await Company.findByIdAndUpdate(newCompany._id, { companyUrl });

    console.log("✅ Company Created:", newCompany);

    user.companies.push(newCompany._id);
    await user.save();

    return JSON.parse(JSON.stringify(newCompany));
  } catch (error) {
    console.error("❌ Error creating company:", error);
    throw new Error("Failed to create company");
  }
}

// ✅ Fetch a company by ID
export async function getCompanyById(companyId: string) {
  try {
    await connect();

    const company = await Company.findById(companyId);
    if (!company) throw new Error("Company not found");

    return JSON.parse(JSON.stringify(company));
  } catch (error) {
    console.error("❌ Error fetching company by ID:", error);
    throw new Error("Failed to fetch company");
  }
}

// ✅ Get all companies for a user
export async function getUserCompanies(userId: string) {
  try {
    await connect();

    const user = await User.findOne({ clerkId: userId }).populate("companies");
    if (!user) throw new Error("User not found");

    return user.companies.map((company: any) => ({
      _id: company._id.toString(),
      name: company.name,
      phone: company.phone,
      email: company.email,
      businessType: company.businessType || "N/A",
      address: {
        street: company.address.street || "",
        city: company.address.city || "",
        stateOrProvince: company.address.stateOrProvince || "",
        postalCodeOrZip: company.address.postalCodeOrZip || "",
        country: company.address.country || "",
      },
      employees: company.employees || [],
      clients: company.clients || [],
      totalRevenue: company.totalRevenue || 0,
      status: company.status || "inactive",
      companyUrl:
        company.companyUrl || `${BASE_URL}/company/portal/${company._id}`,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));
  } catch (error) {
    console.error("❌ Error fetching user companies:", error);
    throw new Error("Failed to fetch companies");
  }
}

// ✅ Add a client to a company
export async function addClientToCompany(
  companyId: string,
  clientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      postalCodeOrZip: string;
    };
    company?: string;
    images?: string[];
  }
) {
  try {
    await connect();

    // ✅ Validate client data
    if (
      !clientData.firstName ||
      !clientData.lastName ||
      !clientData.email ||
      !clientData.phone ||
      !clientData.address ||
      !clientData.address.street ||
      !clientData.address.city ||
      !clientData.address.postalCodeOrZip
    ) {
      throw new Error("Missing required client fields");
    }

    // ✅ Find company by ID and push new client to the clients array
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $push: { clients: clientData } },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      throw new Error("Company not found");
    }

    console.log("✅ Client added to company:", updatedCompany);

    return JSON.parse(JSON.stringify(updatedCompany));
  } catch (error) {
    console.error("❌ Error adding client to company:", error);
    throw new Error("Failed to add client");
  }
}
