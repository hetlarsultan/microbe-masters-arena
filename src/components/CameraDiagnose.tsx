import { useEffect, useRef, useState } from "react";
import {
  analyzeSpecimen,
  type SpecimenAnalysis,
} from "@/lib/api/analyze-specimen.functions";

type Status = "idle" | "camera" | "captured" | "analyzing" | "done" | "error";

export function CameraDiagnose({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [result, setResult] = useState<SpecimenAnalysis | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");

  useEffect(() => {
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
      // Wait a tick for video element
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

  async function analyze() {
    if (!imageDataUrl) return;
    setStatus("analyzing");
    setError("");
    try {
      const r = await analyzeSpecimen({ data: { imageDataUrl, hint: hint || undefined } });
      setResult(r);
      setStatus("done");
    } catch (e) {
      setError((e as Error)?.message || "فشل التحليل");
      setStatus("error");
    }
  }

  function reset() {
    setResult(null);
    setImageDataUrl(null);
    setHint("");
    setError("");
    setStatus("idle");
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

        <p className="mb-6 rounded-xl border border-border bg-card/60 p-3 text-sm text-muted-foreground">
          صوّر العينة (صبغة جرام، مستعمرات، مسحة دموية، لوحة ELISA، جل رحلان،
          فحص بول/براز، شريط اختبار، منحنى PCR…) وسيتولّى المساعد الميكروبيولوجي
          الذكي تحليلها واقتراح التشخيص المبدئي.
        </p>

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
              placeholder="اختياري: سياق سريري (مثال: مسحة حلق لمريض حمّى، صبغة جرام من قيح)"
              className="min-h-[80px] w-full rounded-xl border border-border bg-card p-3 text-sm"
            />
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={analyze}
                disabled={status === "analyzing"}
                className="rounded-xl bg-toxic px-6 py-2 font-bold text-background hover:opacity-90 disabled:opacity-50"
              >
                {status === "analyzing" ? "⏳ جاري التحليل بالذكاء الاصطناعي…" : "🧠 تحليل العينة"}
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
          <ResultPanel result={result} image={imageDataUrl} onReset={reset} />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

function ResultPanel({
  result,
  image,
  onReset,
}: {
  result: SpecimenAnalysis;
  image: string | null;
  onReset: () => void;
}) {
  const conf = Math.max(0, Math.min(100, result.confidence));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
        {image && (
          <div className="overflow-hidden rounded-2xl border border-border bg-black">
            <img src={image} alt="العينة" className="w-full object-contain" />
          </div>
        )}
        <div className="rounded-2xl border border-toxic/40 bg-card p-5" style={{ boxShadow: "var(--shadow-toxic)" }}>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-toxic/15 px-3 py-1 text-xs font-bold text-toxic">
              {result.category}
            </span>
            <span className="text-xs text-muted-foreground">درجة الثقة</span>
          </div>
          <h2 className="mt-2 text-xl font-black">{result.specimen}</h2>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-toxic transition-all"
              style={{ width: `${conf}%` }}
            />
          </div>
          <div className="mt-1 text-left text-xs text-muted-foreground">{conf}%</div>

          <div className="mt-4">
            <div className="text-xs font-semibold tracking-widest text-muted-foreground">التشخيص المبدئي</div>
            <div className="mt-1 text-lg font-bold">{result.diagnosis}</div>
          </div>
        </div>
      </div>

      <Section title="🔬 المشاهدات" items={result.findings} empty="لا توجد مشاهدات." />

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 text-sm font-semibold tracking-widest text-muted-foreground">
          🦠 المسببات المحتملة
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

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="rounded-xl bg-toxic px-6 py-2 font-bold text-background hover:opacity-90"
        >
          تحليل عينة أخرى
        </button>
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
