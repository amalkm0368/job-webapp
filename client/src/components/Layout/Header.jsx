import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FaUserCircle,
  FaBell,
  FaBriefcase,
  FaBars,
  FaTimes,
} from "react-icons/fa"
import { IoMdArrowDropup } from "react-icons/io"
import { logout } from "../../redux/reducer/authSlice"

const nav = [
  { name: "Home", path: "/" },
  { name: "Jobs", path: "/jobs" },
  { name: "Applicants", path: "/applicants" },
]

const Header = ({ active }) => {
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false) // profile dropdown
  const [menuOpen, setMenuOpen] = useState(false) // mobile nav
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left - Logo */}
      <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
        <FaBriefcase />
        <span>JobHunt</span>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
        {nav.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            className={`${
              active === i + 1 ? "text-blue-600" : "text-gray-700"
            } hover:text-blue-600`}
          >
            {item.name}
          </Link>
        ))}

        {/* If company role -> extra nav */}
        {user?.role === "company" && (
          <Link
            to="/postJob"
            className={`${
              active === 4 ? "text-blue-600" : "text-gray-700"
            } hover:text-blue-600`}
          >
            Post Job
          </Link>
        )}
      </nav>

      {/* Right Section */}
      <div className="relative flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Notifications & Profile */}
        <div
          className="flex items-center gap-4 cursor-pointer relative"
          onClick={() => setOpen(!open)}
        >
          {user ? (
            <>
              <FaBell className="text-gray-600 text-xl hover:text-blue-600" />
              <img
                src={
                  user?.profileImage
                    ? user.profileImage.startsWith("http")
                      ? user.profileImage
                      : `http://localhost:5001/uploads/${user.profileImage
                          .replace(/^src[\\/]+uploads[\\/]+/, "")
                          .replace(/\\/g, "/")}`
                    : "/default-avatar.png"
                }
                alt="profile"
                className="w-[38px] h-[40px] rounded-full object-cover"
              />
              {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md border z-40">
                  <div className="p-3 border-b">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <Link
                      to="/profile"
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left px-4 py-2 text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Link to="/login">
              <FaUserCircle className="text-gray-600 text-2xl hover:text-blue-600" />
            </Link>
          )}
        </div>

        {/* Profile Dropdown */}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[64px] left-0 w-full bg-white shadow-md md:hidden z-40">
          <nav className="flex flex-col gap-4 p-4">
            {nav.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className={`${
                  active === i + 1 ? "text-blue-600" : "text-gray-700"
                } hover:text-blue-600`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user?.role === "company" && (
              <Link
                to="/postJob"
                className="hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Post Job
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
