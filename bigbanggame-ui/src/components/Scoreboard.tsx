import { EMOJI } from "../constants";
import type { ScoreboardProps } from "../types/ScoreboardProps";

export function Scoreboard({ entries, onReset, loading }: ScoreboardProps) {
  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <h2>Recent Results</h2>
        <button
          className="reset-btn"
          onClick={onReset}
          disabled={loading || entries.length === 0}
          aria-label="Reset scoreboard"
        >
          Reset
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="scoreboard-empty">No games played yet. Make your first move!</p>
      ) : (
        <table className="scoreboard-table">
          <thead>
            <tr>
              <th scope="col">You</th>
              <th scope="col">Computer</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className={`score-row score-${entry.result}`}>
                <td>
                  <span aria-hidden="true">{EMOJI[entry.playerChoice]}</span>{" "}
                  {entry.playerChoice}
                </td>
                <td>
                  <span aria-hidden="true">{EMOJI[entry.computerChoice]}</span>{" "}
                  {entry.computerChoice}
                </td>
                <td className="score-result">{entry.result.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
