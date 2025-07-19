import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export const formatDateAndTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    year: "numeric",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "ru-RU",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "ru-RU",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "ru-RU",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatNumber(num: number): string {
  const numStr = num.toString();

  if (numStr.length <= 3) {
    return numStr;
  }

  const spacePosition = numStr.length - 3;

  return numStr.slice(0, spacePosition) + " " + numStr.slice(spacePosition);
}
