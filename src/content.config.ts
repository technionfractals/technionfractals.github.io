import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { getLegacyDuration, getTalkDay } from "./lib/talks";

const resources = z.preprocess(
  (value) => Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => {
        if (!item || typeof item !== "object") return false;
        const candidate = item as Record<string, unknown>;
        if (candidate.type === "link" || candidate.type === "file") {
          return typeof candidate.label === "string" && candidate.label.trim().length > 0
            && typeof candidate.url === "string" && candidate.url.trim().length > 0;
        }
        if (candidate.type === "note") {
          return typeof candidate.label === "string" && candidate.label.trim().length > 0
            && typeof candidate.text === "string" && candidate.text.trim().length > 0;
        }
        if (candidate.type === "text") {
          return typeof candidate.text === "string" && candidate.text.trim().length > 0;
        }
        return false;
      })
    : [],
  z.array(z.discriminatedUnion("type", [
    z.object({ type: z.enum(["link", "file"]), label: z.string().min(1), url: z.string().min(1) }),
    z.object({ type: z.literal("note"), label: z.string().min(1), text: z.string().min(1) }),
    z.object({ type: z.literal("text"), text: z.string().min(1) }),
  ])),
);

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string(),
    speaker: z.string(),
    affiliation: z.string().optional(),
    timezone: z.string().trim().min(1).refine((value) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "Use an IANA time zone such as Asia/Jerusalem").default("Asia/Jerusalem"),
    showTimezone: z.boolean().default(false),
    venue: z.string(),
    status: z.enum(["draft", "published", "cancelled", "demo"]).default("draft"),
    speakerUrl: z.union([z.url(), z.literal("")]).optional(),
    tags: z.array(z.string().trim().min(1)).default([]),
    summary: z.string().optional(),
    resources,
  }).and(z.union([
    z.object({
      startTime: z.iso.datetime({ local: true, precision: -1 }).regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
      duration: z.number().int().positive().default(60),
    }),
    z.object({
      date: z.coerce.date(),
      startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    }),
  ])).transform((talk) => {
    if (!("date" in talk)) return talk;
    const { date, startTime, endTime, ...details } = talk;
    const start = `${getTalkDay(date)}T${startTime}`;
    return {
      ...details,
      startTime: start,
      duration: getLegacyDuration(start, endTime, details.timezone),
    };
  }),
});

export const collections = { talks };
