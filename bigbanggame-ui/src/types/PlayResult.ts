import type { GameResult } from "./enums";

export interface PlayResult {
  results: GameResult;
  player: number;
  computer: number;
}