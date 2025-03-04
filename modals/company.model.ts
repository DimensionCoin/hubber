import { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      stateOrProvince: String, // Supports both states and provinces
      postalCodeOrZip: String, // Supports postal codes, zip codes, and other region-specific codes
      country: {
        type: String,
        required: true,
      },
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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
    clients: [
      {
        name: String,
        email: String,
        phone: String,
        company: String,
        imageUrl: {
          type: String,
          default: "",
        },
      },
    ],
    employees: {
      type: Array,
      default: [], // ✅ Ensures new companies start with an empty employees array
    },
    totalRevenue: {
      type: Number,
      default: 0, // ✅ Ensures totalRevenue is explicitly set to zero
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // ✅ New companies start as active by default
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Company = models?.Company || model("Company", CompanySchema);

export default Company;
