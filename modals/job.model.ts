import { Schema, model, models } from "mongoose";

const JobSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Job belongs to a company
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["active", "finished"], required: true },
  },
  { timestamps: true }
);

const Job = models?.Job || model("Job", JobSchema);

export default Job;
