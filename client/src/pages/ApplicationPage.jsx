import React from "react"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import ApplicationList from "../components/Applications/ApplicationList"

const ApplicationPage = () => {
  return (
    <div>
      <Header active={3} />
      <ApplicationList />
      <Footer />
    </div>
  )
}

export default ApplicationPage
