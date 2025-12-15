import Job from "../models/job.model.js"
import Application from "../models/applicationmodel.js"
import User from "../models/auth.model.js"

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
    if (!job) return res.status(404).json({ msg: "Job not found" })
    const user = await User.findById(req.user.id)
    const alreadyApply = await Application.findOne({
      job: job?._id,
      applicant: user?._id,
    })
    if (alreadyApply) {
      return res.status(400).json({ msg: "Already applied to this job" })
    }
    const resumeUrl = req?.file
      ? `/uploads/${req.file.filename}`
      : user.resumeUrl || null

    const application = await Application.create({
      job: job._id,
      applicant: req.user.id,
      note: req.body.note || "",
      resumeUrl,
    })
    if (resumeUrl && resumeUrl !== user.resumeUrl) {
      const updateUserResume = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: { resumeUrl: resumeUrl },
        },
        { new: true }
      )
    }
    res.status(201).json(application)
  } catch (e) {
    if (e.code === 11000)
      return res.status(400).json({ msg: "Already applied" })
    res.status(500).json({ msg: e.message })
  }
}

export const getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.id })
      .sort("-createdAt")
      .populate({ path: "job", populate: { path: "company", select: "name" } })
    res.json(apps)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const getJobApplicants = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id }).select("_id title")
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ msg: "No jobs found for this company" })
    }

    const jobIds = jobs.map((job) => job._id)

    const apps = await Application.find({ job: { $in: jobIds } })
      .sort("-createdAt")
      .populate("applicant", "name email")
      .populate({ path: "job", populate: { path: "company", select: "name" } })

    res.json({
      jobsCount: jobs.length,
      applicationsCount: apps.length,
      applications: apps,
    })
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}
