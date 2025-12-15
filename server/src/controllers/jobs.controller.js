import Job from "../models/job.model.js"

export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, skills } = req.body
    const job = await Job.create({
      company: req.user.id,
      title,
      description,
      location,
      salary,
      skills: skills?.map((s) => s.trim()),
    })
    res.status(201).json(job)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.user.id })
      .sort("-createdAt")
      .populate("company", "name")
    res.json(jobs)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const getAllJobs = async (req, res) => {
  try {
    const { q, title, location, skills } = req.query
    const filter = {}

    if (q) filter.$text = { $search: q }
    if (title) filter.title = new RegExp(title, "i")
    if (location) filter.location = new RegExp(location, "i")
    if (skills) filter.skills = { $in: skills.split(",").map((s) => s.trim()) }

    const jobs = await Job.find(filter)
      .sort("-createdAt")
      .populate("company", "name")

    res.json(jobs)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("company", "name")
    if (!job) return res.status(404).json({ msg: "Job not found" })
    res.json(job)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, company: req.user.id },
      req.body,
      { new: true }
    )
    if (!job) return res.status(404).json({ msg: "Not found or not owner" })
    res.json(job)
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      company: req.user.id,
    })
    if (!job) return res.status(404).json({ msg: "Not found or not owner" })
    res.json({ msg: "Deleted" })
  } catch (e) {
    res.status(500).json({ msg: e.message })
  }
}

export const filters = async (req, res) => {
  try {
    const titles = await Job.distinct("title")
    const locations = await Job.distinct("location")
    const skills = await Job.distinct("skills")

    res.json({ titles, locations, skills })
  } catch (error) {
    res.status(500).json({ msg: err.message })
  }
}
