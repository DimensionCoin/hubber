import { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    title: { type: String, required: true },
    description: { type: String },
    location: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      stateOrProvince: { type: String, required: true },
      postalCodeOrZip: { type: String, required: true },
      country: { type: String, required: true },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "finished"], required: true },
    assignedEmployees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

const Job = models?.Job || model("Job", JobSchema);
export default Job;
