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
    companyUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      stateOrProvince: String,
      postalCodeOrZip: String,
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
      default: [],
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Company = models?.Company || model("Company", CompanySchema);

export default Company;
