const formatPhoneNumber = (value) => {
  // Remove any non-digit characters
  const digits = value.replace(/\D/g, "");
  // Add 998 prefix if not present
  return digits.startsWith("998") ? digits : `998${digits}`;
};

export default formatPhoneNumber;
