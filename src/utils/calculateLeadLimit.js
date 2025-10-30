export function calculateLeadLimit(lead, pult) {
  const defaultValue = 0;
  const msg = 'Limit chiqmadi';

  const toNumber = (v) => {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return v;
    const cleaned = String(v)
      .replace(/[^0-9+\-.%]/g, '')
      .replace(',', '.');
    if (/%$/.test(cleaned)) return parseFloat(cleaned) / 100;
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : 0;
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
    return defaultValue;
  }

  const baseSalary =
    !Number.isFinite(salary) || salary <= pult.minBaseSalary
      ? pult.minBaseSalary
      : salary;
  console.log(baseSalary, 'base salary');
  const creditPressure = parsePercent(pult.creditPressure);
  console.log(creditPressure, 'credit pressure');
  const afterCredit = baseSalary * (1 - creditPressure);
  console.log(afterCredit, 'after credit');
  let limitedKatm = 0;
  if (!Number.isFinite(pult.maxKatmPayment) && Number.isFinite(katmPayment)) {
    limitedKatm = katmPayment;
  } else if (pult.maxKatmPayment === 0) {
    limitedKatm = 0;
  } else if (pult.maxKatmPayment > 0) {
    limitedKatm = Math.min(katmPayment, pult.maxKatmPayment);
  }
  console.log(limitedKatm, 'limited katm');
  const afterKatm = afterCredit - limitedKatm;
  console.log(afterKatm, 'after katm');
  if (afterKatm <= 0) return defaultValue;
  const historyPercent = findByRegex(
    katmHistory,
    pult.katmHistoryPatterns,
    pult.katmHistoryValues
  );
  console.log(historyPercent, 'history percent');
  const afterHistory = afterKatm * (1 - historyPercent);
  console.log(afterHistory, 'after history');
  console.log(katmScore, 'katm score');
  const scorePercent = findExact(
    katmScore,
    pult.katmScoreKeys,
    pult.katmScorePercents
  );
  console.log(scorePercent, 'score percent');
  const result = afterHistory * (1 - scorePercent);
  console.log(result, 'result');

  if (!Number.isFinite(result) || result <= 0) return defaultValue;

  const annual = result * 12;
  return annual > 30_000_000 ? 30_000_000 : Math.round(annual);
}
