import moment from "moment";

const formatDate = (
  dateString,
  inputFormat = "YYYY-MM-DD HH:mm:ss.SSSSSSSSS",
  outputFormat = "DD.MM.YYYY"
) => {
  if (!dateString) return "00.00.0000";
  return moment(dateString, inputFormat).format(outputFormat);
};

export default formatDate;
