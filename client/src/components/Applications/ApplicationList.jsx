import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getJobApplicants,
  getUserApplications,
  //   updateApplicationStatus,
} from "../../redux/reducer/applicationSlice.js"

const BASE_URL = import.meta.env.VITE_API_URL

const ApplicationList = () => {
  const dispatch = useDispatch()
  const { userApplications, loading, error } = useSelector(
    (state) => state.applications
  )
  const { user } = useSelector((state) => state.auth)
  console.log(user)

  const [showResumeModal, setShowResumeModal] = useState(false)
  const [selectedResume, setSelectedResume] = useState(null)

  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    if (user.role === "user") {
      dispatch(getUserApplications())
    } else dispatch(getJobApplicants())
  }, [dispatch, user])

  const handleOpenResumeModal = (resumeUrl) => {
    setSelectedResume(`${BASE_URL}${resumeUrl}`)
    setShowResumeModal(true)
  }

  const handleCloseResumeModal = () => {
    setShowResumeModal(false)
    setSelectedResume(null)
  }

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app)
    setNewStatus(app.status)
    setShowStatusModal(true)
  }

  const handleCloseStatusModal = () => {
    setShowStatusModal(false)
    setSelectedApp(null)
    setNewStatus("")
  }

  const handleStatusUpdate = () => {
    if (!selectedApp) return
    // dispatch(
    //   updateApplicationStatus({ id: selectedApp._id, status: newStatus })
    // )
    handleCloseStatusModal()
  }

  if (loading) return <p className="text-center">Loading applications...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>

      {userApplications.length === 0 ? (
        <p className="text-gray-600">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userApplications.map((app) => (
            <div
              key={app._id}
              className="p-5 border rounded-lg shadow-md bg-white hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {app.job?.title || "Job Title"}
                </h3>
                <p className="text-gray-600 mt-1">
                  <strong>Company:</strong> {app.job?.company?.name || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Location:</strong> {app.job?.location || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {app.status}
                </p>
                {app.note && (
                  <p className="text-gray-500 mt-1">Note: {app.note}</p>
                )}
              </div>

              <div className="mt-4">
                <p className="text-gray-400 text-sm">
                  Applied on: {new Date(app.createdAt).toLocaleDateString()}
                </p>

                <div className="flex justify-between">
                  {app.resumeUrl && (
                    <button
                      onClick={() => handleOpenResumeModal(app.resumeUrl)}
                      className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      📄 View Resume
                    </button>
                  )}
                  {user?.role === "company" && (
                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="mt-3 inline-block text-sm font-medium text-green-600 hover:underline"
                    >
                      ✏️ Update Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <button
            onClick={handleCloseResumeModal}
            className="absolute top-2 right-5 text-white hover:text-red-500 text-2xl"
          >
            ✕
          </button>
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 p-4 relative">
            {selectedResume.endsWith(".pdf") ? (
              <iframe
                src={selectedResume}
                className="w-full h-[600px] border rounded"
                title="Resume Preview"
              ></iframe>
            ) : (
              <a
                href={selectedResume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open Resume
              </a>
            )}
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {user?.role === "company" && showStatusModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative ">
            <button
              onClick={handleCloseStatusModal}
              className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-2xl"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Update Status for {selectedApp?.job?.title}
            </h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="Applied">Applied</option>
              <option value="In Review">In Review</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleStatusUpdate}
                className="w-25  bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicationList
