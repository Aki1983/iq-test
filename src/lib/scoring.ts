/**
 * Deterministic IQ-style scoring.
 *
 * This is NOT a clinically validated IQ measurement. It maps the number of
 * correct answers on a 25-question assessment to an "IQ-style score" so
 * results feel familiar, while remaining a simple predetermined table.
 *
 * Mapping (correct answers → score):
 *   0–5  → 70
 *   6–8  → 80
 *   9–11 → 90
 *   12–14 → 100
 *   15–17 → 110
 *   18–20 → 120
 *   21–22 → 130
 *   23    → 135
 *   24    → 140
 *   25    → 145
 */
export const SCORE_TABLE: Array<{ minCorrect: number; score: number }> = [
  { minCorrect: 25, score: 145 },
  { minCorrect: 24, score: 140 },
  { minCorrect: 23, score: 135 },
  { minCorrect: 21, score: 130 },
  { minCorrect: 18, score: 120 },
  { minCorrect: 15, score: 110 },
  { minCorrect: 12, score: 100 },
  { minCorrect: 9, score: 90 },
  { minCorrect: 6, score: 80 },
  { minCorrect: 0, score: 70 },
];

export function scoreFromCorrectCount(correct: number): number {
  const n = Math.max(0, Math.min(25, Math.floor(correct)));
  for (const row of SCORE_TABLE) {
    if (n >= row.minCorrect) return row.score;
  }
  return 70;
}

export function classifyScore(score: number): string {
  if (score >= 140) return "Exceptional";
  if (score >= 130) return "Very Superior";
  if (score >= 120) return "Superior";
  if (score >= 110) return "Above Average";
  if (score >= 90) return "Average";
  return "Below Average";
}

export const PRICE_CENTS = 479;
export const PRICE_LABEL = "€4.79";
export const PRICE_CURRENCY = "eur";
