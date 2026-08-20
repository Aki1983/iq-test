import type { ShapeSpec, VisualSpec } from "@/lib/question-types";
import { cn } from "@/lib/utils";

function dotsOverlay(count = 0) {
  if (!count) return null;
  const positions = [
    [32, 32],
    [22, 22],
    [42, 22],
    [22, 42],
    [42, 42],
  ];
  const pts = count === 1 ? [positions[0]] : positions.slice(1, count + 1);
  return pts.map((p, i) => (
    <circle key={i} cx={p![0]} cy={p![1]} r="3.2" fill="currentColor" />
  ));
}

function shapePath(kind: ShapeSpec["shape"]): string | null {
  switch (kind) {
    case "square":
      return "M16 16 H48 V48 H16 Z";
    case "diamond":
      return "M32 12 L52 32 L32 52 L12 32 Z";
    case "triangle":
      return "M32 14 L50 48 H14 Z";
    case "hexagon":
      return "M32 12 L50 22 V42 L32 52 L14 42 V22 Z";
    case "plus":
      return "M28 16 H36 V28 H48 V36 H36 V48 H28 V36 H16 V28 H28 Z";
    default:
      return null;
  }
}

export function ShapeGlyph({
  spec,
  size = 56,
  className,
}: {
  spec: ShapeSpec;
  size?: number;
  className?: string;
}) {
  const variant = spec.variant ?? "outline";
  const rot = spec.rotation ?? 0;
  const stroke = "currentColor";
  const fill =
    variant === "solid" ? "currentColor" : variant === "split" ? "url(#split)" : "none";
  const path = shapePath(spec.shape);

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("text-fg", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="split" x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${rot} 32 32)`}>
        {spec.shape === "circle" ? (
          <>
            <circle
              cx="32"
              cy="32"
              r="18"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.4"
            />
            {variant === "double" && (
              <circle cx="32" cy="32" r="11" fill="none" stroke={stroke} strokeWidth="2.4" />
            )}
          </>
        ) : spec.shape === "arrow" ? (
          <path
            d="M32 14 L48 34 H40 V50 H24 V34 H16 Z"
            fill={fill === "none" ? "none" : "currentColor"}
            stroke={stroke}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        ) : path ? (
          <>
            <path
              d={path}
              fill={fill}
              stroke={stroke}
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {variant === "double" && spec.shape === "square" && (
              <rect
                x="22"
                y="22"
                width="20"
                height="20"
                fill="none"
                stroke={stroke}
                strokeWidth="2.2"
              />
            )}
            {variant === "double" && spec.shape === "diamond" && (
              <path
                d="M32 22 L42 32 L32 42 L22 32 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="2.2"
              />
            )}
            {variant === "double" && spec.shape === "triangle" && (
              <path
                d="M32 24 L42 44 H22 Z"
                fill="none"
                stroke={stroke}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            )}
          </>
        ) : null}
        {dotsOverlay(spec.dots)}
      </g>
    </svg>
  );
}

function MissingSlot({ size = 56 }: { size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-md border border-dashed border-border-strong text-sm font-medium text-fg-muted"
      style={{ width: size, height: size }}
      aria-label="Missing item"
    >
      ?
    </div>
  );
}

export function QuestionVisual({ visual }: { visual: VisualSpec }) {
  if (visual.type === "sequence") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 py-2">
        {visual.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {item === "missing" ? (
              <MissingSlot />
            ) : (
              <div className="grid size-16 place-items-center rounded-md bg-bg-subtle">
                <ShapeGlyph spec={item} />
              </div>
            )}
            {i < visual.items.length - 1 && (
              <span className="text-fg-subtle" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="mx-auto grid w-fit gap-2 rounded-lg bg-bg-subtle p-3"
      style={{ gridTemplateColumns: `repeat(${visual.size}, minmax(0, 1fr))` }}
    >
      {visual.cells.map((cell, i) => (
        <div key={i} className="grid size-16 place-items-center rounded-md bg-surface">
          {cell === "missing" ? <MissingSlot /> : <ShapeGlyph spec={cell} />}
        </div>
      ))}
    </div>
  );
}
