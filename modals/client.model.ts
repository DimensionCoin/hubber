import { Schema, model, models } from "mongoose";

const ClientSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    }, // ✅ Ensure companyId is required
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String }, // Optional: Client's company name
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCodeOrZip: { type: String, required: true },
    },
    images: { type: [String], default: [] }, // Optional images
  },
  { timestamps: true }
);

const Client = models?.Client || model("Client", ClientSchema);

export default Client;
