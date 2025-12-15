import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllJobs } from "../../redux/reducer/jobSlice"
import { Link } from "react-router-dom"
import AddJob from "./AddJob"
import {
  FaBuilding,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaCode,
  FaEye,
  FaPaperPlane,
  FaEdit,
  FaTimes,
} from "react-icons/fa"
import ApplicationForm from "../Applications/ApplicationForm"

const JobList = ({ jobs, user, loading }) => {
  const dispatch = useDispatch()

  const [selectedJob, setSelectedJob] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalApplication, setIsModalApplication] = useState(false)
  const [isOpenForm, setIsOpenForm] = useState(false)

  useEffect(() => {
    if (!isOpenForm && !isModalOpen) {
      dispatch(getAllJobs())
    }
  }, [dispatch, isOpenForm, isModalOpen])

  const handleViewDetails = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }
  const handleEdit = () => {
    setIsOpenForm(true)
  }

  const handleApply = (jobId) => {
    setSelectedJob(jobId)
    setIsModalApplication(true)
  }
  console.log(selectedJob, user)
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <FaBuilding className="text-blue-600" /> Job Opportunities
        </h1>
        {user?.role === "company" && (
          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            onClick={() => setIsOpenForm(true)}
          >
            <FaEdit /> Post Job
          </button>
        )}
      </div>

      {/* Job Cards */}
      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : jobs?.length === 0 ? (
        <p className="text-gray-500">No jobs available</p>
      ) : (
        <div className="grid md:grid-cols-1  gap-6">
          {jobs &&
            jobs?.map((job) => (
              <div
                key={job._id}
                className="p-5 border rounded-xl bg-white shadow-md hover:shadow-lg transition relative"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {job.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {job?.description
                    ? job.description.slice(0, 120) + "..."
                    : "No description"}
                </p>

                <div className="mt-4 space-y-2 text-gray-700 text-sm">
                  <p className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" /> {job.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-500" />{" "}
                    {job.salary || "Not specified"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <FaCode className="text-blue-500" /> {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex justify-between">
                  <button
                    onClick={() => handleViewDetails(job)}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm flex items-center gap-1 hover:bg-gray-100"
                  >
                    <FaEye /> View
                  </button>
                  {user?.role === "user" && (
                    <button
                      onClick={() => handleApply(job._id)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md flex items-center gap-1 hover:bg-blue-700"
                    >
                      <FaPaperPlane /> Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 mt-3">{selectedJob.description}</p>

            <div className="mt-4 text-sm space-y-2">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />{" "}
                {selectedJob.location}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500" />{" "}
                {selectedJob.salary || "Not specified"}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedJob.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  <FaCode /> {skill}
                </span>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {user?.role === "user" && (
                <button
                  onClick={() => handleApply(selectedJob._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <FaPaperPlane /> Apply Now
                </button>
              )}
              {user?.role === "company" &&
                user?._id === selectedJob?.company?._id && (
                  <button
                    onClick={() => handleEdit()}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-600"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Add Job Form */}
      <AddJob
        isOpen={isOpenForm}
        onClose={() => {
          setIsOpenForm(false)
          setIsModalOpen(false)
        }}
        selectedJob={selectedJob}
      />
      {isModalApplication && (
        <ApplicationForm
          
          onClose={() => {
            setSelectedJob("")
            setIsModalApplication(false)
          }}
          jobId={selectedJob}
        />
      )}
    </div>
  )
}

export default JobList
