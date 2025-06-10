import React from "react";
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "Jetson CUDA Debugging Pipeline",
    description: "Cross-compiled CUDA apps with remote debugging + Nsight visualization for Jetson Orin Nano.",
    tech: ["CUDA", "Jetson", "Nsight", "CMake"],
    link: "https://github.com/Chathunka"
  },
  {
    title: "2D SLAM with Correlative Scan Matching",
    description: "Custom SLAM in C++ using CSM algorithm, LIDAR input, and ROS2 integration for robot navigation.",
    tech: ["C++", "SLAM", "ROS 2", "RPLIDAR"],
    link: "https://github.com/Chathunka"
  },
  {
    title: "ESP32 micro-ROS Motor Controller",
    description: "Micro-ROS ESP32 firmware for cmd_vel control via USB serial, integrated with ROS2 stack.",
    tech: ["ESP32", "Micro-ROS", "USB Serial"],
    link: "https://github.com/Chathunka"
  }
];

const Projects = () => (
  <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {projects.map((project, idx) => <ProjectCard key={idx} {...project} />)}
  </div>
);

export default Projects;