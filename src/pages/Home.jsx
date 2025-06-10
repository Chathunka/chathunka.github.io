import React from "react";

const Home = () => (
// Add this below the existing content in Home.jsx
<div className="mt-8 max-w-2xl mx-auto text-left text-gray-700 space-y-4">
  <p>
    I’m Chathunka Tennakoon — a creator of intelligent machines and explorer of the edge where software meets hardware. My passion lies in breathing life into robots: giving them eyes with LIDAR, a brain with ROS 2, and a voice through embedded systems like ESP32.
  </p>
  <p>
    Whether it’s writing C++ to stitch together a 2D map of the world or optimizing CUDA code to run faster on a Jetson board the size of a credit card, I love turning complex systems into real-time performance. I work across the full stack of robotics—from firmware to frontends—designing systems that not only work but work beautifully.
  </p>
  <p>
    My toolbox includes:
    <ul className="list-disc list-inside ml-4">
      <li>🧠 Custom SLAM systems and sensor fusion algorithms</li>
      <li>🛠️ Cross-compiled CUDA pipelines for NVIDIA Jetson</li>
      <li>⚡ Micro-ROS firmware on ESP32 for real-time control</li>
      <li>🌐 Web-based robot dashboards for remote interaction</li>
    </ul>
  </p>
  <p>
    I believe robots should be more than machines — they should be intuitive collaborators. Let's build the future, one line of code at a time.
  </p>
</div>

);

export default Home;