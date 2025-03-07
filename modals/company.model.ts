import { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: true, trim: true },
    address: {
      street: String,
      city: String,
      stateOrProvince: String,
      postalCodeOrZip: String,
      country: { type: String, required: true },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    businessType: {
      type: String,
      enum: [
        "construction",
        "media",
        "landscaping",
        "retail",
        "technology",
        "manufacturing",
        "finance",
        "healthcare",
        "education",
        "other",
      ],
      required: true,
    },
    clients: [{ type: Schema.Types.ObjectId, ref: "Client" }], // ✅ Now properly references Clients
    employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }], // ✅ Now properly references Jobs
    totalRevenue: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    companyUrl: { type: String },
  },
  { timestamps: true }
);

const Company = models?.Company || model("Company", CompanySchema);
export default Company;
