import moment from "moment";

const formatDate = (
  dateString,
  inputFormat = "YYYY-MM-DD HH:mm:ss.SSSSSSSSS",
  outputFormat = "DD.MM.YYYY"
) => {
  try {
    if (!dateString) return "";
    return moment(dateString, inputFormat).format(outputFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export default formatDate;
