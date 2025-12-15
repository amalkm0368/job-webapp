import React from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import JobList from "../components/jobs/JobList"
import SearchJob from "../components/jobs/SearchJob"
import { useSelector } from "react-redux"

const JobPage = () => {
  const { jobs, loading } = useSelector((state) => state.jobs)
  const { user } = useSelector((state) => state.auth)
  return (
    <>
      <Header active={2} />
      <SearchJob />
      <JobList jobs={jobs} loading={loading} user={user} />
      <Footer />
    </>
  )
}

export default JobPage
