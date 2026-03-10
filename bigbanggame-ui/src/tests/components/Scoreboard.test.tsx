import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Scoreboard } from "../../components/Scoreboard";
import type { ScoreboardEntry } from "../../types";

const makeEntry = (
  playerChoice: ScoreboardEntry["playerChoice"] = "rock",
  computerChoice: ScoreboardEntry["computerChoice"] = "scissors",
  result: ScoreboardEntry["result"] = "win",
): ScoreboardEntry => ({
  playerChoice,
  computerChoice,
  result,
  playedAt: new Date().toISOString(),
});

describe("Scoreboard", () => {
  describe("when empty", () => {
    it("shows the empty-state message", () => {
      render(<Scoreboard entries={[]} onReset={jest.fn()} loading={false} />);
      expect(
        screen.getByText("No games played yet. Make your first move!"),
      ).toBeInTheDocument();
    });

    it("does not render the table", () => {
      render(<Scoreboard entries={[]} onReset={jest.fn()} loading={false} />);
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("disables the reset button", () => {
      render(<Scoreboard entries={[]} onReset={jest.fn()} loading={false} />);
      expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
    });
  });

  describe("with entries", () => {
    const entries: ScoreboardEntry[] = [
      makeEntry("rock",    "scissors", "win"),
      makeEntry("spock",  "lizard",    "lose"),
      makeEntry("paper",   "paper",    "tie"),
    ];

    it("renders a row for each entry", () => {
      render(<Scoreboard entries={entries} onReset={jest.fn()} loading={false} />);
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(entries.length + 1);// +1 for the header row
    });

    it("shows player and computer choices in each row", () => {
      render(<Scoreboard entries={entries} onReset={jest.fn()} loading={false} />);
      expect(screen.getByText("rock")).toBeInTheDocument();//player
      expect(screen.getByText("spock")).toBeInTheDocument();

      expect(screen.getByText("scissors")).toBeInTheDocument();//computer
      expect(screen.getByText("lizard")).toBeInTheDocument();

      expect(screen.getAllByText("paper").length).toBe(2); // player and computer
    });

    it("displays result in uppercase", () => {
      render(<Scoreboard entries={entries} onReset={jest.fn()} loading={false} />);
      expect(screen.getByText("WIN")).toBeInTheDocument();
      expect(screen.getByText("LOSE")).toBeInTheDocument();
      expect(screen.getByText("TIE")).toBeInTheDocument();
    });

    it("enables the reset button when entries exist", () => {
      render(<Scoreboard entries={entries} onReset={jest.fn()} loading={false} />);
      expect(screen.getByRole("button", { name: /reset/i })).toBeEnabled();
    });
  });

  describe("reset button", () => {
    it("calls onReset when clicked", async () => {
      const user = userEvent.setup();
      const onReset = jest.fn();
      const entries = [makeEntry()];

      render(<Scoreboard entries={entries} onReset={onReset} loading={false} />);
      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it("is disabled while loading", () => {
      render(
        <Scoreboard entries={[makeEntry()]} onReset={jest.fn()} loading={true} />,
      );
      expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
    });
  });

  describe("column headers", () => {
    it("renders You, Computer, and Result column headers", () => {
      render(<Scoreboard entries={[makeEntry()]} onReset={jest.fn()} loading={false} />);
      expect(screen.getByRole("columnheader", { name: "You" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Computer" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Result" })).toBeInTheDocument();
    });
  });
});
