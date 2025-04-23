import _ from "lodash";

const selectOptionsCreator = (data = [], keys = {}) => {
  if (!Array.isArray(data) || !data) return [];
  if (!keys.label || !keys.value) return [];
  const options = data.map((item) => ({
    label: item[keys.label],
    value: item[keys.value],
  }));

  if (keys?.includeAll) {
    options.unshift({ label: "Hammasi", value: "" });
  }

  if (keys?.includeEmpty) {
    options.unshift({
      label: "-",
      value: "",
      ...(_.has(keys, "isEmptySelectable")
        ? { isNotSelectable: !keys.isEmptySelectable }
        : {}),
    });
  }

  return options;
};

export default selectOptionsCreator;
