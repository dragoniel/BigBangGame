import { render, screen } from "@testing-library/react";
import { ResultPanel } from "../../components/ResultPanel";
import type { PlayResult } from "../../types/PlayResult";
import type { Choice } from "../../types/Choice";

const choices: Choice[] = [
  { id: 1, name: "rock" },
  { id: 2, name: "paper" },
  { id: 3, name: "scissors" },
  { id: 4, name: "lizard" },
  { id: 5, name: "spock" },
];

const makeResult = (
  results: PlayResult["results"],
  player = 1,
  computer = 3,
): PlayResult => ({ results, player, computer });

describe("ResultPanel", () => {
  it("displays the player's choice name", () => {
    render(<ResultPanel result={makeResult("win", 1, 3)} choices={choices} />);
    // rock (player id=1)
    expect(screen.getByText("rock")).toBeInTheDocument();
  });

  it("displays the computer's choice name", () => {
    render(<ResultPanel result={makeResult("win", 1, 3)} choices={choices} />);
    // scissors (computer id=3)
    expect(screen.getByText("scissors")).toBeInTheDocument();
  });

  it("displays YOU WIN for a win result", () => {
    render(<ResultPanel result={makeResult("win")} choices={choices} />);
    expect(screen.getByText("YOU WIN")).toBeInTheDocument();
  });

  it("displays YOU LOSE for a lose result", () => {
    render(<ResultPanel result={makeResult("lose")} choices={choices} />);
    expect(screen.getByText("YOU LOSE")).toBeInTheDocument();
  });

  it("displays IT'S A TIE for a tie result", () => {
    render(<ResultPanel result={makeResult("tie", 1, 1)} choices={choices} />);
    expect(screen.getByText("IT'S A TIE")).toBeInTheDocument();
  });

  it("has role=status for screen reader announcements", () => {
    render(<ResultPanel result={makeResult("win")} choices={choices} />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has aria-live=polite for non-intrusive announcements", () => {
    render(<ResultPanel result={makeResult("win")} choices={choices} />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("shows YOU and COMPUTER labels", () => {
    render(<ResultPanel result={makeResult("win")} choices={choices} />);
    expect(screen.getByText("YOU")).toBeInTheDocument();
    expect(screen.getByText("COMPUTER")).toBeInTheDocument();
  });

  it("shows all five choice labels", () => {
    choices.forEach((choice) => {
      const { unmount } = render(
        <ResultPanel result={makeResult("win", choice.id, choice.id)} choices={choices} />,
      );
      expect(screen.getAllByText(choice.name).length).toBe(2); // player and computer
      unmount();
    });
  });
});
