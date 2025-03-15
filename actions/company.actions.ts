// actions/company.actions.ts
import { connect } from "@/db";
import User from "@/modals/user.modal";
import Company from "@/modals/company.model";
import { v4 as uuidv4 } from "uuid";

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

    const companyPayload = {
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
      publicId: uuidv4(), // Explicitly set publicId since schema default isn’t working
    };

    console.log("🚀 Company payload:", JSON.stringify(companyPayload, null, 2));

    const newCompany = await Company.create(companyPayload);
    console.log(
      "✅ New company after create:",
      JSON.stringify(newCompany, null, 2)
    );

    const companyUrl = `${BASE_URL}/company/portal/${newCompany._id.toString()}`;
    const updatedCompany = await Company.findByIdAndUpdate(
      newCompany._id,
      { companyUrl },
      { new: true }
    );
    console.log("✅ Updated company:", JSON.stringify(updatedCompany, null, 2));

    user.companies.push(newCompany._id);
    await user.save();

    return JSON.parse(JSON.stringify(updatedCompany));
  } catch (error) {
    console.error("❌ Error creating company:", error);
    throw new Error("Failed to create company");
  }
}

// ✅ Fetch a company by ID (MongoDB _id)
export async function getCompanyById(companyId: string) {
  try {
    await connect();

    const company = await Company.findById(companyId);
    if (!company) throw new Error("Company not found");

    console.log("✅ Fetched company by ID:", JSON.stringify(company, null, 2));
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

    const companies = user.companies.map((company: any) => ({
      _id: company._id.toString(),
      publicId: company.publicId, // Include publicId
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
        company.companyUrl ||
        `${BASE_URL}/company/portal/${company._id.toString()}`,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    console.log("✅ User companies:", JSON.stringify(companies, null, 2));
    return companies;
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

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $push: { clients: clientData } },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      throw new Error("Company not found");
    }

    console.log(
      "✅ Client added to company:",
      JSON.stringify(updatedCompany, null, 2)
    );
    return JSON.parse(JSON.stringify(updatedCompany));
  } catch (error) {
    console.error("❌ Error adding client to company:", error);
    throw new Error("Failed to add client");
  }
}

// ✅ Get all companies
export async function getAllCompanies() {
  try {
    await connect();

    const companies = await Company.find({}).select(
      "_id publicId name phone email businessType address totalRevenue status companyUrl createdAt updatedAt"
    );

    const mappedCompanies = companies.map((company) => ({
      _id: company._id.toString(),
      publicId: company.publicId, // Include publicId
      name: company.name,
      phone: company.phone,
      email: company.email,
      businessType: company.businessType || "N/A",
      address: {
        street: company.address?.street || "",
        city: company.address?.city || "",
        stateOrProvince: company.address?.stateOrProvince || "",
        postalCodeOrZip: company.address?.postalCodeOrZip || "",
        country: company.address?.country || "",
      },
      totalRevenue: company.totalRevenue || 0,
      status: company.status || "inactive",
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    return mappedCompanies;
  } catch (error) {
    console.error("❌ Error fetching all companies:", error);
    throw new Error("Failed to fetch all companies");
  }
}

export async function getCompanyByPublicId(publicId: string) {
  try {
    await connect();
    console.log(`Fetching company with publicId: ${publicId}`);

    const company = await Company.findOne({ publicId });
    if (!company) {
      console.log(`No company found with publicId: ${publicId}`);
      throw new Error("Company not found");
    }

    const companyData = {
      publicId: company.publicId,
      name: company.name,
      logo: company.logo || undefined,
      tagline: company.tagline || undefined,
      description: company.description || undefined,
      businessType: company.businessType || "N/A",
      foundedYear: company.foundedYear || undefined,
      address: {
        street: company.address.street || "",
        city: company.address.city || "",
        stateOrProvince: company.address.stateOrProvince || "",
        postalCodeOrZip: company.address.postalCodeOrZip || "",
        country: company.address.country || "",
      },
      phone: company.phone || "",
      email: company.email || "",
      website: company.website || undefined,
      socialMedia: company.socialMedia || undefined,
      services: company.services || undefined,
      images: company.images || undefined,
      testimonials: company.testimonials || undefined,
      tags: company.tags || undefined,
    };

    console.log(
      "✅ Fetched company by publicId:",
      JSON.stringify(companyData, null, 2)
    );
    return companyData;
  } catch (error) {
    console.error(`❌ Error fetching company by publicId ${publicId}:`, error);
    throw new Error("Failed to fetch company");
  }
}

// ✅ Update a company by ID
export async function updateCompany(companyId: string, updateData: any) {
  try {
    await connect();
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      throw new Error("Company not found");
    }
    console.log("✅ Updated company:", JSON.stringify(updatedCompany, null, 2));
    return JSON.parse(JSON.stringify(updatedCompany));
  } catch (error) {
    console.error("❌ Error updating company:", error);
    throw new Error("Failed to update company");
  }
}

// ✅ Delete a company by ID
export async function deleteCompany(companyId: string) {
  try {
    await connect();
    const deletedCompany = await Company.findByIdAndDelete(companyId);
    if (!deletedCompany) {
      throw new Error("Company not found");
    }
    console.log("✅ Deleted company:", companyId);
    return { message: "Company successfully deleted", companyId };
  } catch (error) {
    console.error("❌ Error deleting company:", error);
    throw new Error("Failed to delete company");
  }
}
