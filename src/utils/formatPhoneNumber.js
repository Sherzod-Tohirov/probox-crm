const formatPhoneNumber = (value) => {
  if (!value) return;
  // Remove any non-digit characters
  const digits = String(value).replace(/\D/g, '');
  // Add 998 prefix if not present
  return digits.startsWith('998') ? digits : `998${digits}`;
};

const formatToReadablePhoneNumber = (phone, extended = false) => {
  if (!phone) return '';

  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Remove country code if present
  if (digits.startsWith('998') && digits.length > 9) {
    digits = digits.slice(3);
  }

  // Ensure only 9 digits remain
  if (digits.length !== 9) return digits; // Return as-is if invalid

  // Format: XX XXX XX XX
  return `${extended ? '+998 ' : ''}${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
    5,
    7
  )} ${digits.slice(7)}`;
};

function formatUZPhone(input) {
  // remove all non-digits
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    digits = digits.slice(0, 12);
  } else {
    if (digits.length < 3) digits = '998';
    else if (digits.length > 12) digits = digits.slice(-12);
  }

  const parts = [];
  if (digits.length > 0) parts.push('+' + digits.slice(0, 3));
  if (digits.length > 3) parts.push(digits.slice(3, 5));
  if (digits.length > 5) parts.push(digits.slice(5, 8));
  if (digits.length > 8) parts.push(digits.slice(8, 10));
  if (digits.length > 10) parts.push(digits.slice(10, 12));

  return parts.join(' ');
}

function isValidPhonenumber(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('998') && digits.length === 12;
}

export {
  formatPhoneNumber,
  formatToReadablePhoneNumber,
  formatUZPhone,
  isValidPhonenumber,
};
