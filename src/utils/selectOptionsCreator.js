const selectOptionsCreator = (data = [], keys = {}) => {
  if (!Array.isArray(data) || !data) return [];
  if (!keys.label || !keys.value) return [];
  return data.map((item) => ({
    label: item[keys.label],
    value: item[keys.value],
  }));
};

export default selectOptionsCreator;
