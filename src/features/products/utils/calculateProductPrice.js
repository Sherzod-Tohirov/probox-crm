export default function calculateProductPrice(priceUsd) {
  let percentage = 0;
  let parsedPriceUsd = parseInt(priceUsd);
  if (parsedPriceUsd <= 500) {
    percentage = 0.15;
  } else if (parsedPriceUsd > 500 && parsedPriceUsd <= 1000) {
    percentage = 0.1;
  } else if (parsedPriceUsd > 1000 && parsedPriceUsd <= 2000) {
    percentage = 0.05;
  } else {
    percentage = 0;
  }
  return parsedPriceUsd + parsedPriceUsd * percentage;
}
