import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    speaker: z.string(),
    affiliation: z.string().optional(),
    date: z.coerce.date(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    venue: z.string(),
    status: z.enum(["draft", "published", "cancelled"]).default("draft"),
    speakerUrl: z.union([z.url(), z.literal("")]).optional(),
    summary: z.string().optional(),
    resources: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
  }),
});

export const collections = { talks };
