import User from "../models/auth.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, skills } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" })
    }

    const isValidPhoneNumber = (phone) => {
      const phoneRegex = /\d{10}$/
      return phoneRegex.test(phone)
    }
    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" })
    }
    
    const existing = await User.findOne({ email })

    if (existing) {
      const fileName = req.file.filename
      const filePath = `src/uploads/${fileName}`

      fs.unlink(filePath, (err) => {
        if (err) {
          res.status(500).json({ message: "Error in Deleting File" })
        }
      })
      return res.status(400).json("User already Exists")
    }

    const filename = req.file.filename
    const fileUrl = path.join(filename)
    
    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      skills,
      profileImage: fileUrl || "",
      phone,
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        phone: user.phone,
        shippingAddress: user.address,
      },
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ msg: "User not found" })

    res.json(user)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, skills } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { name, email, phone, skills },
      },
      { new: true }
    ).select("-password")

    if (!updatedUser) return res.status(404).json({ msg: "User not found" })

    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ msg: "No image file uploaded" })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          profileImage: req.file.path,
        },
      },
      { new: true }
    ).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" })
    }

    res.json({
      msg: "Profile image updated successfully",
      user: updatedUser,
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const updateResume = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ msg: "No resume file uploaded" })
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { resumeUrl: req.file.path } },
      { new: true }
    ).select("-password")

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" })
    }

    res.json({
      msg: "Resume uploaded successfully",
      user: updatedUser,
    })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}
