import React, { useEffect, useRef } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import { Toaster } from "react-hot-toast"
import NotFound from "./components/NotFound"
import Home from "./pages/Home"
import { getUser } from "./redux/reducer/authSlice"
import ProtectedRoute from "./components/ProtectedRoute"
import JobPage from "./pages/JobPage"
import PostJob from "./pages/PostJob"
import ApplicationPage from "./pages/ApplicationPage"

const App = () => {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUser())
    }
  }, [dispatch, isAuthenticated])
  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/" element={<Home />} />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              role={user?.role}
              allowRoles={["user", "company"]}
            >
              <JobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/postJob"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              role={user?.role}
              allowRoles={["company"]}
            >
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicants"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              role={user?.role}
              allowRoles={["company", "user"]}
            >
              <ApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right " reverseOrder={false} />
    </>
  )
}

export default App
