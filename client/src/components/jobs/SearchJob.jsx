import React, { useState, useEffect } from "react"
import { FaSearch } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { filtersSearch, getAllJobs } from "../../redux/reducer/jobSlice"

const SearchJob = ({ onSearch }) => {
  const { dbFilters } = useSelector((state) => state.jobs)

  const [filters, setFilters] = useState({
    q: "",
    title: "",
    location: "",
    skills: "",
  })

  const [suggestions, setSuggestions] = useState({
    titles: [],
    locations: [],
    skills: [],
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(filtersSearch())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })

    if (value) {
      if (name === "title") {
        setSuggestions({
          ...suggestions,
          titles: dbFilters.titles.filter((t) =>
            t.toLowerCase().includes(value.toLowerCase())
          ),
        })
      } else if (name === "location") {
        setSuggestions({
          ...suggestions,
          locations: dbFilters.locations.filter((l) =>
            l.toLowerCase().includes(value.toLowerCase())
          ),
        })
      } else if (name === "skill") {
        setSuggestions({
          ...suggestions,
          skills: dbFilters.skills.filter((s) =>
            s.toLowerCase().includes(value.toLowerCase())
          ),
        })
      }
    } else {
      setSuggestions({ titles: [], locations: [], skills: [] })
    }
  }

  const handleSuggestionClick = (name, value) => {
    setFilters({ ...filters, [name]: value })
    setSuggestions({ ...suggestions, [name + "s"]: [] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(getAllJobs(filters))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 px-6 w-full flex flex-col sm:flex-row gap-3 justify-center relative"
    >
      {/* Keyword Search */}
      <div className="flex items-center border border-gray-300 rounded-full bg-white px-4 py-2 w-full sm:w-1/4">
        <FaSearch className="text-gray-400 text-lg mr-2" />
        <input
          type="text"
          name="q"
          value={filters.q}
          onChange={handleChange}
          placeholder="Keyword..."
          className="w-full outline-none bg-transparent text-gray-700"
        />
      </div>

      {/* Title */}
      <div className="relative w-full sm:w-1/4">
        <input
          type="text"
          name="title"
          value={filters.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="border border-gray-300 rounded-full px-4 py-2 w-full outline-none"
        />
        {suggestions.titles.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow">
            {suggestions.titles.map((t) => (
              <li
                key={t}
                onClick={() => handleSuggestionClick("title", t)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Location */}
      <div className="relative w-full sm:w-1/4">
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleChange}
          placeholder="Location"
          className="border border-gray-300 rounded-full px-4 py-2 w-full outline-none"
        />
        {suggestions.locations.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow">
            {suggestions.locations.map((loc) => (
              <li
                key={loc}
                onClick={() => handleSuggestionClick("location", loc)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {loc}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Skills */}
      <div className="relative w-full sm:w-1/4">
        <input
          type="text"
          name="skill"
          value={filters.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="border border-gray-300 rounded-full px-4 py-2 w-full outline-none"
        />
        {suggestions.skills.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow">
            {suggestions.skills.map((s) => (
              <li
                key={s}
                onClick={() => handleSuggestionClick("skills", s)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  )
}

export default SearchJob
