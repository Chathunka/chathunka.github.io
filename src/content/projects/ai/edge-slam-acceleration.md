---
title: "Embedded SLAM Acceleration on GPU and FPGA"
description: "A technical project template for porting SLAM workloads to embedded GPU and FPGA hardware with benchmarks and power-aware tradeoffs."
category: "AI & Machine Learning"
tags: ["SLAM", "Jetson", "FPGA", "CUDA", "Kria K26"]
status: "Research"
cover: "/assets/covers/project-slam.jpg"
featured: true
github: "https://github.com/edgeintellab/embedded-slam-acceleration"
specs:
  - "Targets: Jetson Orin Nano and Kria K26"
  - "Workload: 3D SLAM, sensor fusion, map update"
  - "Metrics: latency, throughput, memory pressure, power"
  - "Outputs: benchmark reports and optimization notes"
---

## Architecture

SLAM acceleration work starts by identifying hot paths: scan matching, map updates, point cloud filtering, and transform operations. Each path can be benchmarked on CPU, GPU, and FPGA implementations.

## Benchmark notes

Benchmarks should record dataset, sensor rate, map size, memory behavior, and thermal conditions. Without that context, performance numbers are hard to compare.

## Documentation model

Project pages can include architecture diagrams, profiling screenshots, benchmark tables, source links, and hardware configuration notes.
