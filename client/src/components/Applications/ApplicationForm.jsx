import React, { useState } from "react"
import * as pdfjsLib from "pdfjs-dist/build/pdf"
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url"
import { useDispatch, useSelector } from "react-redux"
import { applyToJob } from "../../redux/reducer/applicationSlice"
import toast from "react-hot-toast"

// tell pdf.js where the worker is
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const ApplicationForm = ({ onClose, onSubmit, jobId }) => {
  const { user } = useSelector((state) => state.auth)
  console.log(user)
  const [step, setStep] = useState(1)
  const [resume, setResume] = useState(null)

  const [note, setNote] = useState("")

  const [previewUrl, setPreviewUrl] = useState(null)
  const dispatch = useDispatch()
  const handleResumeChange = async (e) => {
    const file = e.target.files[0]
    console.log(file)
    setResume(file)

    if (file && file.type === "application/pdf") {
      const reader = new FileReader()
      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result)

        // Load PDF
        const pdf = await pdfjsLib.getDocument(typedarray).promise
        const page = await pdf.getPage(1)

        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({ canvasContext: context, viewport }).promise
        setPreviewUrl(canvas.toDataURL())
      }
      reader.readAsArrayBuffer(file)
    } else if (
      file &&
      (file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      setPreviewUrl("/word-icon.png") // fallback icon
    } else {
      setPreviewUrl(null)
    }
  }

  const handleNext = () => {
    if (!resume) return alert("Please upload your resume first.")
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("note", note)
    try {
      dispatch(applyToJob({ jobId, formData })).unwrap()
      toast.success("apply successfuly")
      setNote("")
      setResume(null)
      onClose()
    } catch (error) {
      toast.error(error)
      setNote("")
      setResume(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">Job Application</h2>

        {/* Step 1: Resume Upload */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 relative">
            {/* Hidden Input */}
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="hidden"
            />

            {/* If no file uploaded */}
            {!resume && (
              <div className="flex flex-col items-center justify-center h-64 w-full">
                <p className="text-gray-600 mb-4">
                  Upload your resume (PDF/DOCX)
                </p>
                <label
                  htmlFor="resume"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Choose File
                </label>
              </div>
            )}

            {/* If file uploaded */}
            {resume && (
              <div className="w-full flex flex-col items-center">
                {/* Change Resume Button */}
                <label
                  htmlFor="resume"
                  className="mt-3 cursor-pointer px-4 py-2  text-white rounded-lg "
                >
                  <div className="w-full flex justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Resume Preview"
                        className="max-h-[250px]  border rounded shadow"
                      />
                    ) : (
                      <img
                        src="/word-icon.png"
                        alt="Word Resume"
                        className="h-32 w-32 object-contain"
                      />
                    )}
                  </div>

                  <p className="mt-2 text-sm text-green-600">
                    Selected: {resume.name}
                  </p>
                </label>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Other Details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Note */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows="4"
                placeholder="Why are you a good fit for this role?"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ApplicationForm
