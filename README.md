# EdgeIntellab

Static technology publication and private professional portfolio built with Astro for GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

Build production output:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

## Add a blog post

Create a Markdown file under `src/content/posts/<category>/<slug>.md`.

Required frontmatter:

```yaml
---
title: "Post title"
description: "SEO description"
publishDate: 2026-06-19
category: "Embedded Systems"
tags: ["STM32", "Firmware"]
featured: false
cover: "/assets/covers/embedded-systems.jpg"
---
```

Article pages automatically render SEO metadata, Open Graph tags, reading time, syntax highlighting, a table of contents, social share links, and ad slots.

## Add a project

Create a Markdown file under `src/content/projects/<category>/<slug>.md`.

Required frontmatter:

```yaml
---
title: "Project title"
description: "Project summary"
category: "Robotics"
tags: ["ROS 2", "ESP32"]
status: "Reference"
cover: "/assets/covers/project-robot.jpg"
featured: true
github: "https://github.com/example/repo"
specs:
  - "Controller: ESP32-S3"
---
```

Project pages support Markdown documentation, image covers, GitHub links, video links, and technical specification lists.

## Add a YouTube video

Edit `src/data/videos.js` and add a new object:

```js
{
  title: "Video title",
  description: "Short description",
  category: "Featured Tutorials",
  youtubeId: "VIDEO_ID",
  duration: "18 min",
  featured: false,
}
```

The videos page and homepage featured video section will update from this data.

## Add Google AdSense

The AdSense publisher script and account metadata are configured in `src/layouts/BaseLayout.astro`. Publisher verification is also available through `public/ads.txt`.

Ad zones are centralized in `src/components/AdSlot.astro`. Replace placeholder markup with responsive `<ins class="adsbygoogle">` units after creating manual ad slots in AdSense.

Current placement types:

- Header ad
- Sidebar ad
- In-article ad
- Footer ad

Do not add publisher or slot IDs to Markdown content files.

## Private portfolio

The private recruiter portfolio is available at `/chathunka`. It is intentionally not linked from public navigation, footer, homepage, or sitemap output. It also uses `noindex` metadata and `robots.txt` disallow rules.

The portfolio content is generated from `src/data/portfolio.js`, which was prepared from the CV files in `temp/`.

## GitHub Pages deployment

The project is configured for the custom domain `edgeintellab.com` with `public/CNAME`.

Deploy manually:

```bash
npm run deploy
```

Or configure GitHub Pages to publish the `dist` artifact from CI after `npm run build`.

## Notes

- `temp/` is ignored and should not be committed.
- Public pages do not expose private CV data.
- Generated static output is written to `dist/`.
