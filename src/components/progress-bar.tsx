import { TEST_LENGTH } from "@/lib/question-types";

export function ProgressBar({
  current,
  total = TEST_LENGTH,
}: {
  current: number;
  total?: number;
}) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium text-fg">
          Question {current} of {total}
        </p>
        <p className="text-xs tabular-nums text-fg-subtle">{Math.round(pct)}%</p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-bg-subtle"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
