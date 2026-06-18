---
title: "ROS 2 Robot Reference Platform"
description: "A reference architecture for a mobile robot using ROS 2, micro-ROS, ESP32-S3 motor control, LiDAR, and Raspberry Pi coordination."
category: "Robotics"
tags: ["ROS 2", "micro-ROS", "ESP32-S3", "LiDAR", "Raspberry Pi"]
status: "Reference"
cover: "/assets/covers/project-robot.jpg"
featured: true
github: "https://github.com/edgeintellab/ros2-robot-reference"
specs:
  - "Host computer: Raspberry Pi running ROS 2"
  - "Motor controller: ESP32-S3 with micro-ROS"
  - "Transport: UDP and USB serial diagnostics"
  - "Sensors: 2D LiDAR, wheel feedback, optional IMU"
---

## Architecture

This reference platform separates planning and control. ROS 2 nodes manage teleoperation, navigation, mapping, and visualization. The ESP32-S3 motor controller handles timing-sensitive motor output and safety behavior.

## Documentation model

Each project page can include wiring diagrams, control flow, launch files, firmware setup, test logs, and video demonstrations.

## Expansion points

- Add encoder odometry.
- Integrate frontier detection.
- Add obstacle avoidance.
- Record rosbag datasets for repeatable testing.
