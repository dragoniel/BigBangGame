import type { ChoiceName, GameResult } from "./enums";

export interface ScoreboardEntry {
  playerChoice: ChoiceName;
  computerChoice: ChoiceName;
  result: GameResult;
  playedAt: string;
}