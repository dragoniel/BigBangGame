import { EMOJI, OUTCOME_CONFIG } from "../constants"
import type { ChoiceName, GameResult } from "../types/enums";

describe("EMOJI", () => {
  const choiceNames: ChoiceName[] = ["rock", "paper", "scissors", "lizard", "spock"];

  it("has an emoji for every choice name", () => {
    choiceNames.forEach((name) => {
      expect(EMOJI[name]).toBeTruthy();
    });
  });

  it("has exactly five entries", () => {
    expect(Object.keys(EMOJI)).toHaveLength(5);
  });
});

describe("OUTCOME_CONFIG", () => {
  const outcomes: GameResult[] = ["win", "lose", "tie"];

  it("has a config for every outcome", () => {
    outcomes.forEach((outcome) => {
      expect(OUTCOME_CONFIG[outcome]).toBeDefined();
    });
  });

  it("each config has a label, color, and icon", () => {
    outcomes.forEach((outcome) => {
      const config = OUTCOME_CONFIG[outcome];
      expect(config.label).toBeTruthy();
      expect(config.color).toBeTruthy();
      expect(config.icon).toBeTruthy();
    });
  });

  it("win label is YOU WIN", () => {
    expect(OUTCOME_CONFIG.win.label).toBe("YOU WIN");
  });

  it("lose label is YOU LOSE", () => {
    expect(OUTCOME_CONFIG.lose.label).toBe("YOU LOSE");
  });

  it("tie label is IT'S A TIE", () => {
    expect(OUTCOME_CONFIG.tie.label).toBe("IT'S A TIE");
  });
});
