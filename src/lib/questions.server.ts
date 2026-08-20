import type {
  FullQuestion,
  OptionSpec,
  ShapeSpec,
  StoredQuestion,
} from "./question-types";
import { DIFFICULTY_BANDS, QUESTIONS_PER_BAND } from "./question-types";

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
  }
  return next;
}

const S = {
  circle: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "circle", ...extra }),
  square: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "square", ...extra }),
  triangle: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "triangle", ...extra }),
  diamond: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "diamond", ...extra }),
  hex: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "hexagon", ...extra }),
  plus: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "plus", ...extra }),
  arrow: (extra: Partial<ShapeSpec> = {}): ShapeSpec => ({ shape: "arrow", ...extra }),
};

function keys(
  labels: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
): { options: OptionSpec[]; correctKey: string } {
  const options = labels.map((label, i) => ({
    key: String.fromCharCode(97 + i),
    label,
  }));
  return { options, correctKey: options[correct]!.key };
}

function shapeKeys(
  shapes: [ShapeSpec, ShapeSpec, ShapeSpec, ShapeSpec],
  correct: 0 | 1 | 2 | 3,
): { options: OptionSpec[]; correctKey: string } {
  const options = shapes.map((shape, i) => ({
    key: String.fromCharCode(97 + i),
    shape,
  }));
  return { options, correctKey: options[correct]!.key };
}

export const QUESTION_BANK: FullQuestion[] = [
  // ── Medium ──────────────────────────────────────────────────────────
  {
    id: "m01",
    category: "number",
    difficulty: "medium",
    prompt: "What number comes next in this sequence?\n2, 4, 8, 16, 32, ?",
    ...keys(["48", "54", "64", "72"], 2),
    explanation: "Each term is multiplied by 2: 32 × 2 = 64.",
  },
  {
    id: "m02",
    category: "number",
    difficulty: "medium",
    prompt: "What number comes next?\n3, 6, 9, 12, 15, ?",
    ...keys(["16", "17", "18", "21"], 2),
    explanation: "The sequence increases by 3 each time: 15 + 3 = 18.",
  },
  {
    id: "m03",
    category: "pattern",
    difficulty: "medium",
    prompt: "Which letter comes next?\nB, D, F, H, ?",
    ...keys(["I", "J", "K", "L"], 1),
    explanation: "The sequence skips one letter each time: B, D, F, H, J.",
  },
  {
    id: "m04",
    category: "analogy",
    difficulty: "medium",
    prompt: "Nest is to bird as hive is to:",
    ...keys(["honey", "bee", "tree", "flower"], 1),
    explanation: "A nest is the dwelling of a bird; a hive is the dwelling of a bee.",
  },
  {
    id: "m05",
    category: "analogy",
    difficulty: "medium",
    prompt: "Up is to down as left is to:",
    ...keys(["beside", "right", "forward", "above"], 1),
    explanation: "Up and down are opposites; left and right are opposites.",
  },
  {
    id: "m06",
    category: "odd_one_out",
    difficulty: "medium",
    prompt: "Which item does not belong?",
    ...keys(["Circle", "Triangle", "Square", "Sphere"], 3),
    explanation: "Sphere is three-dimensional; the others are two-dimensional shapes.",
  },
  {
    id: "m07",
    category: "logic",
    difficulty: "medium",
    prompt:
      "Tom is older than Sue. Sue is older than Mia. Who is the youngest?",
    ...keys(["Tom", "Sue", "Mia", "Cannot be determined"], 2),
    explanation: "Tom is older than Sue, who is older than Mia, so Mia is the youngest.",
  },
  {
    id: "m08",
    category: "number",
    difficulty: "medium",
    prompt: "What number comes next?\n1, 4, 9, 16, 25, ?",
    ...keys(["30", "32", "36", "49"], 2),
    explanation: "These are consecutive square numbers: 1², 2², 3², 4², 5², 6² = 36.",
  },
  {
    id: "m09",
    category: "odd_one_out",
    difficulty: "medium",
    prompt: "Which number does not belong?\n2, 4, 8, 9, 16",
    ...keys(["2", "4", "9", "16"], 2),
    explanation: "9 is not a power of 2. The others are 2¹, 2², 2³, and 2⁴.",
  },
  {
    id: "m10",
    category: "verbal",
    difficulty: "medium",
    prompt: "Which word is the opposite of scarce?",
    ...keys(["rare", "limited", "plentiful", "hidden"], 2),
    explanation: "Scarce means in short supply; plentiful is the opposite.",
  },
  {
    id: "m11",
    category: "spatial",
    difficulty: "medium",
    prompt: "Which shape comes next in the sequence?",
    visual: {
      type: "sequence",
      items: [
        S.circle({ variant: "outline" }),
        S.square({ variant: "outline" }),
        S.circle({ variant: "outline" }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.square({ variant: "outline" }),
        S.triangle({ variant: "outline" }),
        S.circle({ variant: "solid" }),
        S.diamond({ variant: "outline" }),
      ],
      0,
    ),
    explanation: "The sequence alternates circle, square, circle, square.",
  },
  {
    id: "m12",
    category: "logic",
    difficulty: "medium",
    prompt:
      "All squares are rectangles. Some rectangles are blue. Which statement must be true?",
    ...keys(
      [
        "All squares are blue",
        "Some squares are blue",
        "No squares are blue",
        "None of the other statements must be true",
      ],
      3,
    ),
    explanation:
      "Blue rectangles need not include any squares, so none of the first three statements is forced.",
  },

  // ── Medium+ ─────────────────────────────────────────────────────────
  {
    id: "p01",
    category: "number",
    difficulty: "medium_plus",
    prompt: "What number comes next?\n3, 6, 11, 18, 27, ?",
    ...keys(["36", "38", "39", "40"], 1),
    explanation: "The added amount increases by 2 each time: +3, +5, +7, +9, +11. 27 + 11 = 38.",
  },
  {
    id: "p02",
    category: "number",
    difficulty: "medium_plus",
    prompt: "What number comes next?\n1, 1, 2, 3, 5, 8, ?",
    ...keys(["11", "12", "13", "15"], 2),
    explanation: "Each term is the sum of the two before it (Fibonacci): 5 + 8 = 13.",
  },
  {
    id: "p03",
    category: "pattern",
    difficulty: "medium_plus",
    prompt: "Which letter comes next?\nA, C, F, J, ?",
    ...keys(["M", "N", "O", "P"], 2),
    explanation: "The gaps grow by one letter: +2, +3, +4, +5. J plus five letters is O.",
  },
  {
    id: "p04",
    category: "analogy",
    difficulty: "medium_plus",
    prompt: "Painter is to brush as writer is to:",
    ...keys(["paper", "pen", "desk", "story"], 1),
    explanation: "A brush is the primary tool of a painter; a pen is the primary tool of a writer.",
  },
  {
    id: "p05",
    category: "logic",
    difficulty: "medium_plus",
    prompt:
      "All students who passed the exam took notes. Maya took notes. Which conclusion is valid?",
    ...keys(
      [
        "Maya passed the exam",
        "Maya did not pass the exam",
        "Maya may or may not have passed",
        "Nobody else took notes",
      ],
      2,
    ),
    explanation:
      "Taking notes is required of those who passed, but it is not enough to prove Maya passed.",
  },
  {
    id: "p06",
    category: "odd_one_out",
    difficulty: "medium_plus",
    prompt: "Which number does not belong?\n36, 49, 64, 81, 99",
    ...keys(["36", "49", "81", "99"], 3),
    explanation: "99 is not a perfect square. 36=6², 49=7², 64=8², 81=9².",
  },
  {
    id: "p07",
    category: "spatial",
    difficulty: "medium_plus",
    prompt: "The arrow rotates 90° clockwise at each step. What comes next?",
    visual: {
      type: "sequence",
      items: [
        S.arrow({ rotation: 0 }),
        S.arrow({ rotation: 90 }),
        S.arrow({ rotation: 180 }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.arrow({ rotation: 225 }),
        S.arrow({ rotation: 270 }),
        S.arrow({ rotation: 0 }),
        S.arrow({ rotation: 45 }),
      ],
      1,
    ),
    explanation: "After 0°, 90°, and 180°, the next clockwise quarter-turn is 270°.",
  },
  {
    id: "p08",
    category: "number",
    difficulty: "medium_plus",
    prompt: "What number comes next?\n2, 3, 5, 8, 13, ?",
    ...keys(["18", "20", "21", "24"], 2),
    explanation: "Each term is the sum of the previous two: 8 + 13 = 21.",
  },
  {
    id: "p09",
    category: "verbal",
    difficulty: "medium_plus",
    prompt: "Book is to read as song is to:",
    ...keys(["write", "listen", "paper", "voice"], 1),
    explanation: "Reading is the typical action performed with a book; listening is the typical action performed with a song.",
  },
  {
    id: "p10",
    category: "pattern",
    difficulty: "medium_plus",
    prompt: "What comes next?\nAB, BC, CD, DE, ?",
    ...keys(["DF", "EF", "EG", "FE"], 1),
    explanation: "Each pair is two consecutive letters, advancing one place each time: DE is followed by EF.",
  },
  {
    id: "p11",
    category: "odd_one_out",
    difficulty: "medium_plus",
    prompt: "Which word does not belong?",
    ...keys(["rapid", "swift", "quick", "still"], 3),
    explanation: "Still means motionless; the others are synonyms for fast.",
  },
  {
    id: "p12",
    category: "spatial",
    difficulty: "medium_plus",
    prompt: "The triangle rotates 90° clockwise at each step. What comes next?",
    visual: {
      type: "sequence",
      items: [
        S.triangle({ variant: "outline", rotation: 0 }),
        S.triangle({ variant: "outline", rotation: 90 }),
        S.triangle({ variant: "outline", rotation: 180 }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.triangle({ variant: "outline", rotation: 270 }),
        S.triangle({ variant: "outline", rotation: 45 }),
        S.triangle({ variant: "solid", rotation: 270 }),
        S.triangle({ variant: "outline", rotation: 0 }),
      ],
      0,
    ),
    explanation: "After 0°, 90°, and 180°, the next clockwise quarter-turn is 270°.",
  },

  // ── Medium/Hard ─────────────────────────────────────────────────────
  {
    id: "h01",
    category: "number",
    difficulty: "medium_hard",
    prompt: "What number comes next?\n8, 27, 64, 125, ?",
    ...keys(["144", "196", "216", "243"], 2),
    explanation: "These are consecutive cubes: 2³, 3³, 4³, 5³, 6³ = 216.",
  },
  {
    id: "h02",
    category: "number",
    difficulty: "medium_hard",
    prompt: "What number comes next?\n13, 16, 22, 31, 43, ?",
    ...keys(["56", "58", "60", "62"], 1),
    explanation: "The added amount increases by 3: +3, +6, +9, +12, +15. 43 + 15 = 58.",
  },
  {
    id: "h03",
    category: "logic",
    difficulty: "medium_hard",
    prompt:
      "Four people sit in a row facing forward: A, B, C, and D.\nB sits immediately left of D.\nA sits at one of the ends.\nC is not next to A.\nWho sits immediately right of A?",
    ...keys(["B", "C", "D", "Nobody — A is at the right end"], 0),
    explanation:
      "A must occupy the left end (the only end that leaves C not beside A). Order: A, B, D, C. B sits immediately right of A.",
  },
  {
    id: "h04",
    category: "analogy",
    difficulty: "medium_hard",
    prompt: "Cell is to tissue as brick is to:",
    ...keys(["clay", "wall", "house", "mason"], 1),
    explanation: "Cells combine to form tissue; bricks combine to form a wall.",
  },
  {
    id: "h05",
    category: "odd_one_out",
    difficulty: "medium_hard",
    prompt: "Which number does not belong?\n24, 36, 48, 56, 60",
    ...keys(["24", "36", "56", "60"], 2),
    explanation: "56 is not a multiple of 12. The others are 12×2, 12×3, 12×4, and 12×5.",
  },
  {
    id: "h06",
    category: "spatial",
    difficulty: "medium_hard",
    prompt: "Each row follows the same rule. Which shape completes the matrix?",
    visual: {
      type: "matrix",
      size: 2,
      cells: [
        S.circle({ variant: "outline" }),
        S.circle({ variant: "solid" }),
        S.square({ variant: "outline" }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.square({ variant: "solid" }),
        S.circle({ variant: "outline" }),
        S.triangle({ variant: "solid" }),
        S.square({ variant: "outline" }),
      ],
      0,
    ),
    explanation:
      "The second cell in each row is the solid version of the first cell’s shape. The missing cell is a solid square.",
  },
  {
    id: "h07",
    category: "number",
    difficulty: "medium_hard",
    prompt: "What number comes next?\n7, 10, 9, 12, 11, ?",
    ...keys(["13", "14", "15", "16"], 1),
    explanation: "The rule alternates +3 and −1: 7+3=10, 10−1=9, 9+3=12, 12−1=11, 11+3=14.",
  },
  {
    id: "h08",
    category: "verbal",
    difficulty: "medium_hard",
    prompt: "CANVAS is to PAINTING as STAGE is to:",
    ...keys(["actor", "curtain", "play", "audience"], 2),
    explanation: "A painting is the work presented on a canvas; a play is the work presented on a stage.",
  },
  {
    id: "h09",
    category: "logic",
    difficulty: "medium_hard",
    prompt:
      "If it is raining, the ground is wet. The ground is wet. Which statement follows?",
    ...keys(
      [
        "It is raining",
        "It is not raining",
        "It may or may not be raining",
        "The ground is dry",
      ],
      2,
    ),
    explanation:
      "Wet ground can have other causes, so rain is possible but not proven.",
  },
  {
    id: "h10",
    category: "pattern",
    difficulty: "medium_hard",
    prompt: "What number comes next?\n2, 6, 12, 20, 30, ?",
    ...keys(["40", "42", "44", "48"], 1),
    explanation: "Differences increase by 2: +4, +6, +8, +10, +12. 30 + 12 = 42.",
  },
  {
    id: "h11",
    category: "number",
    difficulty: "medium_hard",
    prompt: "What number comes next?\n1, 8, 27, 64, 125, ?",
    ...keys(["144", "196", "216", "256"], 2),
    explanation: "Consecutive cubes: 1³ through 6³ = 216.",
  },
  {
    id: "h12",
    category: "logic",
    difficulty: "medium_hard",
    prompt:
      "A drawer contains 4 black socks and 4 white socks. How many socks must you take to be sure you have a matching pair?",
    ...keys(["2", "3", "4", "5"], 1),
    explanation:
      "Worst case is one black and one white. The third sock must match one of them.",
  },

  // ── Hard ────────────────────────────────────────────────────────────
  {
    id: "d01",
    category: "number",
    difficulty: "hard",
    prompt: "What number comes next?\n3, 7, 15, 31, 63, ?",
    ...keys(["95", "123", "127", "129"], 2),
    explanation: "Each term is twice the previous plus 1: 63 × 2 + 1 = 127.",
  },
  {
    id: "d02",
    category: "number",
    difficulty: "hard",
    prompt: "What number comes next?\n4, 9, 25, 49, 121, ?",
    ...keys(["144", "169", "187", "289"], 1),
    explanation: "These are squares of consecutive primes: 2², 3², 5², 7², 11², 13² = 169.",
  },
  {
    id: "d03",
    category: "logic",
    difficulty: "hard",
    prompt:
      "Exactly one of the following statements is true.\n1. The prize is in box A.\n2. The prize is not in box A.\n3. The prize is not in box B.\nThe prize is in box A, B, or C. Where is it?",
    ...keys(["Box A", "Box B", "Box C", "Cannot be determined"], 1),
    explanation:
      "If statement 1 were true, statement 3 could also be true. If statement 2 is the single truth, statement 3 is false, so the prize is in box B.",
  },
  {
    id: "d04",
    category: "spatial",
    difficulty: "hard",
    prompt:
      "Each row uses the same fill pattern: outline, solid, double. Which shape completes the matrix?",
    visual: {
      type: "matrix",
      size: 3,
      cells: [
        S.triangle({ variant: "outline" }),
        S.triangle({ variant: "solid" }),
        S.triangle({ variant: "double" }),
        S.square({ variant: "outline" }),
        S.square({ variant: "solid" }),
        S.square({ variant: "double" }),
        S.diamond({ variant: "outline" }),
        S.diamond({ variant: "solid" }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.diamond({ variant: "double" }),
        S.diamond({ variant: "outline" }),
        S.circle({ variant: "double" }),
        S.square({ variant: "double" }),
      ],
      0,
    ),
    explanation: "Row 3 continues diamond outline, diamond solid, diamond double.",
  },
  {
    id: "d05",
    category: "analogy",
    difficulty: "hard",
    prompt: "EPHEMERAL is to LASTING as TRANSPARENT is to:",
    ...keys(["clear", "fragile", "opaque", "visible"], 2),
    explanation: "Ephemeral is the opposite of lasting; transparent is the opposite of opaque.",
  },
  {
    id: "d06",
    category: "number",
    difficulty: "hard",
    prompt: "What number comes next?\n2, 10, 30, 68, 130, ?",
    ...keys(["210", "222", "248", "258"], 1),
    explanation: "Each term is n³ + n: 1+1=2, 8+2=10, 27+3=30, 64+4=68, 125+5=130, 216+6=222.",
  },
  {
    id: "d07",
    category: "odd_one_out",
    difficulty: "hard",
    prompt: "Which number does not belong?\n15, 21, 27, 33, 35",
    ...keys(["15", "27", "33", "35"], 3),
    explanation: "35 is not a multiple of 3. The others are 3×5, 3×7, 3×9, and 3×11.",
  },
  {
    id: "d08",
    category: "verbal",
    difficulty: "hard",
    prompt: "THREAD is to CLOTH as ORE is to:",
    ...keys(["mine", "metal", "rock", "tool"], 1),
    explanation: "Thread is the material from which cloth is made; ore is the material from which metal is extracted.",
  },
  {
    id: "d09",
    category: "logic",
    difficulty: "hard",
    prompt:
      "If A is true, then B is true. If B is true, then C is true. C is false. Which must be true?",
    ...keys(
      ["A is true", "B is true", "A is false", "A and B are both true"],
      2,
    ),
    explanation:
      "From C being false, B is false. From B being false, A is false.",
  },
  {
    id: "d10",
    category: "spatial",
    difficulty: "hard",
    prompt:
      "The figure rotates 45° clockwise and gains one inner dot at each step. What comes next?",
    visual: {
      type: "sequence",
      items: [
        S.diamond({ variant: "outline", rotation: 0, dots: 0 }),
        S.diamond({ variant: "outline", rotation: 45, dots: 1 }),
        S.diamond({ variant: "outline", rotation: 90, dots: 2 }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.diamond({ variant: "outline", rotation: 135, dots: 3 }),
        S.diamond({ variant: "outline", rotation: 135, dots: 2 }),
        S.diamond({ variant: "outline", rotation: 90, dots: 3 }),
        S.diamond({ variant: "solid", rotation: 135, dots: 3 }),
      ],
      0,
    ),
    explanation: "Next rotation is 135° with 3 dots.",
  },
  {
    id: "d11",
    category: "pattern",
    difficulty: "hard",
    prompt: "Which letter comes next?\nA, D, I, P, ?",
    ...keys(["U", "W", "X", "Y"], 3),
    explanation:
      "Alphabet positions are 1, 4, 9, 16 — consecutive squares. Next is 25, the letter Y.",
  },
  {
    id: "d12",
    category: "number",
    difficulty: "hard",
    prompt: "What number comes next?\n6, 8, 5, 10, 3, 14, 1, ?",
    ...keys(["16", "18", "19", "22"], 1),
    explanation:
      "The sequence alternates adding and subtracting consecutive primes: +2, −3, +5, −7, +11, −13, +17. 1 + 17 = 18.",
  },

  // ── Very hard ───────────────────────────────────────────────────────
  {
    id: "v01",
    category: "number",
    difficulty: "very_hard",
    prompt: "What number comes next?\n1, 2, 6, 24, 120, ?",
    ...keys(["240", "480", "600", "720"], 3),
    explanation: "These are factorials: 1!, 2!, 3!, 4!, 5!, 6! = 720.",
  },
  {
    id: "v02",
    category: "number",
    difficulty: "very_hard",
    prompt: "What number comes next?\n2, 12, 36, 80, 150, ?",
    ...keys(["216", "240", "252", "280"], 2),
    explanation: "Each term is n³ + n²: 1+1=2, 8+4=12, 27+9=36, 64+16=80, 125+25=150, 216+36=252.",
  },
  {
    id: "v03",
    category: "number",
    difficulty: "very_hard",
    prompt: "What number comes next?\n5, 11, 24, 51, 106, ?",
    ...keys(["213", "215", "217", "221"], 2),
    explanation: "Each term is twice the previous plus an increasing integer: 5×2+1=11, 11×2+2=24, 24×2+3=51, 51×2+4=106, 106×2+5=217.",
  },
  {
    id: "v04",
    category: "spatial",
    difficulty: "very_hard",
    prompt:
      "In each row, the shape gains one side and the fill alternates. Which shape completes the matrix?",
    visual: {
      type: "matrix",
      size: 3,
      cells: [
        S.triangle({ variant: "outline" }),
        S.square({ variant: "solid" }),
        S.hex({ variant: "outline" }),
        S.square({ variant: "solid" }),
        S.hex({ variant: "outline" }),
        S.circle({ variant: "solid" }),
        S.hex({ variant: "outline" }),
        S.circle({ variant: "solid" }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.plus({ variant: "outline" }),
        S.triangle({ variant: "outline" }),
        S.diamond({ variant: "outline" }),
        S.square({ variant: "solid" }),
      ],
      0,
    ),
    explanation:
      "Each row advances triangle → square → hexagon → circle → plus, alternating outline and solid. The missing cell is an outline plus.",
  },
  {
    id: "v05",
    category: "logic",
    difficulty: "very_hard",
    prompt:
      "Three people — Lina, Omar, and Priya — each tell the truth or each lie.\nLina: “Omar is a liar.”\nOmar: “Priya is a liar.”\nPriya: “Lina and Omar are both liars.”\nHow many are telling the truth?",
    ...keys(["None", "Exactly one", "Exactly two", "All three"], 1),
    explanation:
      "Priya cannot be truthful (that would force Omar to be truthful and a liar). Priya lies, so Omar’s claim is true and Lina’s is false. Exactly one truth-teller: Omar.",
  },
  {
    id: "v06",
    category: "analogy",
    difficulty: "very_hard",
    prompt: "MILESTONE is to JOURNEY as CHAPTER is to:",
    ...keys(["page", "author", "book", "index"], 2),
    explanation: "A milestone is a marked segment of a journey; a chapter is a marked segment of a book.",
  },
  {
    id: "v07",
    category: "odd_one_out",
    difficulty: "very_hard",
    prompt: "Which number does not belong?\n8, 27, 64, 125, 216, 343, 500",
    ...keys(["64", "216", "343", "500"], 3),
    explanation: "500 is not a perfect cube. 8=2³, 27=3³, 64=4³, 125=5³, 216=6³, 343=7³.",
  },
  {
    id: "v08",
    category: "verbal",
    difficulty: "very_hard",
    prompt: "TACIT is to EXPLICIT as LATENT is to:",
    ...keys(["hidden", "dormant", "manifest", "potential"], 2),
    explanation: "Tacit is the opposite of explicit; latent is the opposite of manifest.",
  },
  {
    id: "v09",
    category: "pattern",
    difficulty: "very_hard",
    prompt: "What number comes next?\n11, 13, 17, 19, 23, ?",
    ...keys(["25", "27", "29", "31"], 2),
    explanation: "These are consecutive prime numbers. The next prime after 23 is 29.",
  },
  {
    id: "v10",
    category: "spatial",
    difficulty: "very_hard",
    prompt:
      "Each step flips the fill and rotates the figure 90° counter-clockwise. What comes next?",
    visual: {
      type: "sequence",
      items: [
        S.triangle({ variant: "solid", rotation: 0 }),
        S.triangle({ variant: "outline", rotation: 270 }),
        S.triangle({ variant: "solid", rotation: 180 }),
        "missing",
      ],
    },
    ...shapeKeys(
      [
        S.triangle({ variant: "outline", rotation: 90 }),
        S.triangle({ variant: "outline", rotation: 0 }),
        S.triangle({ variant: "solid", rotation: 90 }),
        S.triangle({ variant: "outline", rotation: 270 }),
      ],
      0,
    ),
    explanation:
      "Fill alternates solid/outline. Rotation goes 0° → 270° → 180° → 90°. Next is outline at 90°.",
  },
  {
    id: "v11",
    category: "logic",
    difficulty: "very_hard",
    prompt:
      "On an island, knights always tell the truth and knaves always lie. You meet two inhabitants.\nA says: “At least one of us is a knave.”\nWhat are A and B?",
    ...keys(
      [
        "Both knights",
        "A knight, B knave",
        "A knave, B knight",
        "Both knaves",
      ],
      1,
    ),
    explanation:
      "If A were a knave, the claim “at least one knave” would be true, which a knave cannot say. So A is a knight and B is a knave.",
  },
  {
    id: "v12",
    category: "number",
    difficulty: "very_hard",
    prompt: "What number comes next?\n2, 3, 3, 5, 10, 13, 39, 43, ?",
    ...keys(["129", "172", "215", "258"], 1),
    explanation:
      "The pattern alternates adding a growing integer, then multiplying by it: 2+1=3, 3×1=3, 3+2=5, 5×2=10, 10+3=13, 13×3=39, 39+4=43, 43×4=172.",
  },
];

function assertBank(): void {
  const ids = new Set<string>();
  for (const q of QUESTION_BANK) {
    if (ids.has(q.id)) throw new Error(`Duplicate question id ${q.id}`);
    ids.add(q.id);
    const keySet = new Set(q.options.map((o) => o.key));
    if (!keySet.has(q.correctKey)) {
      throw new Error(`Question ${q.id} is missing its correct option`);
    }
    if (q.options.length < 2) {
      throw new Error(`Question ${q.id} needs at least two options`);
    }
  }
  for (const band of DIFFICULTY_BANDS) {
    const n = QUESTION_BANK.filter((q) => q.difficulty === band).length;
    if (n < QUESTIONS_PER_BAND) {
      throw new Error(`Difficulty ${band} has only ${n} questions`);
    }
  }
}

assertBank();

export function getQuestionById(id: string): FullQuestion | undefined {
  return QUESTION_BANK.find((q) => q.id === id);
}

export function selectTestQuestions(): StoredQuestion[] {
  const selected: StoredQuestion[] = [];
  for (const band of DIFFICULTY_BANDS) {
    const pool = QUESTION_BANK.filter((q) => q.difficulty === band);
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_BAND);
    for (const q of picked) {
      selected.push({
        id: q.id,
        optionKeys: shuffle(q.options.map((o) => o.key)),
        correctKey: q.correctKey,
      });
    }
  }
  return selected;
}

export function hydrateClientQuestion(
  stored: StoredQuestion,
): import("./question-types").ClientQuestion {
  const q = getQuestionById(stored.id);
  if (!q) throw new Error(`Unknown question ${stored.id}`);
  const byKey = new Map(q.options.map((o) => [o.key, o]));
  const options = stored.optionKeys.map((key) => {
    const opt = byKey.get(key);
    if (!opt) throw new Error(`Unknown option ${key} on ${q.id}`);
    return opt;
  });
  return {
    id: q.id,
    category: q.category,
    difficulty: q.difficulty,
    prompt: q.prompt,
    visual: q.visual,
    options,
  };
}
