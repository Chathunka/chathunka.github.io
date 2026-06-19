import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    cover: z.string(),
    canonical: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    status: z.string(),
    cover: z.string(),
    featured: z.boolean().default(false),
    github: z.url().optional(),
    video: z.url().optional(),
    specs: z.array(z.string()).default([]),
    gallery: z.array(z.string()).default([]),
    industry: z.string().optional(),
    discipline: z.string().optional(),
    archiveStatus: z.string().optional(),
  }),
});

export const collections = { posts, projects };
