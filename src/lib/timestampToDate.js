export function timeDescription(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  if (date.getTime() >= startOfToday) {
    return "Today";
  } else if (date.getTime() >= startOfToday - oneDay) {
    return "Yesterday";
  } else if (date.getTime() >= startOfToday - oneWeek) {
    return "Last week";
  } else if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() - 1
  ) {
    return "Last month";
  } else {
    return `${date.getFullYear()}`;
  }
}
