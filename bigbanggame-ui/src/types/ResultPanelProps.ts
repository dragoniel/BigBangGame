import type { Choice } from "./Choice";
import type { PlayResult } from "./PlayResult";

export interface ResultPanelProps {
  result: PlayResult;
  choices: Choice[];
}