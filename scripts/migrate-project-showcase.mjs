import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { archiveRoot, organizedRoot, projects } from "./showcase-catalog.mjs";

const repoRoot = path.resolve(import.meta.dirname, "..");
const reportsRoot = path.join(repoRoot, "docs", "project-showcase");
const blogDraftRoot = path.join(reportsRoot, "blog-drafts");
const youtubeRoot = path.join(reportsRoot, "youtube");
const publicCoverRoot = path.join(repoRoot, "public", "assets", "showcase");
const projectContentRoot = path.join(repoRoot, "src", "content", "projects", "showcase");
const assetFolders = ["videos", "images", "documents", "source-links", "blog-assets", "youtube-assets"];
const ignoredNames = new Set([".DS_Store", "desktop.ini"]);
const ignoredPrefix = "._";

const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const normalize = (value) => value.replaceAll("\\", "/");
const clean = (value) => value.replace(/[<>:"/\\|?*]/g, "-").replace(/\s+/g, " ").trim();
const yamlString = (value) => JSON.stringify(value);

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    else result.push(full);
  }
  return result;
}

function sourceFiles(project) {
  const files = [];
  if (project.sourceFolder) {
    const base = path.join(archiveRoot, project.sourceFolder);
    if (fs.existsSync(base)) files.push(...walk(base));
  }
  for (const relative of project.sourceFiles ?? []) files.push(path.join(archiveRoot, relative));
  for (const relative of project.additionalSources ?? []) files.push(path.join(archiveRoot, relative));
  return [...new Set(files)].filter((file) => fs.existsSync(file));
}

function assetType(file) {
  const ext = path.extname(file).toLowerCase();
  if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) return "videos";
  if ([".jpg", ".jpeg", ".png", ".bmp", ".webp", ".gif"].includes(ext)) return "images";
  if ([".pdf", ".docx", ".doc", ".ppt", ".pptx", ".txt"].includes(ext)) return "documents";
  return "source-links";
}

function relativeWithinProject(project, file) {
  if (project.sourceFolder) {
    const base = path.join(archiveRoot, project.sourceFolder);
    if (file.startsWith(base)) return path.relative(base, file);
  }
  return path.basename(file);
}

function copyPreserved(source, target) {
  ensure(path.dirname(target));
  if (fs.existsSync(target)) {
    const sourceStat = fs.statSync(source);
    const targetStat = fs.statSync(target);
    if (sourceStat.size === targetStat.size) return "existing";
  }
  fs.copyFileSync(source, target);
  const stat = fs.statSync(source);
  fs.utimesSync(target, stat.atime, stat.mtime);
  return "copied";
}

function article(project) {
  const tech = project.technologies.join(", ");
  const challengeText = project.challenges.length
    ? project.challenges.map((item) => `- ${item}`).join("\n")
    : "- Recover detailed design constraints and test notes from the archived media.\n- Convert prototype evidence into repeatable engineering documentation.";
  const resultText = project.results.length
    ? project.results.map((item) => `- ${item}`).join("\n")
    : "- Preserved working media and engineering artifacts for future documentation.";
  const futureText = project.future.length
    ? project.future.map((item) => `- ${item}`).join("\n")
    : "- Publish source files, measured results, and a reproducible build guide.";
  const repositoryText = project.repositories.length
    ? project.repositories.map((url) => `- [Repository](${url})`).join("\n")
    : "- Repository placeholder: `https://github.com/Chathunka/<repository-name>`";
  return `---
title: ${yamlString(project.title)}
description: ${yamlString(project.purpose)}
publishDate: 2026-06-19
category: ${yamlString(project.category)}
tags: ${JSON.stringify(project.tags)}
featured: false
cover: ${yamlString(`/assets/showcase/${project.slug}.jpg`)}
draft: true
---

## Introduction

${project.purpose} The archive captures the physical prototype, software interface, documentation, or demonstration evidence needed to turn the work into a reproducible engineering case study.

## Background

This project sits at the intersection of ${project.discipline.toLowerCase()} and ${project.industry.toLowerCase()}. It addresses a practical need with a system built from real hardware, software, or both.

## System Architecture

The available evidence indicates a solution organized around sensing or user input, a control layer, and a physical or software output. A publication-ready architecture diagram should identify interfaces, power or deployment boundaries, and the path from input data to the final action.

## Technologies Used

${project.technologies.map((item) => `- ${item}`).join("\n")}

## Development Process

1. Define the operational objective and constraints.
2. Select the hardware, software, and interfaces needed for the prototype.
3. Build and integrate the control, sensing, communication, or mechanical subsystems.
4. Test the complete workflow using the archived demonstrations.
5. Package the result and record lessons for the next revision.

## Challenges

${challengeText}

## Results

${resultText}

## Future Improvements

${futureText}

## GitHub and Documentation

${repositoryText}

## Video

\`\`\`html
<!-- Replace VIDEO_ID after publishing the demonstration. -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="${project.title}" loading="lazy" allowfullscreen></iframe>
\`\`\`

## Conclusion

${project.title} demonstrates practical experience with ${tech}. The next content pass should add measured performance, diagrams, source references, and a narrated demonstration.
`;
}

function youtube(project) {
  const repos = project.repositories.length
    ? project.repositories.join("\n")
    : "GitHub repository: https://github.com/Chathunka/<repository-name>";
  return `# ${project.title}

## SEO Title

${project.title} | ${project.technologies.slice(0, 3).join(", ")} Engineering Project

## Description

This engineering demonstration presents ${project.title.toLowerCase()}. ${project.purpose}

Technologies used:
${project.technologies.map((item) => `- ${item}`).join("\n")}

Engineering focus:
- ${project.discipline}
- ${project.industry}
- Prototype architecture, integration, and validation

${repos}
EdgeIntellab article: https://edgeintellab.com/projects/showcase/${project.slug}

## Tags

${[...project.tags, "EdgeIntellab", "Engineering Project"].join(", ")}

## Suggested Chapters

00:00 Project overview
00:30 Problem and requirements
01:30 System architecture
03:00 Hardware and software
05:00 Demonstration
07:00 Engineering challenges
08:30 Results and future improvements

## Playlist

${project.category}
`;
}

function projectMarkdown(project) {
  const repositories = project.repositories.length
    ? project.repositories.map((url) => `- [Source or related repository](${url})`).join("\n")
    : "No public repository has been confirmed for this archived project.";
  return `---
title: ${yamlString(project.title)}
description: ${yamlString(project.purpose)}
category: ${yamlString(project.category)}
tags: ${JSON.stringify(project.tags)}
status: ${yamlString(project.status)}
cover: ${yamlString(`/assets/showcase/${project.slug}.jpg`)}
featured: ${project.featured}
specs: ${JSON.stringify(project.specs.length ? project.specs : project.technologies.slice(0, 4))}
gallery: []
industry: ${yamlString(project.industry)}
discipline: ${yamlString(project.discipline)}
archiveStatus: ${yamlString(project.confidence)}
---

## Project Overview

${project.purpose}

## Engineering Context

The project applies ${project.discipline.toLowerCase()} to ${project.industry.toLowerCase()}. The migrated archive includes ${project.assetSummary ?? "images, video, source, or documentation evidence"} that records the implementation and demonstration.

## System Architecture

The system can be understood as an input and sensing layer, a control or processing layer, and an output, actuator, dashboard, or user-interface layer. The archived assets are retained in the organized knowledge base for future diagrams and deeper technical reconstruction.

## Technologies

${project.technologies.map((item) => `- ${item}`).join("\n")}

## Engineering Challenges

${(project.challenges.length ? project.challenges : ["Recovering full design context from historical project assets", "Turning prototype evidence into maintainable technical documentation"]).map((item) => `- ${item}`).join("\n")}

## Results

${(project.results.length ? project.results : ["Preserved a working prototype or recorded engineering demonstration"]).map((item) => `- ${item}`).join("\n")}

## Source and Documentation

${repositories}

## Future Improvements

${(project.future.length ? project.future : ["Publish complete source, diagrams, measured results, and a narrated demonstration"]).map((item) => `- ${item}`).join("\n")}
`;
}

ensure(reportsRoot);
ensure(blogDraftRoot);
ensure(youtubeRoot);
ensure(publicCoverRoot);
ensure(projectContentRoot);
ensure(organizedRoot);

const manifest = [];
const classification = [];
for (const project of projects) {
  const projectRoot = path.join(organizedRoot, clean(project.category), clean(project.title));
  for (const folder of assetFolders) ensure(path.join(projectRoot, folder));
  const files = sourceFiles(project);
  const validFiles = files.filter((file) => {
    const name = path.basename(file);
    return !ignoredNames.has(name) && !name.startsWith(ignoredPrefix);
  });
  const counts = { videos: 0, images: 0, documents: 0, "source-links": 0 };
  let bytes = 0;
  for (const file of validFiles) {
    const type = assetType(file);
    counts[type] += 1;
    bytes += fs.statSync(file).size;
    const relative = relativeWithinProject(project, file);
    const target = path.join(projectRoot, type, relative);
    const result = copyPreserved(file, target);
    manifest.push({
      project: project.title,
      category: project.category,
      assetType: type,
      source: normalize(file),
      target: normalize(target),
      bytes: fs.statSync(file).size,
      result,
      sha256: crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
    });
  }
  project.assetSummary = `${validFiles.length} archived files (${(bytes / 1024 / 1024).toFixed(1)} MB)`;
  classification.push({
    title: project.title,
    slug: project.slug,
    category: project.category,
    industry: project.industry,
    discipline: project.discipline,
    confidence: project.confidence,
    files: validFiles.length,
    sizeMB: Number((bytes / 1024 / 1024).toFixed(1)),
    repositories: project.repositories,
  });
  fs.writeFileSync(path.join(projectRoot, "README.md"), article(project), "utf8");
  fs.writeFileSync(path.join(projectRoot, "youtube-assets", "youtube-package.md"), youtube(project), "utf8");
  fs.writeFileSync(path.join(projectRoot, "blog-assets", "article-draft.md"), article(project), "utf8");
  fs.writeFileSync(path.join(blogDraftRoot, `${project.slug}.md`), article(project), "utf8");
  fs.writeFileSync(path.join(youtubeRoot, `${project.slug}.md`), youtube(project), "utf8");
  if (project.publish) {
    fs.writeFileSync(path.join(projectContentRoot, `${project.slug}.md`), projectMarkdown(project), "utf8");
  }
  if (project.coverSource) {
    const source = path.join(archiveRoot, project.coverSource);
    if (fs.existsSync(source)) {
      await sharp(source)
        .rotate()
        .resize(1440, 900, { fit: "cover", position: "attention" })
        .jpeg({ quality: 84, progressive: true })
        .toFile(path.join(publicCoverRoot, `${project.slug}.jpg`));
      await sharp(source)
        .rotate()
        .resize(1200, 750, { fit: "cover", position: "attention" })
        .jpeg({ quality: 86, progressive: true })
        .toFile(path.join(projectRoot, "blog-assets", "featured-image.jpg"));
    }
  }
}

const csv = [
  "project,category,assetType,source,target,bytes,result,sha256",
  ...manifest.map((item) =>
    [item.project, item.category, item.assetType, item.source, item.target, item.bytes, item.result, item.sha256]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(","),
  ),
].join("\n");
fs.writeFileSync(path.join(reportsRoot, "asset-manifest.csv"), csv, "utf8");
fs.writeFileSync(path.join(reportsRoot, "classification.json"), JSON.stringify(classification, null, 2), "utf8");

const categoryGroups = [...new Set(classification.map((item) => item.category))]
  .sort()
  .map((category) => {
    const items = classification.filter((item) => item.category === category);
    return `## ${category}\n\n${items.map((item) => `- **${item.title}** - ${item.industry}; ${item.discipline}.`).join("\n")}`;
  })
  .join("\n\n");
fs.writeFileSync(
  path.join(reportsRoot, "classification.md"),
  `# Project Classification Report

${categoryGroups}

## Classification notes

- Classification is based on filenames, technical documents, source files, images, and sampled video frames.
- Entries marked as inferred or asset-only should be confirmed before public claims are expanded.
- Multi-disciplinary projects are assigned to the category that best represents their primary engineering value.
`,
  "utf8",
);

const inventoryRows = classification
  .map((item) => `| ${item.title} | ${item.category} | ${item.files} | ${item.sizeMB} MB | ${item.confidence} |`)
  .join("\n");
fs.writeFileSync(
  path.join(reportsRoot, "inventory.md"),
  `# Project Showcase Inventory

Source archive: \`${normalize(archiveRoot)}\`

Organized archive: \`${normalize(organizedRoot)}\`

The migration is non-destructive. Original files remain in place. Finder metadata files such as \`._*\`, \`.DS_Store\`, and \`desktop.ini\` are excluded from the organized copy.

| Project | Classification | Files | Size | Confidence |
| --- | --- | ---: | ---: | --- |
${inventoryRows}

## Totals

- Projects identified: ${projects.length}
- Files mapped: ${manifest.length}
- Data mapped: ${(manifest.reduce((sum, item) => sum + item.bytes, 0) / 1024 / 1024 / 1024).toFixed(2)} GB
- Published showcase pages: ${projects.filter((item) => item.publish).length}
- Blog and YouTube packages: ${projects.length} each
`,
  "utf8",
);

const githubRows = projects
  .map((item) => `| ${item.title} | ${item.repositories.length ? item.repositories.map((url) => `[${url.split("/").at(-1)}](${url})`).join("<br>") : "No confirmed repository"} | ${item.repositories.length ? "Link from project and article" : "Create repository if source is suitable for publication"} |`)
  .join("\n");
fs.writeFileSync(
  path.join(reportsRoot, "github-mapping.md"),
  `# GitHub Repository Mapping

Repository discovery used the public [Chathunka GitHub profile](https://github.com/Chathunka) and project archive evidence.

| Project | Repository mapping | Recommendation |
| --- | --- | --- |
${githubRows}
`,
  "utf8",
);

const moveRows = manifest
  .map((item) => `| ${item.project} | ${item.assetType} | \`${item.source}\` | \`${item.target}\` | ${item.result} |`)
  .join("\n");
fs.writeFileSync(
  path.join(reportsRoot, "restructuring-report.md"),
  `# Folder Restructuring Report

The source archive was preserved. Files were copied to the organized archive and verified with SHA-256 hashes recorded in \`asset-manifest.csv\`.

| Project | Asset type | Source | Organized destination | Result |
| --- | --- | --- | --- | --- |
${moveRows}
`,
  "utf8",
);

const strategy = `# EdgeIntellab Project Content Strategy

## Recommended publishing order

1. 2D SLAM Mobile Robot
2. Industrial Dangerous Gas Monitoring System
3. GSM Smart Cooler Data Logger
4. Four-Channel Humidifier Controller
5. Beer Keg Telemetry RTU
6. Hand-Drawn ER Diagram Digitizer
7. Automatic Tennis Ball Training Machine
8. RFID Inventory Terminal

## Content workflow

1. Select the best archived demonstration and featured image.
2. Confirm dates, hardware versions, responsibilities, and measurable outcomes.
3. Publish the generated article draft after technical review.
4. Edit a 6-10 minute YouTube demonstration using the generated package.
5. Add the final YouTube URL and GitHub link to the project page.
6. Repurpose diagrams and measurements into shorter technical notes.

## Portfolio selection

Prioritize projects that demonstrate full-system ownership, industrial value, cross-domain integration, and measurable engineering complexity. Older educational prototypes should support the career narrative but not displace recent autonomous systems and industrial work.

## Source handling

- Keep the original archive read-only.
- Use \`${normalize(organizedRoot)}\` as the editorial working copy.
- Store web-optimized media in the repository, not original multi-gigabyte videos.
- Publish source code only after checking credentials, licenses, customer information, and proprietary material.
`;
fs.writeFileSync(path.join(reportsRoot, "content-strategy.md"), strategy, "utf8");

const playlistGroups = [...new Set(projects.map((item) => item.category))]
  .sort()
  .map((category) => {
    const items = projects.filter((item) => item.category === category);
    return `## ${category}\n\n${items.map((item) => `- ${item.title}`).join("\n")}`;
  })
  .join("\n\n");
fs.writeFileSync(
  path.join(reportsRoot, "youtube-playlists.md"),
  `# YouTube Playlist Recommendations

${playlistGroups}

## Publishing guidance

- Lead with a 20-30 second working demonstration.
- Follow with the problem, architecture, implementation, and measured result.
- Link the EdgeIntellab project page and confirmed GitHub repositories in every description.
- Use Shorts for single mechanisms, sensor tests, and before/after demonstrations.
`,
  "utf8",
);

const portfolioCandidates = projects
  .filter((item) => item.featured || [
    "et-robocon-entry-robot",
    "modbus-oxygen-sensor-reader",
    "rfid-inventory-terminal",
  ].includes(item.slug))
  .map((item) => `## ${item.title}

**Recruiter summary:** ${item.purpose}

**Engineering value:** Demonstrates ${item.discipline.toLowerCase()} in ${item.industry.toLowerCase()}, using ${item.technologies.join(", ")}.

**Resume-ready bullet:** ${item.results[0] ?? `Built and demonstrated ${item.title.toLowerCase()}.`}
`)
  .join("\n")
  .trimEnd();
fs.writeFileSync(
  path.join(reportsRoot, "portfolio-summaries.md"),
  `# Portfolio Project Summaries

These projects are recommended because they show system ownership, technical complexity, industrial relevance, or a strong working demonstration.

${portfolioCandidates}
`,
  "utf8",
);
fs.writeFileSync(path.join(organizedRoot, "MIGRATION_README.md"), fs.readFileSync(path.join(reportsRoot, "inventory.md"), "utf8"), "utf8");

console.log(`Projects: ${projects.length}`);
console.log(`Mapped files: ${manifest.length}`);
console.log(`Organized archive: ${organizedRoot}`);
console.log(`Reports: ${reportsRoot}`);
