export const site = {
  name: "EdgeIntellab",
  url: "https://edgeintellab.com",
  description:
    "A technical publication for embedded systems, edge AI, robotics, electronics, software engineering, Linux, IoT, and automotive systems.",
  defaultImage: "/assets/covers/hero.jpg",
  nav: [
    { label: "Articles", href: "/articles" },
    { label: "Projects", href: "/projects" },
    { label: "Videos", href: "/videos" },
    { label: "Categories", href: "/categories" },
  ],
};

export function formatDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function readingTime(body = "") {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryPath(category) {
  return `/categories/${slugify(category)}`;
}
