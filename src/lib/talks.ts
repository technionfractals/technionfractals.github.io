import type { CollectionEntry } from "astro:content";

export type Talk = CollectionEntry<"talks">;

export const isListedTalk = ({ data }: Talk) =>
  data.status === "published"
  || (import.meta.env.DEV && data.status === "draft");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const datePartsFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Jerusalem",
});
export const formatTalkDate = (date: Date) => {
  const parts = Object.fromEntries(datePartsFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.day} ${months[Number(parts.month) - 1]} ${parts.year}`;
};
export const getTalkDay = (date: Date) => date.toISOString().slice(0, 10);
export const getTalkInstant = (day: string, time: string, timeZone: string) => {
  const wallTime = Date.parse(`${day}T${time}:00Z`);
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  const wallTimeAt = (instant: number) => {
    const parts = Object.fromEntries(formatter.formatToParts(instant).map(({ type, value }) => [type, value]));
    return Date.parse(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
  };
  const dayInMilliseconds = 86_400_000;
  // Try the offsets on either side of a clock change, preferring the earlier
  // instant when a wall time occurs twice.
  const matches = [wallTime - dayInMilliseconds, wallTime + dayInMilliseconds]
    .map((probe) => wallTime - (wallTimeAt(probe) - probe))
    .filter((instant) => wallTimeAt(instant) === wallTime);
  return matches.length ? new Date(Math.min(...matches)) : undefined;
};
export const getLegacyDuration = (startTime: string, endTime: string, timeZone: string) => {
  const [day, time] = startTime.split("T");
  const endDay = endTime < time ? getTalkDay(new Date(Date.parse(day) + 86_400_000)) : day;
  const start = getTalkInstant(day, time, timeZone);
  const end = getTalkInstant(endDay, endTime, timeZone);
  const elapsed = start && end ? end.getTime() - start.getTime()
    : Date.parse(`${endDay}T${endTime}Z`) - Date.parse(`${startTime}Z`);
  return elapsed / 60_000;
};

export const formatTalkSchedule = (start: Date, end: Date, timeZone: string) => {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone, day: "2-digit", month: "short", year: "numeric",
  });
  const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long" });
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const startDate = dateFormatter.format(start);
  const endDate = dateFormatter.format(end);
  const endLabel = startDate === endDate ? "" : `${endDate}, ${weekdayFormatter.format(end)}, `;
  return `${startDate}, ${weekdayFormatter.format(start)}, ${timeFormatter.format(start)}–${endLabel}${timeFormatter.format(end)}`;
};

export const formatTalkTimeZone = (date: Date, timeZone: string) => {
  const offset = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date).find(({ type }) => type === "timeZoneName")?.value;
  return offset?.replace("GMT", "UTC") ?? timeZone;
};
const compareTalkSpeakers = (a: Talk, b: Talk) =>
  a.data.speaker.localeCompare(b.data.speaker, "en", { sensitivity: "base" })
  || a.data.title.localeCompare(b.data.title, "en", { sensitivity: "base" });
export const compareTalksNewestFirst = (a: Talk, b: Talk) =>
  b.data.startTime.localeCompare(a.data.startTime) || compareTalkSpeakers(a, b);
export const compareTalksSoonestFirst = (a: Talk, b: Talk) =>
  a.data.startTime.localeCompare(b.data.startTime) || compareTalkSpeakers(a, b);
