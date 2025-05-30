export default function getPercentageColor(percentage) {
  if (percentage >= 0 && percentage <= 40) {
    return "#d51629"; // Red for 0-40%
  } else if (percentage > 40 && percentage <= 50) {
    return "#f6a600"; // Yellow for 41-50%
  } else if (percentage > 60 && percentage <= 80) {
    return "#4caf50"; // Yellow Green for 61-80%
  } else if (percentage > 80 && percentage <= 100) {
    return "#027243"; // Dark Green for 81-100%
  }
  return "#000000"; // Default color for out of range values
}
