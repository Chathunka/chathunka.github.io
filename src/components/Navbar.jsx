import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

const Navbar = ({ darkMode, setDarkMode }) => (
  <nav className="bg-white/10 dark:bg-white/5 backdrop-blur-md shadow p-4 flex justify-between items-center">
    <h1 className="text-xl font-extrabold text-white">Chathunka Tennakoon</h1>
    <div className="flex items-center space-x-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/projects" className="hover:underline">Projects</Link>
      <Link to="/contact" className="hover:underline">Contact</Link>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="ml-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  </nav>
);

export default Navbar;