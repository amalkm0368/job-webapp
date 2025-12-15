// models/Job.ts
import mongoose from "mongoose"
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    location: { type: String, required: true, index: true },
    salary: Number,
    skills: { type: [String], index: true },
  },
  { timestamps: true }
)

jobSchema.index({ title: "text", description: "text" })
export default mongoose.model("Job", jobSchema)
