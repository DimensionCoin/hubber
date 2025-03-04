import { connect } from "@/db"; // Ensure correct import
import User from "@/modals/user.modal";
import Company from "@/modals/company.model";

// ✅ Create a new company
// ✅ Create a new company
export async function createCompany(userId: string, companyData: any) {
  try {
    await connect();

    // ✅ Find user by Clerk's `userId`
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    // ✅ Ensure the address is correctly formatted
    if (!companyData.address || typeof companyData.address !== "object") {
      throw new Error("Invalid address format");
    }

    // ✅ Define company object with all fields explicitly set
    const newCompanyData = {
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
      employees: companyData.employees || [], // ✅ Ensure employees array exists
      totalRevenue: companyData.totalRevenue !== undefined ? companyData.totalRevenue : 0, // ✅ Ensure totalRevenue is initialized
      status: companyData.status || "active", // ✅ Ensure status is set to "active" on creation
    };

    // ✅ Create company in MongoDB
    const newCompany = await Company.create(newCompanyData);

    // ✅ Link company to user
    user.companies.push(newCompany._id);
    await user.save();

    return JSON.parse(JSON.stringify(newCompany));
  } catch (error) {
    console.error("❌ Error creating company:", error);
    throw new Error("Failed to create company");
  }
}

export async function getCompanyById(companyId: string) {
  try {
    await connect();

    const company = await Company.findById(companyId);

    if (!company) {
      throw new Error("Company not found");
    }

    return JSON.parse(JSON.stringify(company));
  } catch (error) {
    console.error("❌ Error fetching company by ID:", error);
    throw new Error("Failed to fetch company");
  }
}



// ✅ Get all companies for a user with correct typing
export async function getUserCompanies(userId: string) {
  try {
    await connect();

    // ✅ Find user by Clerk's `userId`
    const user = await User.findOne({ clerkId: userId }).populate("companies");
    if (!user) throw new Error("User not found");

    // ✅ Return user's companies with properly typed fields
    return user.companies.map((company: any) => ({
      _id: company._id.toString(),
      name: company.name,
      phone: company.phone,
      email: company.email,
      businessType: company.businessType,
      address: {
        street: company.address.street || "",
        city: company.address.city || "",
        stateOrProvince: company.address.stateOrProvince || "",
        postalCodeOrZip: company.address.postalCodeOrZip || "",
        country: company.address.country || "",
      },
      employees: company.employees || [], // ✅ Ensure employees array exists
      totalRevenue: company.totalRevenue || 0, // ✅ Ensure totalRevenue exists
      status: company.status || "active", // ✅ Ensure status exists
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));
  } catch (error) {
    console.error("❌ Error fetching user companies:", error);
    throw new Error("Failed to fetch companies");
  }
}
