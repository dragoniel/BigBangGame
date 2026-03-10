import type { ScoreboardEntry } from "./ScoreboardEntry";

export interface ScoreboardProps {
  entries: ScoreboardEntry[];
  onReset: () => void;
  loading: boolean;
}