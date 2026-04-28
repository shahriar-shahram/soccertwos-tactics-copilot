const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function normalizeDisplayText<T>(value: T): T {
  if (typeof value === "string") {
    return value
      .replaceAll("Orange", "Purple")
      .replaceAll("orange", "purple")
      .replaceAll("ORANGE", "PURPLE") as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeDisplayText(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeDisplayText(item),
      ])
    ) as T;
  }

  return value;
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed request: ${url}`);
  const data = (await res.json()) as T;
  return normalizeDisplayText(data);
}

export type MatchListItem = {
  id: string;
  title: string;
  score: {
    blue: number;
    orange: number;
  };
  summary: string;
};

export type MatchEvent = {
  step: number;
  type: string;
  team: string;
  tag?: string;
  text: string;
};

export type MatchDetail = {
  id: string;
  title: string;
  score: {
    blue: number;
    orange: number;
  };
  summary: string;
  duration_steps?: number;
  policy_id?: string;
  elo_estimate?: number;
  video_path?: string;
  teams?: {
    blue: string;
    orange: string;
  };
  events: MatchEvent[];
};

export type RunListItem = {
  run_id: string;
  has_top_level_onnx: boolean;
  has_checkpoint: boolean;
  has_config: boolean;
  has_readme: boolean;
  has_timers: boolean;
  has_status: boolean;
  latest_snapshot: string | null;
  artifact_count: number;
};

export type RunDetail = {
  run_id: string;
  files: string[];
};

export type GroundingItem = {
  source: string;
  content: string;
};

export type CopilotResponse = {
  answer: string;
  grounding?: GroundingItem[];
};

export async function getMatches(): Promise<MatchListItem[]> {
  return getJson<MatchListItem[]>(`${API_BASE_URL}/matches`);
}

export async function getMatchById(matchId: string): Promise<MatchDetail> {
  return getJson<MatchDetail>(`${API_BASE_URL}/matches/${matchId}`);
}

export async function getRuns(): Promise<RunListItem[]> {
  return getJson<RunListItem[]>(`${API_BASE_URL}/runs`);
}

export async function getRunById(runId: string): Promise<RunDetail> {
  return getJson<RunDetail>(`${API_BASE_URL}/runs/${runId}`);
}

export async function askCopilot(
  matchId: string,
  question: string
): Promise<CopilotResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      match_id: matchId,
      question,
    }),
  });

  if (!res.ok) throw new Error("Failed to get copilot answer");

  const data = (await res.json()) as CopilotResponse;
  return normalizeDisplayText(data);
}
