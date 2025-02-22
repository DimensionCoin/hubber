import { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Company belongs to a user
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    clients: [{ type: String }],
    employees: [{ type: String }],
  },
  { timestamps: true }
);

const Company = models?.Company || model("Company", CompanySchema);

export default Company;
