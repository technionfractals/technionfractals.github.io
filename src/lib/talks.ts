import type { CollectionEntry } from "astro:content";

export type Talk = CollectionEntry<"talks">;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const datePartsFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Jerusalem",
});
const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long", timeZone: "Asia/Jerusalem",
});
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Jerusalem",
});

export const formatTalkDate = (date: Date) => {
  const parts = Object.fromEntries(datePartsFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.day} ${months[Number(parts.month) - 1]} ${parts.year}`;
};
export const formatTalkWeekday = (date: Date) => weekdayFormatter.format(date);
export const formatTalkTime = (date: Date) => timeFormatter.format(date);
