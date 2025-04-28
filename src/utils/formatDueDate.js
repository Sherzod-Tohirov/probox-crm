import moment from "moment";

const formatDueDate = (dueDate, monthCounter) => {
  if (!dueDate) return "-"; // handle missing values safely
  if (monthCounter === 0) return dueDate; // handle monthCounter 0 case
  // Take only the first 23 characters: "2025-04-15 00:00:00.000"
  const trimmedDueDate = dueDate.slice(0, 23);

  const parsedDate = moment(trimmedDueDate, "YYYY-MM-DD HH:mm:ss.SSS");
 console.log(parsedDate, "parsedDate");
  if (!parsedDate.isValid()) {
    return "-"; // fallback if the date is corrupted
  }

  // Add months (even if 0, it works fine) and format
  const finalDate = parsedDate.add(monthCounter, "months").format("DD.MM.YYYY");
    console.log(finalDate, "finalDate");
  return finalDate !== "Invalid date" ? finalDate : "-"; // handle invalid date case
};

export default formatDueDate;
