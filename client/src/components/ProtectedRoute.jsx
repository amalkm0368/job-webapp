import React from "react"
import toast from "react-hot-toast"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, isAuthenticated, role, allowRoles }) => {
  if (!isAuthenticated) {
    toast.error("Please login to access this page")
    return <Navigate to="/login" />
  }
  if (allowRoles.length > 0 && !allowRoles.includes(role)) {
    toast.error("Unauthorized user")
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedRoute
