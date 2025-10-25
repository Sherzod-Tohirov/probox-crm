export const MAX_KATM_SCORE = 500;

export function getKATMInfo(ballScore) {
  if (
    ballScore === null ||
    ballScore === undefined ||
    isNaN(ballScore) ||
    ballScore === ''
  )
    return '';

  // Convert to number just in case
  ballScore = Number(ballScore);

  if (ballScore >= 0 && ballScore <= 100) {
    if (ballScore <= 33) return 'E1';
    if (ballScore <= 66) return 'E2';
    return 'E3';
  }

  if (ballScore >= 101 && ballScore <= 200) {
    if (ballScore <= 133) return 'D1';
    if (ballScore <= 166) return 'D2';
    return 'D3';
  }

  if (ballScore >= 201 && ballScore <= 300) {
    if (ballScore <= 233) return 'C1';
    if (ballScore <= 266) return 'C2';
    return 'C3';
  }

  if (ballScore >= 301 && ballScore <= 400) {
    if (ballScore <= 333) return 'B1';
    if (ballScore <= 366) return 'B2';
    return 'B3';
  }

  if (ballScore >= 401 && ballScore <= MAX_KATM_SCORE) {
    if (ballScore <= 433) return 'A1';
    if (ballScore <= 466) return 'A2';
    return 'A3';
  }

  // If score doesn't fit any range
  return '';
}
