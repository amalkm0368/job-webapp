import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    role: { type: String, enum: ["company", "user"], default: "user" },
    profileImage: { type: String, default: "" },
    skills: [String],
    resumeUrl: String,
  },

  { timestamps: true }
)

const User = mongoose.model("User", userSchema)
export default User
