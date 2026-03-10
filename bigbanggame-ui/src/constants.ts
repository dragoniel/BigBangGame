import type { ChoiceName, GameResult } from "./types/enums";

export const EMOJI: Record<ChoiceName, string> = {
  rock:     "🪨",
  paper:    "📄",
  scissors: "✂️",
  lizard:   "🦎",
  spock:    "🖖",
};

export interface OutcomeConfig {
  label: string;
  color: string;
  icon: string;
}

export const OUTCOME_CONFIG: Record<GameResult, OutcomeConfig> = {
  win:  { label: "YOU WIN",    color: "var(--green)", icon: "🏆" },
  lose: { label: "YOU LOSE",   color: "var(--red)",   icon: "💀" },
  tie:  { label: "IT'S A TIE", color: "var(--gold)",  icon: "🤝" },
};
