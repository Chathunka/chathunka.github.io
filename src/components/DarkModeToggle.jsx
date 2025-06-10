import React, { useEffect, useState } from 'react'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="bg-gray-700 px-3 py-1 rounded text-sm"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
