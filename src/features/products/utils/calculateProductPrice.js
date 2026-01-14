export default function calculateProductPrice(priceUsd) {
  let percentage = 0;
  if (priceUsd <= 500) {
    percentage = 0.15;
  } else if (priceUsd > 500 && priceUsd <= 1000) {
    percentage = 0.1;
  } else if (priceUsd > 1000 && priceUsd <= 2000) {
    percentage = 0.05;
  } else {
    percentage = 0;
  }
  return priceUsd + priceUsd / percentage;
}
