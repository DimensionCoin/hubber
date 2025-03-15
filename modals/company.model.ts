///modals/company.model.ts
import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CompanySchema = new Schema(
  {
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
      unique: true,
      default: uuidv4,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, unique: false, trim: true },
    logo: { type: String },
    description: { type: String },
    address: {
      street: String,
      city: String,
      stateOrProvince: String,
      postalCodeOrZip: String,
      country: { type: String, required: true },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    website: { type: String },
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
    foundedYear: { type: Number },
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    services: [String],
    images: [{ type: String }], // New field for array of image URLs
    testimonials: [
      {
        id: { type: String, default: uuidv4 },
        name: String,
        company: String,
        comment: String,
        rating: Number,
        imageUrl: String,
      },
    ],
    clients: [{ type: Schema.Types.ObjectId, ref: "Client" }],
    employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    totalRevenue: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    companyUrl: { type: String },
  },
  { timestamps: true }
);

const Company = models?.Company || model("Company", CompanySchema);
export default Company;
