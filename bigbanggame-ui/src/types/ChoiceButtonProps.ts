import type { Choice } from "./Choice";

export interface ChoiceButtonProps {
  choice: Choice;
  selected: boolean;
  disabled: boolean;
  onClick: (choice: Choice) => void;
}