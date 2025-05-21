import _ from "lodash";

const getSelectOptionsFromKeys = (templateOptions = [], keys = "") => {
  if (!Array.isArray(templateOptions) || !templateOptions) return [];
  if (typeof keys !== "string") return [];
  return _(keys.split(","))
    .map((key) =>
      _.find(templateOptions, (opt) => String(opt.value) === String(key))
    )
    .compact()
    .value();
};

export default getSelectOptionsFromKeys;
