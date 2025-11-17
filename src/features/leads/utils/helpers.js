const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9,.-]/g, '').replace(/,/g, '.');
    if (!cleaned || cleaned === '-' || cleaned === '.') return null;
    const num = Number(cleaned);
    return Number.isNaN(num) ? null : num;
  }
  return null;
};

const parseNumber = (value) => {
  const normalized = normalizeNumber(value);
  return normalized === null ? '' : normalized;
};

const parseBoolean = (value) => {
  if (value === '' || value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'null' || normalized === '-') return '';
    if (['true', '1', 'ha', 'yes'].includes(normalized)) return true;
    if (['false', '0', "yo'q", 'no'].includes(normalized)) return false;
  }
  return Boolean(value);
};

export { normalizeNumber, parseNumber, parseBoolean };
