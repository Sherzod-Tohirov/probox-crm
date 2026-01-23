export const normalizeBattery = (isProductNew, battery) => {
  if (isProductNew) return '100%';
  if (!battery) return '-';
  return battery.includes('%') ? battery : String(battery) + '%';
};

export const getBatteryColor = (battery, isProductNew) => {
  if (isProductNew) {
    return 'success';
  }
  let normalizedBattery = parseInt(normalizeBattery(battery, isProductNew));
  if (!normalizedBattery) return 'default';
  if (normalizedBattery > 85) return 'success';
  if (normalizedBattery > 80) return 'warning';
  else return 'danger';
};
