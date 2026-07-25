import type { SpecimenAnalysis } from "./api/analyze-specimen.functions";

export type DiagnosisRecord = {
  id: string;
  date: number; // epoch ms
  source: "ai" | "offline";
  thumbnail: string | null; // small data URL
  hint?: string;
  result: SpecimenAnalysis;
};

const KEY = "microlab.diagnosisHistory.v1";
const MAX = 50;

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadHistory(): DiagnosisRecord[] {
  const s = safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as DiagnosisRecord[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveHistory(list: DiagnosisRecord[]) {
  const s = safeStorage();
  if (!s) return;
  try {
    s.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // storage full or blocked — ignore
  }
}

export async function makeThumbnail(dataUrl: string, maxW = 220): Promise<string | null> {
  try {
    if (typeof document === "undefined") return dataUrl;
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = dataUrl;
    });
    const scale = Math.min(1, maxW / img.width);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/jpeg", 0.6);
  } catch {
    return null;
  }
}

export function addRecord(rec: Omit<DiagnosisRecord, "id" | "date">): DiagnosisRecord {
  const list = loadHistory();
  const full: DiagnosisRecord = {
    ...rec,
    id: `LAB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    date: Date.now(),
  };
  const next = [full, ...list].slice(0, MAX);
  saveHistory(next);
  return full;
}

export function deleteRecord(id: string) {
  saveHistory(loadHistory().filter((r) => r.id !== id));
}

export function clearHistory() {
  saveHistory([]);
}

export function statusOf(r: DiagnosisRecord): { label: string; color: string } {
  const c = r.result.confidence;
  if (c >= 75) return { label: "إيجابي واضح", color: "#22c55e" };
  if (c >= 55) return { label: "حدّي", color: "#f59e0b" };
  if (c >= 20) return { label: "سلبي/ضعيف", color: "#64748b" };
  return { label: "غير صالح", color: "#ef4444" };
}
