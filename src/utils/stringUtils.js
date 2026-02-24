import _ from 'lodash';

/**
 * Checks if a string is in camelCase format.
 * @param {string} value - The string to check.
 * @returns {boolean} - True if the string is camelCase.
 */
export const isCamelCase = (value) => /^[a-zA-Z]+(?:[A-Z][a-z]*)*$/.test(value);

/**
 * Converts a camelCase string to normal readable text.
 * @param {string} str - The camelCase string to convert.
 * @returns {string} - The converted normal text.
 */
export const camelCaseToNormal = (str) => {
  if (!str || typeof str !== 'string') return str;
  return _.words(str)
    .map((word, index) => (index > 0 ? word.toLowerCase() : word))
    .join(' ');
};

/**
 * Converts any string (camelCase, snake_case, kebab-case) to normal readable text.
 * @param {string} str - The string to convert.
 * @returns {string} - The converted normal text.
 */
export const toNormalText = (str) => {
  if (!str || typeof str !== 'string') return str;
  
  // Handle camelCase
  if (isCamelCase(str)) {
    return camelCaseToNormal(str);
  }
  
  // Handle snake_case and kebab-case
  return str
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
