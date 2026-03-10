import type { Choice } from "./types/Choice";
import type { PlayResult } from "./types/PlayResult";
import type { ScoreboardEntry } from "./types/ScoreboardEntry";

// const BASE = (import.meta as ImportMeta & { env: Record<string, string> }).env
//   .VITE_API_URL ?? "";
const BASE = import.meta.env.VITE_API_URL ?? "";

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, `${res.status} ${res.statusText}: ${text}`);
  }

  if (res.status === 204)
  {
    return null as T;
  }
  return res.json() as Promise<T>;
}

export const api = {
  getChoices: (): Promise<Choice[]> =>
    request<Choice[]>("GET", "/choices"),

  play: (player: number): Promise<PlayResult> =>
    request<PlayResult>("POST", "/play", { player }),

  getScoreboard: (): Promise<ScoreboardEntry[]> =>
    request<ScoreboardEntry[]>("GET", "/scoreboard"),

  resetScoreboard: (): Promise<null> =>
    request<null>("DELETE", "/scoreboard"),
};
