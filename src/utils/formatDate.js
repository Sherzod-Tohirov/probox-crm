import moment from "moment";

const formatDate = (
  dateString,
  inputFormat = "YYYY-MM-DD HH:mm:ss.SSSSSSSSS",
  outputFormat = "DD.MM.YYYY"
) => {
  if (!dateString) return "";
  return moment(dateString, inputFormat).format(outputFormat);
};

export default formatDate;
