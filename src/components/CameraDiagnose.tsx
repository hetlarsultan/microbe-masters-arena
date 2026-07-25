import { useEffect, useRef, useState } from "react";
import {
  analyzeSpecimen,
  type SpecimenAnalysis,
} from "@/lib/api/analyze-specimen.functions";
import { offlineAnalyze, toPCRIndicator, type PCRIndicator } from "@/lib/specimenKnowledge";
import {
  addRecord,
  clearHistory,
  deleteRecord,
  loadHistory,
  makeThumbnail,
  statusOf,
  type DiagnosisRecord,
} from "@/lib/diagnosisHistory";

type Status = "idle" | "camera" | "captured" | "analyzing" | "done" | "error" | "history";

export function CameraDiagnose({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [result, setResult] = useState<SpecimenAnalysis | null>(null);
  const [source, setSource] = useState<"ai" | "offline">("ai");
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [history, setHistory] = useState<DiagnosisRecord[]>([]);
  const [viewingRecord, setViewingRecord] = useState<DiagnosisRecord | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startCamera(mode: "environment" | "user" = facing) {
    setError("");
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: mode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setFacing(mode);
      setStatus("camera");
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (e) {
      setError(
        (e as Error)?.message ||
          "تعذّر الوصول إلى الكاميرا. تحقّق من إذن المتصفح ثم أعد المحاولة."
      );
      setStatus("error");
    }
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 1024;
    const h = video.videoHeight || 768;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImageDataUrl(dataUrl);
    setStatus("captured");
    stopCamera();
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setStatus("captured");
      stopCamera();
    };
    reader.readAsDataURL(file);
  }

  async function persistResult(r: SpecimenAnalysis, src: "ai" | "offline") {
    const thumb = imageDataUrl ? await makeThumbnail(imageDataUrl) : null;
    addRecord({ source: src, thumbnail: thumb, hint: hint || undefined, result: r });
    setHistory(loadHistory());
  }

  async function analyze() {
    if (!imageDataUrl) return;
    setStatus("analyzing");
    setError("");

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      const r = offlineAnalyze(hint);
      setResult(r);
      setSource("offline");
      setStatus("done");
      await persistResult(r, "offline");
      return;
    }

    try {
      const r = await analyzeSpecimen({ data: { imageDataUrl, hint: hint || undefined } });
      setResult(r);
      setSource("ai");
      setStatus("done");
      await persistResult(r, "ai");
    } catch {
      const r = offlineAnalyze(hint);
      setResult(r);
      setSource("offline");
      setStatus("done");
      await persistResult(r, "offline");
    }
  }

  async function runOfflineNow() {
    const r = offlineAnalyze(hint);
    setResult(r);
    setSource("offline");
    setStatus("done");
    await persistResult(r, "offline");
  }

  function reset() {
    setResult(null);
    setImageDataUrl(null);
    setHint("");
    setError("");
    setStatus("idle");
  }

  function openHistoryRecord(r: DiagnosisRecord) {
    setViewingRecord(r);
  }

  function closeRecordView() {
    setViewingRecord(null);
  }

  function removeRecord(id: string) {
    deleteRecord(id);
    setHistory(loadHistory());
  }

  function wipeHistory() {
    if (confirm("سيتم حذف كل السجل. متابعة؟")) {
      clearHistory();
      setHistory([]);
    }
  }

  return (
    <div dir="rtl" className="relative min-h-screen bg-background px-4 py-6 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            ← رجوع
          </button>
          <div className="text-right">
            <div className="text-xs tracking-widest text-toxic">AI VISION · تشخيص العينات</div>
            <h1 className="text-2xl font-black md:text-3xl">📷 التعرف على العينات بالكاميرا</h1>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="flex-1 rounded-xl border border-border bg-card/60 p-3 text-sm text-muted-foreground">
            صوّر العينة (صبغة جرام، مستعمرات، مسحة دموية، ELISA، جل رحلان، منحنى PCR…) وسيحلّلها المساعد الذكي.
            يعمل التطبيق دون إنترنت باستخدام قاعدة معرفة داخلية.
          </p>
          <button
            onClick={() => setStatus(status === "history" ? "idle" : "history")}
            className="rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/20"
          >
            🗂 سجل التشخيصات ({history.length})
          </button>
        </div>

        {status === "history" && (
          <HistoryPanel
            history={history}
            onOpen={openHistoryRecord}
            onDelete={removeRecord}
            onClear={wipeHistory}
            onClose={() => setStatus("idle")}
          />
        )}

        {status === "idle" && (
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => startCamera("environment")}
              className="rounded-2xl border border-toxic/40 bg-card p-6 text-right transition-all hover:-translate-y-0.5 hover:border-toxic"
              style={{ boxShadow: "var(--shadow-toxic)" }}
            >
              <div className="text-4xl">📸</div>
              <div className="mt-2 text-lg font-bold">تشغيل الكاميرا</div>
              <div className="text-sm text-muted-foreground">
                استخدم الكاميرا الخلفية لتصوير العينة مباشرة.
              </div>
            </button>
            <label className="cursor-pointer rounded-2xl border border-border bg-card p-6 text-right transition-all hover:-translate-y-0.5 hover:border-primary/60">
              <div className="text-4xl">🖼️</div>
              <div className="mt-2 text-lg font-bold">رفع صورة من الجهاز</div>
              <div className="text-sm text-muted-foreground">
                اختر صورة عينة محفوظة مسبقاً للتحليل.
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
          </div>
        )}

        {status === "camera" && (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-black">
              <video ref={videoRef} playsInline muted className="mx-auto max-h-[60vh] w-full object-contain" />
              <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-dashed border-toxic/60" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={capture}
                className="rounded-xl bg-toxic px-5 py-2 font-bold text-background hover:opacity-90"
              >
                📸 التقاط
              </button>
              <button
                onClick={() => startCamera(facing === "environment" ? "user" : "environment")}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
              >
                🔄 تبديل الكاميرا
              </button>
              <button
                onClick={() => { stopCamera(); setStatus("idle"); }}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {(status === "captured" || status === "analyzing") && imageDataUrl && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-black">
              <img src={imageDataUrl} alt="العينة الملتقطة" className="mx-auto max-h-[55vh] w-full object-contain" />
            </div>
            <textarea
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="اختياري: سياق سريري (مثال: مسحة حلق لمريض حمّى، صبغة جرام من قيح، منحنى PCR…)"
              className="min-h-[80px] w-full rounded-xl border border-border bg-card p-3 text-sm"
            />
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={analyze}
                disabled={status === "analyzing"}
                className="rounded-xl bg-toxic px-6 py-2 font-bold text-background hover:opacity-90 disabled:opacity-50"
              >
                {status === "analyzing" ? "⏳ جاري التحليل…" : "🧠 تحليل العينة"}
              </button>
              <button
                onClick={runOfflineNow}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
              >
                📴 تحليل دون إنترنت
              </button>
              <button
                onClick={reset}
                className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
              >
                إعادة الالتقاط
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
            <div className="mt-3">
              <button
                onClick={reset}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
              >
                المحاولة مجدداً
              </button>
            </div>
          </div>
        )}

        {status === "done" && result && (
          <ReportPage result={result} image={imageDataUrl} source={source} onReset={reset} />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {viewingRecord && (
        <RecordModal record={viewingRecord} onClose={closeRecordView} />
      )}
    </div>
  );
}

/* ==================== History Panel ==================== */

function HistoryPanel({
  history,
  onOpen,
  onDelete,
  onClear,
  onClose,
}: {
  history: DiagnosisRecord[];
  onOpen: (r: DiagnosisRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-primary/30 bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-sm font-bold tracking-widest text-primary">🗂 سجل التشخيصات</div>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
            >
              مسح الكل
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-background px-3 py-1 text-xs hover:bg-accent"
          >
            إغلاق
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          لا يوجد سجل بعد. حلّل عينة لتظهر هنا تلقائياً.
        </div>
      ) : (
        <ul className="grid gap-2 md:grid-cols-2">
          {history.map((r) => {
            const st = statusOf(r);
            const date = new Date(r.date).toLocaleString("ar-EG");
            return (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-2"
              >
                <button
                  onClick={() => onOpen(r)}
                  className="flex flex-1 items-center gap-3 text-right"
                >
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-black">
                    {r.thumbnail ? (
                      <img src={r.thumbnail} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-2xl">🧪</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-bold">{r.result.specimen}</div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: `${st.color}22`, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{r.result.diagnosis}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{date}</span>
                      <span>•</span>
                      <span>{r.source === "ai" ? "AI" : "OFFLINE"}</span>
                      <span>•</span>
                      <span>ثقة {r.result.confidence}%</span>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onDelete(r.id)}
                  className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  title="حذف"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function RecordModal({ record, onClose }: { record: DiagnosisRecord; onClose: () => void }) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-background p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            تقرير محفوظ · {new Date(record.date).toLocaleString("ar-EG")}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-3 py-1 text-sm hover:bg-accent"
          >
            ✕ إغلاق
          </button>
        </div>
        <ReportPage
          result={record.result}
          image={record.thumbnail}
          source={record.source}
          onReset={onClose}
          resetLabel="إغلاق التقرير"
        />
      </div>
    </div>
  );
}

/* ==================== Full Diagnosis Report Page ==================== */

function ReportPage({
  result,
  image,
  source,
  onReset,
  resetLabel = "تحليل عينة أخرى",
}: {
  result: SpecimenAnalysis;
  image: string | null;
  source: "ai" | "offline";
  onReset: () => void;
  resetLabel?: string;
}) {
  const conf = Math.max(0, Math.min(100, result.confidence));
  const pcr = toPCRIndicator(result);
  const reportId = `LAB-${Date.now().toString().slice(-8)}`;
  const now = new Date().toLocaleString("ar-EG");

  function printReport() {
    window.print();
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-2xl border border-toxic/40 bg-card p-5" style={{ boxShadow: "var(--shadow-toxic)" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs tracking-widest text-muted-foreground">تقرير تشخيصي مخبري</div>
            <h2 className="text-2xl font-black">🧪 تقرير التشخيص بالذكاء البصري</h2>
          </div>
          <div className="text-left text-xs text-muted-foreground">
            <div>رقم التقرير: <span className="font-mono text-foreground">{reportId}</span></div>
            <div>التاريخ: {now}</div>
            <div className="mt-1">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  source === "ai" ? "bg-toxic/20 text-toxic" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                }`}
              >
                {source === "ai" ? "AI ONLINE" : "OFFLINE KB"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image + Summary */}
      <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        {image && (
          <div className="overflow-hidden rounded-2xl border border-border bg-black">
            <img src={image} alt="العينة" className="w-full object-contain" />
          </div>
        )}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-toxic/15 px-3 py-1 text-xs font-bold text-toxic">
              {result.category}
            </span>
            <span className="text-xs text-muted-foreground">درجة الثقة</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">نوع العينة</div>
          <h3 className="text-xl font-black">{result.specimen}</h3>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-toxic transition-all" style={{ width: `${conf}%` }} />
          </div>
          <div className="mt-1 text-left text-xs text-muted-foreground">{conf}%</div>

          <div className="mt-4">
            <div className="text-xs font-semibold tracking-widest text-muted-foreground">التشخيص المبدئي</div>
            <div className="mt-1 text-lg font-bold">{result.diagnosis}</div>
          </div>
        </div>
      </div>

      {/* PCR-style indicator strip */}
      <PCRIndicatorPanel pcr={pcr} />

      {/* Findings */}
      <Section title="🔬 المشاهدات المخبرية" items={result.findings} empty="لا توجد مشاهدات." />

      {/* Pathogens */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 text-sm font-semibold tracking-widest text-muted-foreground">
          🦠 المسببات المرضية المحتملة
        </div>
        {result.likelyPathogens.length === 0 ? (
          <div className="text-sm text-muted-foreground">لم يتم اقتراح مسببات.</div>
        ) : (
          <ul className="space-y-2">
            {result.likelyPathogens.map((p, i) => (
              <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background/50 p-3">
                <div>
                  <div className="font-bold">{p.arabic}</div>
                  <div className="text-xs italic text-muted-foreground">{p.name}</div>
                </div>
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                  احتمال {p.probability}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommended tests */}
      <Section title="🧪 فحوص تأكيدية مقترحة" items={result.recommendedTests} empty="لا توجد فحوص إضافية مقترحة." />

      {result.notes && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <div className="mb-1 font-bold text-amber-600 dark:text-amber-400">ملاحظات</div>
          <div>{result.notes}</div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card/60 p-3 text-center text-xs text-muted-foreground">
        نتيجة إرشادية تعليمية — لا تُستخدم للتشخيص السريري الفعلي.
      </div>

      <div className="flex flex-wrap justify-center gap-2 print:hidden">
        <button
          onClick={printReport}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-accent"
        >
          🖨 طباعة / حفظ PDF
        </button>
        <button
          onClick={onReset}
          className="rounded-xl bg-toxic px-6 py-2 font-bold text-background hover:opacity-90"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}

/* ---------- PCR Indicator Panel ---------- */

function PCRIndicatorPanel({ pcr }: { pcr: PCRIndicator }) {
  const width = 320;
  const height = 110;
  const cycles = 40;
  const ct = pcr.ctValue;
  const points: string[] = [];
  for (let c = 1; c <= cycles; c++) {
    const y = 1 / (1 + Math.exp(-(c - ct) * 0.6));
    const px = (c / cycles) * width;
    const py = height - 10 - y * (height - 20);
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const thresholdY = height - 10 - 0.5 * (height - 20);

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: `${pcr.color}55`, background: `${pcr.color}0d` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold tracking-widest text-muted-foreground">
            📈 مؤشر Real-Time PCR (مُشتق من نتيجة الصورة)
          </div>
          <div className="text-lg font-black" style={{ color: pcr.color }}>
            {pcr.status}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs md:grid-cols-4">
          <Metric label="Ct Value" value={pcr.ctValue.toFixed(1)} color={pcr.color} />
          <Metric label="Threshold" value={pcr.threshold.toFixed(2)} />
          <Metric label="Baseline" value={pcr.baseline.toFixed(2)} />
          <Metric label="Efficiency" value={`${pcr.efficiency}%`} />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background/60 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={0}
              x2={width}
              y1={height - 10 - f * (height - 20)}
              y2={height - 10 - f * (height - 20)}
              stroke="currentColor"
              strokeOpacity={0.08}
            />
          ))}
          <line
            x1={0}
            x2={width}
            y1={thresholdY}
            y2={thresholdY}
            stroke={pcr.color}
            strokeDasharray="4 4"
            strokeWidth={1.2}
          />
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={pcr.color}
            strokeWidth={2}
          />
          <line
            x1={(ct / cycles) * width}
            x2={(ct / cycles) * width}
            y1={10}
            y2={height - 10}
            stroke={pcr.color}
            strokeOpacity={0.4}
            strokeDasharray="2 3"
          />
        </svg>
      </div>

      <div className="mt-2 text-sm">{pcr.interpretation}</div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-md border border-border bg-background/50 px-2 py-1">
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="font-mono text-sm font-bold" style={{ color: color ?? undefined }}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 text-sm font-semibold tracking-widest text-muted-foreground">{title}</div>
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">{empty}</div>
      ) : (
        <ul className="list-inside list-disc space-y-1 text-sm">
          {items.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
