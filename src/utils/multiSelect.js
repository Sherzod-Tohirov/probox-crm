import _ from 'lodash';

export const getMultiSelectValue = (options = []) => {
  if (!Array.isArray(options)) return '';
  const value = options?.map((opt) => opt.value);
  return value?.join(',') ?? value;
};

export const getMultiSelectOptions = (templateOptions = [], value = '') => {
  if (typeof value !== 'string') return [];
  const options = value?.split(',').filter(Boolean);
  return options
    ?.map((option) =>
      _.find(templateOptions, (opt) => String(opt.value) === String(option))
    )
    .filter(Boolean);
};
