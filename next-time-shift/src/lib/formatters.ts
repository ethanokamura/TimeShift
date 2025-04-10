export function formatEventDescription (durationInMinutes: number) {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const minutesString = `${minutes} ${minutes === 1 ? "min" : "mins"}`
  const hoursString = `${hours} ${hours === 1 ? "min" : "mins"}`
  if (hours === 0) return minutesString;
  if (minutes === 0) return hoursString;
  return `${hoursString} ${minutesString}`
}

// 23:52 -> 23.52
export function timeToInt(time: string) {
  return parseFloat(time.replace(":", "."));
}

export function formatTimezoneOffset(timezone: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type == "timeZoneName")?.value;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});


export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function formatTimeString(date: Date) {
  return timeFormatter.format(date);
}

export function formatDateTime(date: Date) {
  return dateTimeFormatter.format(date);
}