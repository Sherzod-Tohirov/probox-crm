export function normalizeFilterState(
  filterState,
  branchOptions = [],
  operator1Options = [],
  operator2Options = [],
  sourceOptions = [],
  sellerOptions = [],
  scoringOptions = []
) {
  const normalized = { ...filterState };

  const toArrayFromCSV = (csv, options) => {
    if (typeof csv !== 'string' || !csv) return [];
    const values = csv.split(',');
    return values.map((value) => {
      const option = options.find(
        (opt) => opt.value === value || opt.value === parseInt(value)
      );
      return option || { value, label: value };
    });
  };

  if (!Array.isArray(normalized.source)) {
    normalized.source = toArrayFromCSV(normalized.source, sourceOptions);
  }
  if (!Array.isArray(normalized.branch)) {
    normalized.branch = toArrayFromCSV(normalized.branch, branchOptions);
  }
  if (!Array.isArray(normalized.operator)) {
    normalized.operator = toArrayFromCSV(normalized.operator, operator1Options);
  }
  if (!Array.isArray(normalized.operator2)) {
    normalized.operator2 = toArrayFromCSV(
      normalized.operator2,
      operator2Options
    );
  }
  if (!Array.isArray(normalized.seller)) {
    normalized.seller = toArrayFromCSV(normalized.seller, sellerOptions);
  }
  if (!Array.isArray(normalized.scoring)) {
    normalized.scoring = toArrayFromCSV(normalized.scoring, scoringOptions);
  }

  return normalized;
}

export function serializeFilter(values) {
  const payload = { ...values };

  // Normalize meeting if it's an option object
  if (payload.meeting && typeof payload.meeting === 'object') {
    payload.meeting = payload.meeting.value;
  }

  // Omit meeting and dates when meeting is not selected (Hammasi)
  if (
    payload.meeting === '' ||
    payload.meeting === undefined ||
    payload.meeting === null
  ) {
    delete payload.meeting;
    delete payload.meetingDateStart;
    delete payload.meetingDateEnd;
  }

  console.log(payload, 'payload');

  const serializeMulti = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((item) => (typeof item === 'object' ? item.value : item))
          .join(',')
      : arr;

  if (payload.source) payload.source = serializeMulti(payload.source);
  if (payload.branch) payload.branch = serializeMulti(payload.branch);
  if (payload.operator) payload.operator = serializeMulti(payload.operator);
  if (payload.operator2) payload.operator2 = serializeMulti(payload.operator2);
  if (payload.seller) payload.seller = serializeMulti(payload.seller);
  if (payload.scoring) payload.scoring = serializeMulti(payload.scoring);

  // Remove empty-like values except valid booleans/numbers
  Object.keys(payload).forEach((key) => {
    const val = payload[key];
    if (Array.isArray(val) && val.length === 0) {
      delete payload[key];
      return;
    }
    if (typeof val === 'string' && val.trim() === '') {
      delete payload[key];
      return;
    }
    if (val === null || val === undefined) {
      delete payload[key];
      return;
    }
    // keep booleans (including false) and numbers as-is
  });

  return payload;
}

export function persistFilterToStorage(filter) {
  try {
    const raw = localStorage.getItem('leadsPageState');
    const prev = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      'leadsPageState',
      JSON.stringify({
        ...prev,
        filterDraft: filter,
      })
    );
  } catch (_) {
    // ignore
  }
}
