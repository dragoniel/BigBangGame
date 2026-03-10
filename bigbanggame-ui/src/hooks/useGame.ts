import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import type { Choice } from "../types/Choice";
import type { PlayResult } from "../types/PlayResult";
import type { ScoreboardEntry } from "../types/ScoreboardEntry";

interface GameState {
  choices: Choice[];
  selected: Choice | null;
  result: PlayResult | null;
  scoreboard: ScoreboardEntry[];
  playing: boolean;
  error: string | null;
}

interface GameActions {
  play: (choice: Choice) => Promise<void>;
  playAgain: () => void;
  resetScoreboard: () => Promise<void>;
}

/**
 * Encapsulates all game state and side-effects.
 *
 * Extracting this into a hook keeps the component tree focused on rendering
 * and makes the logic independently testable without mounting a full component.
 */
export function useGame(): GameState & GameActions {
  const [choices,    setChoices]    = useState<Choice[]>([]);
  const [selected,   setSelected]   = useState<Choice | null>(null);
  const [result,     setResult]     = useState<PlayResult | null>(null);
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [playing,    setPlaying]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const loadScoreboard = useCallback(async () => {
    try {
      const data = await api.getScoreboard();
      setScoreboard(data ?? []);
    } catch {
      // Non-critical — scoreboard errors don't block gameplay.
    }
  }, []);

  useEffect(() => {
    api
      .getChoices()
      .then(setChoices)
      .catch(() => setError("Could not load choices. Is the API running?"));

    void loadScoreboard();
  }, [loadScoreboard]);

  const play = useCallback(
    async (choice: Choice) => {
      if (playing) return;
      setSelected(choice);
      setPlaying(true);
      setError(null);
      setResult(null);

      try {
        const data = await api.play(choice.id);
        setResult(data);
        await loadScoreboard();
      } catch (err) {
        setError(`Failed to play: ${err instanceof Error ? err.message : "Unknown error"}`);
      } finally {
        setPlaying(false);
      }
    },
    [playing, loadScoreboard],
  );

  const playAgain = useCallback(() => {
    setSelected(null);
    setResult(null);
    setError(null);
  }, []);

  const resetScoreboard = useCallback(async () => {
    try {
      await api.resetScoreboard();
      setScoreboard([]);
    } catch {
      setError("Failed to reset the scoreboard.");
    }
  }, []);

  return {
    choices,
    selected,
    result,
    scoreboard,
    playing,
    error,
    play,
    playAgain,
    resetScoreboard,
  };
}
