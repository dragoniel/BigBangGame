import { EMOJI, OUTCOME_CONFIG } from "../constants";
import type { ResultPanelProps } from "../types/ResultPanelProps";

export function ResultPanel({ result, choices }: ResultPanelProps) {
  const playerChoice   = choices.find((c) => c.id === result.player);
  const computerChoice = choices.find((c) => c.id === result.computer);
  const config         = OUTCOME_CONFIG[result.results];

  return (
    <div className="result-panel" role="status" aria-live="polite">
      <div className="result-matchup">
        <div className="result-side">
          <span className="result-label">YOU</span>
          <span className="result-big-emoji" aria-hidden="true">
            {playerChoice ? EMOJI[playerChoice.name] : ""}
          </span>
          <span className="result-choice-name">{playerChoice?.name}</span>
        </div>

        <div className="result-vs" aria-hidden="true">VS</div>

        <div className="result-side">
          <span className="result-label">COMPUTER</span>
          <span className="result-big-emoji" aria-hidden="true">
            {computerChoice ? EMOJI[computerChoice.name] : ""}
          </span>
          <span className="result-choice-name">{computerChoice?.name}</span>
        </div>
      </div>

      <div className="result-outcome" style={{ color: config.color }}>
        <span className="result-icon" aria-hidden="true">{config.icon}</span>
        <span className="result-text">{config.label}</span>
      </div>
    </div>
  );
}
