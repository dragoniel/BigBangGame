import { renderHook, act, waitFor } from "@testing-library/react";
import { useGame } from "../../hooks/useGame";
import { api } from "../../api";
import type { Choice, PlayResult, ScoreboardEntry } from "../../types";

jest.mock("../../api");
const mockApi = api as jest.Mocked<typeof api>;

const choices: Choice[] = [
  { id: 1, name: "rock" },
  { id: 2, name: "paper" },
  { id: 3, name: "scissors" },
  { id: 4, name: "lizard" },
  { id: 5, name: "spock" },
];

const winResult: PlayResult = { results: "win", player: 1, computer: 3 };

const scoreEntry: ScoreboardEntry = {
  playerChoice:   "rock",
  computerChoice: "scissors",
  result:         "win",
  playedAt:       new Date().toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockApi.getChoices.mockResolvedValue(choices);
  mockApi.getScoreboard.mockResolvedValue([]);
  mockApi.play.mockResolvedValue(winResult);
  mockApi.resetScoreboard.mockResolvedValue(null);
});

describe("useGame", () => {
  describe("initialisation", () => {
    it("starts with empty choices and no result", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));
      expect(result.current.result).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it("loads choices from the API on mount", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));
      expect(mockApi.getChoices).toHaveBeenCalledTimes(1);
    });

    it("loads the scoreboard on mount", async () => {
      renderHook(() => useGame());
      await waitFor(() => expect(mockApi.getScoreboard).toHaveBeenCalledTimes(1));
    });

    it("sets an error when getChoices fails", async () => {
      mockApi.getChoices.mockRejectedValue(new Error("Network error"));
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.error).not.toBeNull());
      expect(result.current.error).toMatch(/Could not load choices/);
    });
  });

  describe("play", () => {
    it("sets result after a successful play", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => {
        await result.current.play(choices[0]);
      });

      expect(result.current.result).toEqual(winResult);
    });

    it("sets selected choice while playing", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => {
        await result.current.play(choices[0]);
      });

      expect(result.current.selected).toEqual(choices[0]);
    });

    it("reloads scoreboard after a round", async () => {
      mockApi.getScoreboard
        .mockResolvedValueOnce([])           // mount
        .mockResolvedValueOnce([scoreEntry]); // after play

      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => {
        await result.current.play(choices[0]);
      });

      expect(result.current.scoreboard).toHaveLength(1);
    });

    it("sets an error when api.play rejects", async () => {
      mockApi.play.mockRejectedValue(new Error("Bad gateway"));
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => {
        await result.current.play(choices[0]);
      });

      expect(result.current.error).toMatch(/Failed to play/);
      expect(result.current.result).toBeNull();
    });

    it("sets playing=false after the round completes (success)", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => {
        await result.current.play(choices[0]);
      });

      expect(result.current.playing).toBe(false);
    });

    it("sets playing=false after the round completes (error)", async () => {
      mockApi.play.mockRejectedValue(new Error("Oops"));
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => {
        await result.current.play(choices[0]);
      });

      expect(result.current.playing).toBe(false);
    });

    it("ignores a second call while already playing", async () => {
      let resolvePlay!: (v: PlayResult) => void;
      mockApi.play.mockReturnValue(
        new Promise<PlayResult>((res) => { resolvePlay = res; }),
      );

      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      act(() => { void result.current.play(choices[0]); });
      act(() => { void result.current.play(choices[1]); }); // should be ignored

      await act(async () => { resolvePlay(winResult); });

      // Only one call despite two invocations
      expect(mockApi.play).toHaveBeenCalledTimes(1);
    });
  });

  describe("playAgain", () => {
    it("clears result, selected, and error", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => { await result.current.play(choices[0]); });
      expect(result.current.result).not.toBeNull();

      act(() => { result.current.playAgain(); });

      expect(result.current.result).toBeNull();
      expect(result.current.selected).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe("resetScoreboard", () => {
    it("clears the scoreboard", async () => {
      mockApi.getScoreboard.mockResolvedValue([scoreEntry]);
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.scoreboard).toHaveLength(1));

      await act(async () => { await result.current.resetScoreboard(); });

      expect(result.current.scoreboard).toHaveLength(0);
    });

    it("calls api.resetScoreboard", async () => {
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => { await result.current.resetScoreboard(); });

      expect(mockApi.resetScoreboard).toHaveBeenCalledTimes(1);
    });

    it("sets an error if resetScoreboard fails", async () => {
      mockApi.resetScoreboard.mockRejectedValue(new Error("Forbidden"));
      const { result } = renderHook(() => useGame());
      await waitFor(() => expect(result.current.choices).toHaveLength(5));

      await act(async () => { await result.current.resetScoreboard(); });

      expect(result.current.error).toMatch(/Failed to reset/);
    });
  });
});
