import React, { useEffect } from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import JobList from "../components/jobs/JobList"
import { useSelector } from "react-redux"

const Home = () => {
  const { jobs, loading } = useSelector((state) => state.jobs)
  const { user } = useSelector((state) => state.auth)

  return (
    <>
      <Header active={1} />
      <JobList jobs={jobs} loading={loading} user={user} />
      <Footer />
    </>
  )
}

export default Home
