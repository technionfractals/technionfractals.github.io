import type { CollectionEntry } from "astro:content";

export type Talk = CollectionEntry<"talks">;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const datePartsFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Jerusalem",
});
const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long", timeZone: "Asia/Jerusalem",
});
export const formatTalkDate = (date: Date) => {
  const parts = Object.fromEntries(datePartsFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.day} ${months[Number(parts.month) - 1]} ${parts.year}`;
};
export const formatTalkWeekday = (date: Date) => weekdayFormatter.format(date);
export const getTalkDay = (date: Date) => date.toISOString().slice(0, 10);
export const formatTalkTimeZone = (date: Date, timeZone: string) => {
  const referenceTime = new Date(`${getTalkDay(date)}T12:00:00Z`);
  const offset = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(referenceTime).find(({ type }) => type === "timeZoneName")?.value;
  if (!offset) return timeZone;
  return offset
    .replace("GMT", "UTC")
    .replace(/^UTC([+-])0?(\d{1,2}):00$/, "UTC$1$2")
    .replace(/^UTC([+-])0?(\d{1,2}):(\d{2})$/, "UTC$1$2:$3");
};
const compareTalkSpeakers = (a: Talk, b: Talk) =>
  a.data.speaker.localeCompare(b.data.speaker, "en", { sensitivity: "base" })
  || a.data.title.localeCompare(b.data.title, "en", { sensitivity: "base" });
export const compareTalksNewestFirst = (a: Talk, b: Talk) => {
  const dateDifference = b.data.date.getTime() - a.data.date.getTime();
  return dateDifference
    || b.data.startTime.localeCompare(a.data.startTime)
    || compareTalkSpeakers(a, b);
};
export const compareTalksSoonestFirst = (a: Talk, b: Talk) => {
  const dateDifference = a.data.date.getTime() - b.data.date.getTime();
  return dateDifference
    || a.data.startTime.localeCompare(b.data.startTime)
    || compareTalkSpeakers(a, b);
};
