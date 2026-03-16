/**
 * Prompt history (PP-403). Uses localStorage until Supabase is available.
 * Swap to Supabase client in saveToHistory + getHistory when ready.
 */

const SESSION_KEY = "pp_session_id";
const HISTORY_KEY = "pp_optimization_history";
const MAX_HISTORY = 100;
const DISPLAY_LIMIT = 20;

export interface HistoryItem {
  id: string;
  session_id: string;
  prompt_original: string;
  prompt_optimized: string;
  mode: string;
  explanation: string;
  created_at: string;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  return getOrCreateSessionId();
}

export async function saveToHistory(
  original: string,
  optimized: string,
  mode: string,
  explanation: string
): Promise<void> {
  const sessionId = getOrCreateSessionId();
  const raw = localStorage.getItem(HISTORY_KEY);
  const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
  const item: HistoryItem = {
    id: crypto.randomUUID(),
    session_id: sessionId,
    prompt_original: original,
    prompt_optimized: optimized,
    mode,
    explanation: explanation ?? "",
    created_at: new Date().toISOString(),
  };
  list.unshift(item);
  const trimmed = list.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export async function getHistory(): Promise<HistoryItem[]> {
  if (typeof window === "undefined") return [];
  const sessionId = getOrCreateSessionId();
  const raw = localStorage.getItem(HISTORY_KEY);
  const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
  const forSession = list.filter((i) => i.session_id === sessionId);
  return forSession.slice(0, DISPLAY_LIMIT);
}
