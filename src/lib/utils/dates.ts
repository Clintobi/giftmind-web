import { Timestamp } from "firebase/firestore";

export function daysUntilNextOccurrence(date: Timestamp | Date): number {
  const d = date instanceof Timestamp ? date.toDate() : date;
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), d.getMonth(), d.getDate());

  if (thisYear < now) {
    thisYear.setFullYear(now.getFullYear() + 1);
  }

  const diff = thisYear.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(date: Timestamp | Date): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatMonthDay(date: Timestamp | Date): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export function daysSince(date: Timestamp | Date): number {
  const d = date instanceof Timestamp ? date.toDate() : date;
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function getMonthName(date: Timestamp | Date): string {
  const d = date instanceof Timestamp ? date.toDate() : date;
  return d.toLocaleDateString("en-US", { month: "long" });
}
