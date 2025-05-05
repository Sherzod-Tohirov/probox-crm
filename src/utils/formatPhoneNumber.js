const formatPhoneNumber = (value) => {
  // Remove any non-digit characters
  const digits = value.replace(/\D/g, "");
  // Add 998 prefix if not present
  return digits.startsWith("998") ? digits : `998${digits}`;
};

const formatToReadablePhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, "");

  // Remove country code if present
  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }

  // Ensure only 9 digits remain
  if (digits.length !== 9) return phone; // Return as-is if invalid

  // Format: XX XXX XX XX
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
    5,
    7
  )} ${digits.slice(7)}`;
};

export { formatPhoneNumber, formatToReadablePhoneNumber };
