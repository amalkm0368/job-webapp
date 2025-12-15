import { Router } from "express"

import { isCompany, protect } from "../middlewares/auth.js"
import {
  createJob,
  deleteJob,
  filters,
  getAllJobs,
  getCompanyJobs,
  getJobById,
  updateJob,
} from "../controllers/jobs.controller.js"

const router = Router()

router.post("/", protect, isCompany, createJob)
router.get("/filters", filters)
router.get("/company", protect, isCompany, getCompanyJobs)

router.put("/:id", protect, isCompany, updateJob)

router.delete("/:id", protect, isCompany, deleteJob)

router.get("/", getAllJobs)

router.get("/:id", getJobById)

export default router
