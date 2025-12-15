import express from "express"
import { isCompany, isUser, protect } from "../middlewares/auth.js"

import { upload } from "../middlewares/upload.js"
import {
  applyToJob,
  getJobApplicants,
  getUserApplications,
} from "../controllers/application.controller.js"

const router = express.Router()

router.post("/:jobId", protect, isUser, upload.single("resume"), applyToJob)

router.get("/user", protect, isUser, getUserApplications)

router.get("/job/", protect, isCompany, getJobApplicants)

export default router
