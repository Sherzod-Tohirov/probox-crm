import haversine from 'haversine-distance';

export default function orderByNearest(stops, start) {
  const remaining = [...stops];
  const ordered = [];

  let current = start;

  while (remaining.length) {
    remaining.sort((a, b) => {
      const aLoc = a.location;
      const bLoc = b.location;

      if (!aLoc || !bLoc) return 0;

      return (
        haversine(current, { lat: aLoc.lat, lng: aLoc.lng }) -
        haversine(current, { lat: bLoc.lat, lng: bLoc.lng })
      );
    });

    const next = remaining.shift();
    if (next?.location) {
      ordered.push(next);
      current = {
        lat: next.location.lat,
        lng: next.location.lng,
      };
    }
  }

  return ordered;
}
