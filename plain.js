function getTimeDescription(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const year = date.getFullYear();

  if (date >= today) {
    return "Today";
  } else if (date >= yesterday) {
    return "Yesterday";
  } else if (date >= startOfWeek) {
    return "Last Week";
  } else if (date >= startOfLastWeek) {
    return "Last Week";
  } else if (date >= startOfMonth) {
    return "Last Month";
  } else if (date >= startOfLastMonth) {
    return "Last Month";
  } else {
    return `Year ${year}`;
  }
}

// Example usage:
console.log(getTimeDescription(Date.now())); // Should return "Today"
console.log(getTimeDescription(Date.now() - 86400000)); // Should return "Yesterday"
console.log(getTimeDescription(Date.now() - 7 * 86400000)); // Should return "Last Week"
console.log(getTimeDescription(new Date("2023-05-15").getTime())); // Should return "Last Month" or "Year 2023" based on the current date

console.log(getTimeDescription("14 July 2024 at 12:48:18 UTC+5:30"));
