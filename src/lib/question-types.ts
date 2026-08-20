export type Difficulty =
  | "medium"
  | "medium_plus"
  | "medium_hard"
  | "hard"
  | "very_hard";

export type Category =
  | "pattern"
  | "number"
  | "logic"
  | "spatial"
  | "verbal"
  | "odd_one_out"
  | "analogy";

export type ShapeKind =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "plus"
  | "arrow";

export type ShapeSpec = {
  shape: ShapeKind;
  variant?: "outline" | "solid" | "double" | "split";
  rotation?: number;
  dots?: number;
};

export type VisualSpec =
  | { type: "sequence"; items: Array<ShapeSpec | "missing"> }
  | { type: "matrix"; size: 2 | 3; cells: Array<ShapeSpec | "missing"> };

export type OptionSpec = {
  key: string;
  label?: string;
  shape?: ShapeSpec;
};

export type ClientQuestion = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  visual?: VisualSpec;
  options: OptionSpec[];
};

export type FullQuestion = ClientQuestion & {
  correctKey: string;
  explanation: string;
};

export type StoredQuestion = {
  id: string;
  optionKeys: string[];
  correctKey: string;
};

export const DIFFICULTY_BANDS: Difficulty[] = [
  "medium",
  "medium_plus",
  "medium_hard",
  "hard",
  "very_hard",
];

export const QUESTIONS_PER_BAND = 5;
export const TEST_LENGTH = DIFFICULTY_BANDS.length * QUESTIONS_PER_BAND;

export const CATEGORY_LABELS: Record<Category, string> = {
  pattern: "Pattern recognition",
  number: "Number sequences",
  logic: "Logical reasoning",
  spatial: "Spatial reasoning",
  verbal: "Verbal reasoning",
  odd_one_out: "Odd one out",
  analogy: "Analogies",
};
