import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../App";
import { api } from "../../api";
import type { Choice, PlayResult, ScoreboardEntry } from "../../types";

// Mock the entire API module — we test the UI in isolation from the network.
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
const loseResult: PlayResult = { results: "lose", player: 3, computer: 1 };
const tieResult: PlayResult  = { results: "tie",  player: 1, computer: 1 };

const emptyScoreboard: ScoreboardEntry[] = [];
const scoreboardWithEntry: ScoreboardEntry[] = [
  {
    playerChoice:   "rock",
    computerChoice: "scissors",
    result:         "win",
    playedAt:       new Date().toISOString(),
  },
];

// Reset all mocks before each test.
beforeEach(() => {
  jest.clearAllMocks();
  mockApi.getChoices.mockResolvedValue(choices);
  mockApi.getScoreboard.mockResolvedValue(emptyScoreboard);
  mockApi.play.mockResolvedValue(winResult);
  mockApi.resetScoreboard.mockResolvedValue(null);
});

describe("App", () => {
  describe("initial load", () => {
    it("shows all five choice buttons after loading", async () => {
      render(<App />);
      await waitFor(() => {
        expect(screen.getByRole("button", { name: "rock" })).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: "paper" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "scissors" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "lizard" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "spock" })).toBeInTheDocument();
    });

    it("shows the empty scoreboard message initially", async () => {
      render(<App />);
      await waitFor(() => {
        expect(
          screen.getByText("No games played yet. Make your first move!"),
        ).toBeInTheDocument();
      });
    });

    it("shows an error banner if choices fail to load", async () => {
      mockApi.getChoices.mockRejectedValue(new Error("Network error"));
      render(<App />);
      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Could not load choices. Is the API running?",
        );
      });
    });
  });

  describe("playing a round", () => {
    it("shows the result panel after choosing rock and winning", async () => {
      const user = userEvent.setup();
      mockApi.play.mockResolvedValue(winResult);
      mockApi.getScoreboard.mockResolvedValue(scoreboardWithEntry);

      render(<App />);
      await waitFor(() =>
        screen.getByRole("button", { name: "rock" }),
      );

      await user.click(screen.getByRole("button", { name: "rock" }));

      await waitFor(() => {
        expect(screen.getByText("YOU WIN")).toBeInTheDocument();
      });
    });

    it("calls api.play with the correct player id", async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => screen.getByRole("button", { name: "spock" }));
      await user.click(screen.getByRole("button", { name: "spock" }));

      await waitFor(() => expect(mockApi.play).toHaveBeenCalledWith(5));
    });

    it("shows YOU LOSE for a losing result", async () => {
      const user = userEvent.setup();
      mockApi.play.mockResolvedValue(loseResult);

      render(<App />);
      await waitFor(() => screen.getByRole("button", { name: "scissors" }));
      await user.click(screen.getByRole("button", { name: "scissors" }));

      await waitFor(() => {
        expect(screen.getByText("YOU LOSE")).toBeInTheDocument();
      });
    });

    it("shows IT'S A TIE for a tie result", async () => {
      const user = userEvent.setup();
      mockApi.play.mockResolvedValue(tieResult);

      render(<App />);
      await waitFor(() => screen.getByRole("button", { name: "rock" }));
      await user.click(screen.getByRole("button", { name: "rock" }));

      await waitFor(() => {
        expect(screen.getByText("IT'S A TIE")).toBeInTheDocument();
      });
    });

    it("shows an error banner when api.play fails", async () => {
      const user = userEvent.setup();
      mockApi.play.mockRejectedValue(new Error("Server error"));

      render(<App />);
      await waitFor(() => screen.getByRole("button", { name: "rock" }));
      await user.click(screen.getByRole("button", { name: "rock" }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent("Failed to play");
      });
    });
  });

  describe("Play Again", () => {
    it("returns to the choice screen after clicking Play Again", async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => screen.getByRole("button", { name: "rock" }));
      await user.click(screen.getByRole("button", { name: "rock" }));
      await waitFor(() => screen.getByText("YOU WIN"));

      await user.click(screen.getByRole("button", { name: /play again/i }));

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "rock" })).toBeInTheDocument();
      });
      expect(screen.queryByText("YOU WIN")).not.toBeInTheDocument();
    });
  });

  describe("scoreboard", () => {
    it("updates the scoreboard after a round", async () => {
      const user = userEvent.setup();
      mockApi.getScoreboard
        .mockResolvedValueOnce(emptyScoreboard)   // initial load
        .mockResolvedValueOnce(scoreboardWithEntry); // after playing

      render(<App />);
      await waitFor(() => screen.getByRole("button", { name: "rock" }));
      await user.click(screen.getByRole("button", { name: "rock" }));

      await waitFor(() => {
        expect(screen.getByText("WIN")).toBeInTheDocument();
      });
    });

    it("calls api.resetScoreboard when the Reset button is clicked", async () => {
      const user = userEvent.setup();
      mockApi.getScoreboard.mockResolvedValue(scoreboardWithEntry);

      render(<App />);
      await waitFor(() =>
        screen.getByRole("button", { name: /reset scoreboard/i }),
      );

      await user.click(screen.getByRole("button", { name: /reset scoreboard/i }));
      expect(mockApi.resetScoreboard).toHaveBeenCalledTimes(1);
    });
  });
});
