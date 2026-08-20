import type { OptionSpec } from "@/lib/question-types";
import { cn } from "@/lib/utils";
import { ShapeGlyph } from "@/components/shape-visual";

export function AnswerOption({
  option,
  index,
  selected,
  onSelect,
}: {
  option: OptionSpec;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const letter = String.fromCharCode(65 + index);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-lg bg-surface px-3.5 py-3 text-left shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow,background-color,transform] duration-150 ease-out",
        "hover:bg-bg-subtle hover:shadow-[0_0_0_1px_var(--color-border-strong)]",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-primary)]",
        selected &&
          "bg-bg-subtle shadow-[0_0_0_2px_var(--color-primary)] hover:shadow-[0_0_0_2px_var(--color-primary)]",
      )}
    >
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-md text-sm font-semibold",
          selected ? "bg-primary text-primary-fg" : "bg-bg-subtle text-fg-muted",
        )}
      >
        {letter}
      </span>
      {option.shape ? (
        <ShapeGlyph spec={option.shape} size={44} />
      ) : (
        <span className="text-[0.975rem] leading-snug">{option.label}</span>
      )}
    </button>
  );
}
