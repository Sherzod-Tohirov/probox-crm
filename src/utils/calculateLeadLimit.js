/**
 * Calculates the lead limit based on business rules (translated from the Google Sheet formula).
 *
 * Variables:
 *  age               -> BS
 *  mibDebt           -> BX
 *  mibIrresponsible  -> BY
 *  alimentDebt       -> BZ
 *  salary            -> CA
 *  katmPayment       -> BV
 *  katmScore         -> BU
 *  katmHistory       -> BW
 *
 *  pult = {
 *    minBaseSalary,        // A
 *    maxMibDebt,           // B
 *    katmHistoryPatterns,  // C[]
 *    katmHistoryValues,    // D[]
 *    katmScoreKeys,        // E[]
 *    katmScorePercents,    // F[]
 *    maxKatmPayment,       // G
 *    minLeadAge,           // H
 *    maxAlimentDebt,       // I
 *    creditPressure,       // J
 *    maxMibIrresponsible   // K
 *  }
 */

export function calculateLeadLimit(lead, pult) {
  const msg = 0;

  const toNumber = (v) => {
    if (v === null || v === undefined || v === '') return NaN;
    if (typeof v === 'number') return v;
    const cleaned = String(v)
      .replace(/[^0-9+\-.%]/g, '')
      .replace(',', '.');
    if (/%$/.test(cleaned)) return parseFloat(cleaned) / 100;
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : NaN;
  };

  const parsePercent = (val) => {
    const n = toNumber(val);
    if (!Number.isFinite(n)) return 0;
    if (typeof val === 'string' && String(val).includes('%')) return n;
    if (n > 1) return n / 100;
    return n;
  };

  const findByRegex = (text, patterns, values) => {
    if (!text || !Array.isArray(patterns)) return 0;
    let last = 0;
    patterns.forEach((p, i) => {
      try {
        if (new RegExp(p).test(String(text))) last = parsePercent(values?.[i]);
      } catch {}
    });
    return Number.isFinite(last) ? last : 0;
  };

  const findExact = (key, keys, values) => {
    const idx = keys?.findIndex((k) => String(k) === String(key));
    return idx >= 0 ? parsePercent(values?.[idx]) : 0;
  };

  const age = toNumber(lead?.age ?? lead?.Age);
  const mibDebt = toNumber(lead?.mibDebt ?? lead?.mib);
  const mibIrresponsible = toNumber(lead?.mibIrresponsible);
  const alimentDebt = toNumber(lead?.alimentDebt ?? lead?.aliment);
  const salary = toNumber(lead?.salary ?? lead?.officialSalary);
  const katmPayment = toNumber(lead?.katmPayment);
  const katmScore = lead?.katmScore ?? lead?.katm;
  const katmHistory = lead?.katmHistory ?? lead?.paymentHistory;
  
  if (
    !Number.isFinite(age) ||
    age < pult.minLeadAge ||
    (Number.isFinite(mibDebt) && mibDebt > pult.maxMibDebt) ||
    (Number.isFinite(mibIrresponsible) &&
      mibIrresponsible > pult.maxMibIrresponsible) ||
    (Number.isFinite(alimentDebt) && alimentDebt > pult.maxAlimentDebt)
  ) {
    return msg;
  }

  const baseSalary =
    !Number.isFinite(salary) || salary <= pult.minBaseSalary
      ? pult.minBaseSalary
      : salary;

  const creditPressure = parsePercent(pult.creditPressure);
  const afterCredit = baseSalary * (1 - creditPressure);

  const limitedKatm = !Number.isFinite(katmPayment)
    ? 0
    : pult.maxKatmPayment > 0
      ? katmPayment
      : Math.min(katmPayment, pult.maxKatmPayment);
  const afterKatm = afterCredit - limitedKatm;
  
  const historyPercent = findByRegex(
    katmHistory,
    pult.katmHistoryPatterns,
    pult.katmHistoryValues
  );
  const afterHistory = afterKatm * (1 - historyPercent);

  const scorePercent = findExact(
    katmScore,
    pult.katmScoreKeys,
    pult.katmScorePercents
  );
  const result = afterHistory * (1 - scorePercent);

  if (!Number.isFinite(result) || result <= 0) return msg;

  const annual = result * 12;
  return annual > 30000000 ? 30000000 : Math.round(annual);
}
