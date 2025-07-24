const percentageColors = [
  '#D32F2F', // 0% (Deep Red)
  '#E64A19', // 11% (Red-Orange)
  '#F57C00', // 22% (Orange)
  '#FF8F00', // 33% (Dark Orange)
  '#FFA726', // 44% (Orange-Yellow)
  '#FFB300', // 55% (Amber)
  '#C0CA33', // 66% (Yellow-Green)
  '#9CCC65', // 77% (Light Green)
  '#7CB342', // 88% (Green)
  '#4CAF50', // 100% (Deep Green)
];

// Example: Mapping a percentage to a color
export default function getPercentageColor(percentage) {
  const index = Math.min(Math.floor(percentage / 10), 9); // Map 0-100% to 0-9 index
  return percentageColors[index];
}
