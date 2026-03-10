import { useGame } from "./hooks/useGame";
import { ChoiceButton } from "./components/ChoiceButton";
import { ResultPanel }  from "./components/ResultPanel";
import { Scoreboard }   from "./components/Scoreboard";
import "./index.css";

export default function App() {
  const {
    choices,
    selected,
    result,
    scoreboard,
    playing,
    error,
    play,
    playAgain,
    resetScoreboard,
  } = useGame();

  return (
    <div className="app">
      <header className="app-header">
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner" role="alert">
            ⚠️ {error}
          </div>
        )}

        {result == null ? (
          <section className="choice-section" aria-labelledby="choose-heading">
            <h2 id="choose-heading" className="section-title">
              {playing ? "Waiting for the computer…" : "Make your choice"}
            </h2>
            <div className="choices-grid" role="group" aria-label="Game choices">
              {choices.map((c) => (
                <ChoiceButton
                  key={c.id}
                  choice={c}
                  selected={selected?.id === c.id}
                  disabled={playing}
                  onClick={play}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="result-section">
            <ResultPanel result={result} choices={choices} />
            <button className="play-again-btn" onClick={playAgain}>
              Play Again
            </button>
          </section>
        )}

        <Scoreboard
          entries={scoreboard}
          onReset={resetScoreboard}
          loading={playing}
        />
      </main>
    </div>
  );
}
