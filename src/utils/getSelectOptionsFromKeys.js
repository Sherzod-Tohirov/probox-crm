import _ from "lodash";

const getSelectOptionsFromKeys = (templateOptions = [], keys = "") => {
  if (typeof keys !== "string") return;
  return _(keys.split(","))
    .map((key) => _.find(templateOptions, { value: key }))
    .compact() // removes undefined in case of unmatched keys
    .value();
};

export default getSelectOptionsFromKeys;
