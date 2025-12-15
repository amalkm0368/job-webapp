import express from "express"

import { upload } from "../middlewares/upload.js"
import { protect } from "../middlewares/auth.js"
import {
  getUser,
  login,
  register,
  updateProfileImage,
  updateResume,
  updateUser,
} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/register", upload.single("profileImage"), register)
// router.put("/resume", upload.single("resume"), updateResume)
router.post("/login", login)
router.get("/user", protect, getUser)
// router.put("/user/address", protect, updateUser)
// router.patch(
//   "/user/profile-image",
//   protect,
//   upload.single("profileImage"),
//   updateProfileImage
// )

export default router
