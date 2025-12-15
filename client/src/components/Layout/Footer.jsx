import React from "react"
import { Link } from "react-router-dom"
import { FaBriefcase, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left - Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <FaBriefcase />
          <span>JobHunt</span>
        </div>
        <p className="text-sm text-gray-400">
          Find your dream job or your next hire.
        </p>

        {/* Center - Links */}
        <nav className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-white">
            Home
          </Link>
          <Link to="/jobs" className="hover:text-white">
            Jobs
          </Link>
          <Link to="/about" className="hover:text-white">
            About
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
        </nav>

        {/* Right - Socials */}
        <div className="flex gap-4 text-lg">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            <FaTwitter />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            <FaGithub />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobHunt. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
