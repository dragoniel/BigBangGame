import { EMOJI } from "../constants";
import type { ChoiceButtonProps } from "../types/ChoiceButtonProps";

export function ChoiceButton({
  choice,
  selected,
  disabled,
  onClick,
}: ChoiceButtonProps) {
  return (
    <button
      className={`choice-btn${selected ? " selected" : ""}`}
      onClick={() => onClick(choice)}
      disabled={disabled}
      aria-label={choice.name}
      aria-pressed={selected}
    >
      <span className="choice-emoji" aria-hidden="true">
        {EMOJI[choice.name]}
      </span>
      <span className="choice-name">{choice.name}</span>
    </button>
  );
}
