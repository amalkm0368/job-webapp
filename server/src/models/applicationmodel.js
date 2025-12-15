// models/Application.ts
import { Schema, model, Types } from "mongoose"
const appSchema = new Schema(
  {
    job: { type: Types.ObjectId, ref: "Job", required: true },
    applicant: { type: Types.ObjectId, ref: "User", required: true },
    note: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
)

appSchema.index({ job: 1, applicant: 1 }, { unique: true }) 
export default model("Application", appSchema)
