/**
 * Raqamni o'zbekcha so'zga aylantiradi
 * @param {number} num - Raqam
 * @returns {string} O'zbekcha so'z ko'rinishi
 */
export const numberToWordsUZ = (num) => {
  if (num === 0) return 'нол';
  
  const ones = ['', 'бир', 'икки', 'уч', 'тўрт', 'беш', 'олти', 'етти', 'саккиз', 'тўққиз'];
  const teens = ['ўн', 'ўн бир', 'ўн икки', 'ўн уч', 'ўн тўрт', 'ўн беш', 'ўн олти', 'ўн етти', 'ўн саккиз', 'ўн тўққиз'];
  const tens = ['', '', 'йигирма', 'ўттиз', 'қирқ', 'эллик', 'олтмиш', 'етмиш', 'саксон', 'тўқсон'];
  const hundreds = ['', 'бир юз', 'икки юз', 'уч юз', 'тўрт юз', 'беш юз', 'олти юз', 'етти юз', 'саккиз юз', 'тўққиз юз'];
  
  const convertLessThanThousand = (n) => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      return hundreds[hundred] + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }
    return '';
  };
  
  const convert = (n) => {
    if (n === 0) return 'нол';
    if (n < 1000) return convertLessThanThousand(n);
    if (n < 1000000) {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      return convertLessThanThousand(thousands) + ' минг' + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }
    if (n < 1000000000) {
      const millions = Math.floor(n / 1000000);
      const remainder = n % 1000000;
      return convertLessThanThousand(millions) + ' миллион' + (remainder > 0 ? ' ' + convert(remainder) : '');
    }
    return '';
  };
  
  return convert(Math.round(num));
};

/**
 * Raqamni ruscha so'zga aylantiradi
 * @param {number} num - Raqam
 * @returns {string} Ruscha so'z ko'rinishi
 */
export const numberToWordsRU = (num) => {
  if (num === 0) return 'ноль';
  
  const ones = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const onesFem = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const tens = ['', 'десять', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  
  const convertLessThanThousand = (n, isThousand = false) => {
    if (n === 0) return '';
    if (n < 10) return isThousand ? onesFem[n] : ones[n];
    if (n < 20) {
      if (n === 10) return 'десять';
      if (n === 11) return 'одиннадцать';
      if (n === 12) return 'двенадцать';
      if (n === 13) return 'тринадцать';
      if (n === 14) return 'четырнадцать';
      if (n === 15) return 'пятнадцать';
      if (n === 16) return 'шестнадцать';
      if (n === 17) return 'семнадцать';
      if (n === 18) return 'восемнадцать';
      if (n === 19) return 'девятнадцать';
    }
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return tens[ten] + (one > 0 ? ' ' + (isThousand ? onesFem[one] : ones[one]) : '');
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const remainder = n % 100;
      return hundreds[hundred] + (remainder > 0 ? ' ' + convertLessThanThousand(remainder, isThousand) : '');
    }
    return '';
  };
  
  const convert = (n) => {
    if (n === 0) return 'ноль';
    if (n < 1000) return convertLessThanThousand(n);
    if (n < 1000000) {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      const thousandWord = thousands === 1 ? 'тысяча' : 
                          (thousands >= 2 && thousands <= 4) ? 'тысячи' : 'тысяч';
      return convertLessThanThousand(thousands, true) + ' ' + thousandWord + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }
    if (n < 1000000000) {
      const millions = Math.floor(n / 1000000);
      const remainder = n % 1000000;
      const millionWord = millions === 1 ? 'миллион' : 
                         (millions >= 2 && millions <= 4) ? 'миллиона' : 'миллионов';
      return convertLessThanThousand(millions) + ' ' + millionWord + (remainder > 0 ? ' ' + convert(remainder) : '');
    }
    return '';
  };
  
  return convert(Math.round(num));
};

