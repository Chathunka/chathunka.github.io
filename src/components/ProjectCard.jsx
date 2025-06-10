import React from "react";

const ProjectCard = ({ title, description, tech, link }) => (
  <div className="bg-slate dark:bg-white rounded-xl shadow p-4 hover:shadow-md transition border border-neon">
    <h3 className="text-lg font-bold mb-2 text-neon">{title}</h3>
    <p className="text-sm text-light-gray dark:text-gray-800 mb-2">{description}</p>
    <div className="text-xs text-light-gray dark:text-gray-600 mb-2">{tech.join(", ")}</div>
    <a href={link} target="_blank" rel="noreferrer" className="text-neon hover:underline">
      View on GitHub
    </a>
  </div>
);

export default ProjectCard;