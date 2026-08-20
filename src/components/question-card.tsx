import type { ClientQuestion } from "@/lib/question-types";
import { CATEGORY_LABELS } from "@/lib/question-types";
import { AnswerOption } from "@/components/answer-option";
import { QuestionVisual } from "@/components/shape-visual";
import { Card } from "@/components/ui/card";

export function QuestionCard({
  question,
  selectedKey,
  onSelect,
}: {
  question: ClientQuestion;
  selectedKey: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <Card className="rounded-xl p-5 sm:p-8">
      <p className="mb-4 text-xs font-medium tracking-wide text-primary uppercase">
        {CATEGORY_LABELS[question.category]}
      </p>
      <h2 className="font-display text-xl font-semibold leading-snug whitespace-pre-line sm:text-2xl">
        {question.prompt}
      </h2>
      {question.visual && (
        <div className="mt-6">
          <QuestionVisual visual={question.visual} />
        </div>
      )}
      <div className="mt-6 grid gap-2.5">
        {question.options.map((option, i) => (
          <AnswerOption
            key={option.key}
            option={option}
            index={i}
            selected={selectedKey === option.key}
            onSelect={() => onSelect(option.key)}
          />
        ))}
      </div>
    </Card>
  );
}
