import haversine from "haversine-distance";

export default function orderByNearest(stops, start) {
  const remaining = [...stops];
  const ordered = [];

  let current = start;

  while (remaining.length) {
    remaining.sort((a, b) => haversine(current, a) - haversine(current, b));
    const next = remaining.shift();
    if (next) {
      ordered.push(next);
      current = next;
    }
  }
  return ordered;
}
