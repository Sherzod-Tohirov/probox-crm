export const isHourOnly = (datePickerOptions = {}) => {
  try {
    return datePickerOptions?.minuteIncrement === 60;
  } catch (_) {
    return false;
  }
};

export const normalizeToTopOfHour = (date) => {
  if (!date) return date;
  const nd = new Date(date);
  nd.setMinutes(0, 0, 0);
  return nd;
};

export const applyHourOnlyGuards = (instance) => {
  if (!instance) return;
  const me = instance.minuteElement;
  if (me) {
    me.setAttribute('disabled', 'disabled');
    me.setAttribute('readonly', 'readonly');
    if (me.parentElement) {
      me.parentElement.style.pointerEvents = 'none';
    }
  }
};

export const computeAllowInput = (allowInput, hourOnly) => {
  return hourOnly ? false : (allowInput ?? false);
};
