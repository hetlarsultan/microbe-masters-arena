import { useEffect, useMemo, useRef, useState } from "react";
import { PathogenScene } from "@/components/PathogenScene";
import type { PathogenVisual } from "@/lib/pathogenVisuals";


/* ============================================================
   PCR Lab Simulator Pro — محاكاة معمل PCR احترافية
   8 مراحل: السلامة → التحقق → الاستخلاص → القياس → Master Mix
           → برمجة الجهاز → التشغيل → تحليل Real-Time
   ============================================================ */

type Stage =
  | "intro"
  | "biosafety"
  | "verify"
  | "extract"
  | "quant"
  | "mastermix"
  | "program"
  | "run"
  | "analyze"
  | "report";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "ذكر" | "أنثى";
  sample: string;
  disease: string;
  target: "DNA" | "RNA";
  expectedCt: number | null; // null = negative
  clinical: string;
}

const PATIENTS: Patient[] = [
  { id: "P-1042", name: "أحمد محمود", age: 34, gender: "ذكر", sample: "مسحة بلعومية", disease: "COVID-19", target: "RNA", expectedCt: 22, clinical: "حمى + سعال جاف + فقدان حاسة الشم" },
  { id: "P-1043", name: "سارة علي", age: 27, gender: "أنثى", sample: "مصل", disease: "HCV", target: "RNA", expectedCt: 28, clinical: "ارتفاع إنزيمات الكبد + إرهاق" },
  { id: "P-1044", name: "خالد حسن", age: 45, gender: "ذكر", sample: "دم كامل", disease: "HBV", target: "DNA", expectedCt: 26, clinical: "يرقان + HBsAg إيجابي" },
  { id: "P-1045", name: "منى فؤاد", age: 8, gender: "أنثى", sample: "دم كامل", disease: "Thalassemia (β-globin)", target: "DNA", expectedCt: 24, clinical: "أنيميا مزمنة + تاريخ عائلي" },
  { id: "P-1046", name: "يوسف ناصر", age: 52, gender: "ذكر", sample: "قشع", disease: "Mycobacterium tuberculosis", target: "DNA", expectedCt: 30, clinical: "سعال > 3 أسابيع + نقص وزن" },
  { id: "P-1047", name: "ليلى إبراهيم", age: 19, gender: "أنثى", sample: "مسحة بلعومية", disease: "Influenza A H1N1", target: "RNA", expectedCt: 25, clinical: "حمى مفاجئة + آلام عضلية" },
  { id: "P-1048", name: "عبدالله السيد", age: 61, gender: "ذكر", sample: "بلازما", disease: "CMV (متابعة زرع)", target: "DNA", expectedCt: 32, clinical: "بعد زرع كلى — متابعة" },
  { id: "P-1049", name: "نور محمد", age: 4, gender: "أنثى", sample: "دم كامل", disease: "Sickle Cell (HbS)", target: "DNA", expectedCt: 23, clinical: "نوبات ألم متكررة" },
  { id: "P-1050", name: "طارق العبيدي", age: 38, gender: "ذكر", sample: "مصل", disease: "HIV (Viral Load)", target: "RNA", expectedCt: 27, clinical: "متابعة العلاج ART" },
  { id: "P-1051", name: "هدى كامل", age: 29, gender: "أنثى", sample: "مصل", disease: "Dengue", target: "RNA", expectedCt: null, clinical: "حمى + طفح — عادت من السفر" },
];

/* ---------- PPE ---------- */
const PPE_ITEMS = [
  { id: "gloves", name: "قفازات لاتكس", icon: "🧤", correct: true },
  { id: "coat", name: "معطف مختبر", icon: "🥼", correct: true },
  { id: "mask", name: "قناع N95", icon: "😷", correct: true },
  { id: "goggles", name: "نظارات واقية", icon: "🥽", correct: true },
  { id: "disinfect", name: "تعقيم السطح بكحول 70%", icon: "🧴", correct: true },
  { id: "phone", name: "الهاتف المحمول", icon: "📱", correct: false },
  { id: "food", name: "قهوة / طعام", icon: "☕", correct: false },
];

/* ---------- Master Mix reagents ---------- */
interface Reagent { id: string; name: string; target: string; correctVol: number; }
const REAGENTS: Reagent[] = [
  { id: "mm", name: "Master Mix 2×", target: "الإنزيم + dNTPs + Buffer", correctVol: 10 },
  { id: "fwd", name: "Forward Primer (10 μM)", target: "بادئ أمامي نوعي", correctVol: 1 },
  { id: "rev", name: "Reverse Primer (10 μM)", target: "بادئ عكسي نوعي", correctVol: 1 },
  { id: "probe", name: "TaqMan Probe (FAM)", target: "مسبار فلوري", correctVol: 0.5 },
  { id: "water", name: "Nuclease-Free Water", target: "لضبط الحجم", correctVol: 5.5 },
  { id: "template", name: "Template (DNA/cDNA)", target: "العينة المستخلصة", correctVol: 2 },
];

/* ---------- Pathogen visuals per patient disease ---------- */
const DISEASE_PATHOGEN: Record<string, PathogenVisual> = {
  "COVID-19": {
    category: "virus", scientificName: "SARS-CoV-2", arabicName: "فيروس كورونا المستجد",
    emoji: "🦠", morphology: "فيروس RNA مغلف بشوكات بروتين S",
    microscopy: "منحنى تضخيف RT-PCR إيجابي — Ct ≈ 22", color: "fuchsia", scene: "virus-particles",
  },
  "HCV": {
    category: "virus", scientificName: "Hepatitis C Virus", arabicName: "فيروس الكبد C",
    emoji: "🧬", morphology: "فيروس RNA أحادي السلسلة",
    microscopy: "حمل فيروسي مرتفع — منحنى تضخيف واضح", color: "amber", scene: "pcr-curve",
  },
  "HBV": {
    category: "virus", scientificName: "Hepatitis B Virus", arabicName: "فيروس الكبد B",
    emoji: "🟠", morphology: "فيروس DNA جزئي مزدوج",
    microscopy: "HBV-DNA قابل للكشف عبر Real-Time PCR", color: "orange", scene: "virus-particles",
  },
  "Thalassemia (β-globin)": {
    category: "genetic", scientificName: "HBB gene mutation", arabicName: "طفرة جين β-globin",
    emoji: "🧬", morphology: "حذف/استبدال في جين HBB",
    microscopy: "قراءة تسلسل تظهر الطفرة النقطية", color: "purple", scene: "sequence",
  },
  "Mycobacterium tuberculosis": {
    category: "bacteria", scientificName: "Mycobacterium tuberculosis", arabicName: "عصية السل",
    emoji: "🔴", morphology: "عصيات حامضية طويلة",
    microscopy: "MTB-DNA مكتشف بواسطة GeneXpert", color: "red", scene: "acid-fast",
  },
  "Influenza A H1N1": {
    category: "virus", scientificName: "Influenza A H1N1", arabicName: "إنفلونزا A H1N1",
    emoji: "🦠", morphology: "فيروس RNA مجزّأ (8 قطع)",
    microscopy: "تضخيف مقطع M إيجابي", color: "cyan", scene: "virus-particles",
  },
  "CMV (متابعة زرع)": {
    category: "virus", scientificName: "Cytomegalovirus", arabicName: "الفيروس المضخم للخلايا",
    emoji: "👁", morphology: "فيروس DNA من عائلة الهيربس",
    microscopy: "قياس كمي — Log copies/mL", color: "violet", scene: "pcr-curve",
  },
  "Sickle Cell (HbS)": {
    category: "genetic", scientificName: "HBB Glu6Val", arabicName: "طفرة الأنيميا المنجلية",
    emoji: "🩸", morphology: "استبدال Glu → Val في جين HBB",
    microscopy: "تسلسل يؤكد طفرة HbS", color: "rose", scene: "sequence",
  },
  "HIV (Viral Load)": {
    category: "virus", scientificName: "HIV-1 RNA", arabicName: "فيروس نقص المناعة البشري",
    emoji: "🧬", morphology: "فيروس RNA رجعي",
    microscopy: "Viral Load بـ copies/mL", color: "teal", scene: "pcr-curve",
  },
  "Dengue": {
    category: "virus", scientificName: "Dengue Virus", arabicName: "فيروس حمى الضنك",
    emoji: "🦟", morphology: "Flavivirus RNA",
    microscopy: "قد يكون سلبياً في الأيام المتأخرة", color: "lime", scene: "virus-particles",
  },
};

/* ============================================================ */

type PCRResult = "إيجابي" | "سلبي" | "حدّي" | "غير صالح" | "ملوث";
interface AnalysisResult {
  threshold: number;
  baselineStart: number;
  baselineEnd: number;
  ct: number | null;
  result: PCRResult;
  warnings: string[];
  contaminated: boolean;
}




export function PCRLabPro({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [patient, setPatient] = useState<Patient>(PATIENTS[0]);
  const [errors, setErrors] = useState<string[]>([]);
  const [score, setScore] = useState(100);
  const [log, setLog] = useState<{ t: number; msg: string; ok: boolean }[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const addLog = (msg: string, ok = true) =>
    setLog((l) => [...l, { t: Date.now(), msg, ok }]);
  const penalize = (reason: string, pts = 10) => {
    setErrors((e) => [...e, reason]);
    setScore((s) => Math.max(0, s - pts));
    addLog(reason, false);
  };

  const reset = () => {
    setStage("intro");
    setErrors([]);
    setScore(100);
    setLog([]);
    setAnalysis(null);
  };

  return (
    <div dir="rtl" className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
            ← رجوع للأجهزة
          </button>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-primary">
              🎯 النقاط: {score}
            </span>
            <span className="rounded-full border border-destructive/50 bg-destructive/10 px-3 py-1 text-destructive">
              ⚠ الأخطاء: {errors.length}
            </span>
          </div>
        </div>

        <Header stage={stage} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <main className="rounded-3xl border border-border bg-card p-5 md:p-7">
            {stage === "intro" && (
              <IntroStage
                patient={patient}
                setPatient={setPatient}
                onStart={() => {
                  addLog(`تم استلام العينة ${patient.id}`);
                  setStage("biosafety");
                }}
              />
            )}
            {stage === "biosafety" && (
              <BiosafetyStage
                onDone={(mistakes) => {
                  mistakes.forEach((m) => penalize(m, 8));
                  addLog("مرحلة السلامة الحيوية مكتملة");
                  setStage("verify");
                }}
              />
            )}
            {stage === "verify" && (
              <VerifyStage
                patient={patient}
                onDone={(ok) => {
                  if (!ok) penalize("بيانات المريض غير مطابقة", 15);
                  else addLog("تم التحقق من بيانات المريض");
                  setStage("extract");
                }}
              />
            )}
            {stage === "extract" && (
              <ExtractStage
                target={patient.target}
                onError={(m) => penalize(m, 10)}
                onLog={(m) => addLog(m)}
                onDone={() => setStage("quant")}
              />
            )}
            {stage === "quant" && (
              <QuantStage
                onDone={(quality) => {
                  addLog(`NanoDrop — الجودة: ${quality}`);
                  if (quality === "منخفضة") penalize("نقاء غير كافٍ (A260/280 < 1.6)", 10);
                  setStage("mastermix");
                }}
              />
            )}
            {stage === "mastermix" && (
              <MasterMixStage
                onError={(m) => penalize(m, 8)}
                onLog={(m) => addLog(m)}
                onDone={() => setStage("program")}
              />
            )}
            {stage === "program" && (
              <ProgramStage
                onError={(m) => penalize(m, 10)}
                onLog={(m) => addLog(m)}
                onDone={() => setStage("run")}
              />
            )}
            {stage === "run" && (
              <RunStage
                onLog={(m) => addLog(m)}
                onDone={() => setStage("analyze")}
              />
            )}
            {stage === "analyze" && (
              <AnalyzeStage
                patient={patient}
                errorsCount={errors.length}
                onWarn={(m) => penalize(m, 5)}
                onDone={(a) => {
                  setAnalysis(a);
                  addLog(`تم حفظ النتائج — ${a.result}`);
                  setStage("report");
                }}
              />
            )}
            {stage === "report" && (
              <ReportStage
                patient={patient}
                errors={errors}
                score={score}
                log={log}
                analysis={analysis}
                onReset={reset}
              />
            )}
          </main>

          <aside className="space-y-4">
            <StageMap stage={stage} />
            <ProfessorPanel stage={stage} />
            <LiveLog log={log} />
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HEADER
============================================================ */
function Header({ stage }: { stage: Stage }) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-l from-primary/15 via-card to-accent/15 p-6">
      <div className="absolute -left-16 -top-16 size-56 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-16 -bottom-16 size-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs tracking-widest text-muted-foreground">
            🧬 PCR LAB SIMULATOR PRO
          </div>
          <h1 className="mt-1 text-3xl font-black md:text-4xl">
            <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
              محاكاة معمل البيولوجيا الجزيئية
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            محاكاة كاملة لسير عمل PCR وReal-Time PCR من استقبال العينة إلى إصدار التقرير الرسمي.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background/40 px-4 py-3 text-center">
          <div className="text-[10px] tracking-widest text-muted-foreground">المرحلة الحالية</div>
          <div className="mt-1 text-lg font-bold text-primary">{STAGE_LABEL[stage]}</div>
        </div>
      </div>
    </header>
  );
}

const STAGE_LABEL: Record<Stage, string> = {
  intro: "استقبال العينة",
  biosafety: "السلامة الحيوية",
  verify: "التحقق من العينة",
  extract: "الاستخلاص",
  quant: "قياس التركيز",
  mastermix: "تحضير Master Mix",
  program: "برمجة الجهاز",
  run: "تشغيل PCR",
  analyze: "تحليل Real-Time",
  report: "التقرير النهائي",
};

/* ============================================================
   STAGE MAP (sidebar)
============================================================ */
function StageMap({ stage }: { stage: Stage }) {
  const order: Stage[] = ["intro", "biosafety", "verify", "extract", "quant", "mastermix", "program", "run", "analyze", "report"];
  const currentIdx = order.indexOf(stage);
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 text-xs tracking-widest text-muted-foreground">🗺 مخطط المعمل</div>
      <ol className="space-y-2">
        {order.map((s, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li
              key={s}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : done
                  ? "border-success/40 bg-success/10 text-foreground/80"
                  : "border-border bg-background/30 text-muted-foreground"
              }`}
            >
              <span className="text-lg">{done ? "✓" : active ? "▶" : `${i + 1}`}</span>
              <span>{STAGE_LABEL[s]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ============================================================
   PROFESSOR PANEL (Arabic TTS)
============================================================ */
const PROFESSOR: Record<Stage, string> = {
  intro: "أهلاً بك أيها الزميل. اختر ملف المريض من قائمة الاستقبال ثم ابدأ بارتداء معدات الحماية.",
  biosafety: "ارتدِ القفازات والمعطف وقناع N95 والنظارات، وعقّم السطح بالكحول 70٪. لا تُدخل الهاتف أو الطعام إلى المنطقة.",
  verify: "قبل أي فحص، تأكد أن اسم المريض وعمره ونوع العينة مطابقة تماماً لطلب الفحص.",
  extract: "استخدم كولونة السيليكا: تحلل → غسيل × 2 → إلوشن. لا تخلط قمم أنابيب الغسيل والإلوشن أبداً.",
  quant: "ضع 1 ميكرولتر على NanoDrop. تأكد أن نسبة A260/280 بين 1.8 و2.0.",
  mastermix: "حضّر الخليط في غرفة PCR النظيفة، ثم أضف القالب في غرفة منفصلة لتفادي التلوث المتبادل.",
  program: "تأكد من درجات الحرارة: تمسّخ 95°م، تلدين 60°م، استطالة 72°م، و40 دورة لـ Real-Time.",
  run: "أغلق الغطاء بإحكام. راقب منحنى الحرارة والدورات ولا توقف التشغيل إلا للطوارئ.",
  analyze: "قيمة Ct أقل من 35 تعتبر إيجابية، بين 35–40 حدية، وأكبر من 40 أو غياب المنحنى = سلبية.",
  report: "راجع التقرير قبل توقيعه. تحقق من رقم المريض والتشخيص والتاريخ.",
};

function ProfessorPanel({ stage }: { stage: Stage }) {
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (muted) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(PROFESSOR[stage]);
      u.lang = "ar-SA";
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
    return () => {
      try { window.speechSynthesis.cancel(); } catch { /* noop */ }
    };
  }, [stage, muted]);

  return (
    <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-accent-foreground">
          <span className="text-xl">👨‍🏫</span> د. المشرف
        </div>
        <button
          onClick={() => setMuted((m) => !m)}
          className="rounded-full border border-border bg-background/40 px-2 py-1 text-xs"
        >
          {muted ? "🔇 صامت" : "🔊 صوت"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed">{PROFESSOR[stage]}</p>
    </div>
  );
}

function LiveLog({ log }: { log: { t: number; msg: string; ok: boolean }[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 text-xs tracking-widest text-muted-foreground">📋 سجل مباشر</div>
      <div className="max-h-64 overflow-auto text-xs">
        {log.length === 0 && <div className="text-muted-foreground">لا توجد أحداث بعد.</div>}
        <ul className="space-y-1">
          {log.slice().reverse().map((e, i) => (
            <li key={i} className={`rounded px-2 py-1 ${e.ok ? "bg-success/10" : "bg-destructive/15"}`}>
              <span className="text-muted-foreground">
                {new Date(e.t).toLocaleTimeString("ar-EG", { hour12: false })}
              </span>{" "}
              — {e.ok ? "✓" : "⚠"} {e.msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 1 — INTRO / PATIENT PICK
============================================================ */
function IntroStage({
  patient, setPatient, onStart,
}: { patient: Patient; setPatient: (p: Patient) => void; onStart: () => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold">🏥 وحدة استقبال العينات</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        اختر ملف المريض من الطابور. سيبقى ملفه معك خلال جميع مراحل الفحص.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {PATIENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPatient(p)}
            className={`rounded-2xl border p-4 text-right transition-all ${
              patient.id === p.id
                ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                : "border-border bg-background/40 hover:border-primary/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">{p.name}</span>
              <span className="text-xs text-muted-foreground">{p.id}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {p.gender} • {p.age} سنة • {p.sample}
            </div>
            <div className="mt-2 text-sm">
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs">
                {p.disease}
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">🩺 {p.clinical}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onStart}
        className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90"
      >
        ▶ ابدأ العمل على {patient.name}
      </button>
    </div>
  );
}

/* ============================================================
   STAGE 2 — BIOSAFETY (PPE)
============================================================ */
function BiosafetyStage({ onDone }: { onDone: (mistakes: string[]) => void }) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setPicked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const finish = () => {
    const mistakes: string[] = [];
    PPE_ITEMS.forEach((it) => {
      if (it.correct && !picked.has(it.id)) mistakes.push(`نسيت: ${it.name}`);
      if (!it.correct && picked.has(it.id)) mistakes.push(`عنصر ممنوع داخل المعمل: ${it.name}`);
    });
    onDone(mistakes);
  };
  return (
    <div>
      <h2 className="text-xl font-bold">🧯 غرفة تحضير السلامة الحيوية (BSL-2)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        اختر ما ترتديه وتُدخله إلى المنطقة. أخطاء السلامة تخصم نقاط وترفع خطر التلوث.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {PPE_ITEMS.map((it) => (
          <button
            key={it.id}
            onClick={() => toggle(it.id)}
            className={`flex flex-col items-center rounded-2xl border p-4 transition-all ${
              picked.has(it.id)
                ? "border-primary bg-primary/15"
                : "border-border bg-background/40"
            }`}
          >
            <span className="text-4xl">{it.icon}</span>
            <span className="mt-2 text-center text-xs">{it.name}</span>
          </button>
        ))}
      </div>
      <button
        onClick={finish}
        className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90"
      >
        ✓ دخول المعمل
      </button>
    </div>
  );
}

/* ============================================================
   STAGE 3 — VERIFY
============================================================ */
function VerifyStage({ patient, onDone }: { patient: Patient; onDone: (ok: boolean) => void }) {
  const [name, setName] = useState(patient.name);
  const [sample, setSample] = useState(patient.sample);
  return (
    <div>
      <h2 className="text-xl font-bold">📝 محطة التحقق من العينة</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        قارن الملصق على الأنبوب مع طلب الفحص. عدّل الحقول إن كانت مختلفة، أو اعتمدها كما هي.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="text-xs text-muted-foreground">📄 طلب الفحص</div>
          <div className="mt-2 space-y-1 text-sm">
            <div>الاسم: <b>{patient.name}</b></div>
            <div>العمر / النوع: {patient.age} / {patient.gender}</div>
            <div>العينة: <b>{patient.sample}</b></div>
            <div>الفحص المطلوب: <b>{patient.disease}</b> ({patient.target === "RNA" ? "RT-PCR" : "PCR"})</div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="text-xs text-muted-foreground">🏷 ملصق الأنبوب</div>
          <div className="mt-2 space-y-2 text-sm">
            <label className="block">
              <span className="text-xs">الاسم على الأنبوب</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1" />
            </label>
            <label className="block">
              <span className="text-xs">نوع العينة</span>
              <input value={sample} onChange={(e) => setSample(e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1" />
            </label>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDone(name.trim() === patient.name && sample.trim() === patient.sample)}
        className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground hover:opacity-90"
      >
        ✓ تأكيد المطابقة والمتابعة
      </button>
    </div>
  );
}

/* ============================================================
   STAGE 4 — EXTRACTION
============================================================ */
function ExtractStage({
  target, onDone, onError, onLog,
}: { target: "DNA" | "RNA"; onDone: () => void; onError: (m: string) => void; onLog: (m: string) => void }) {
  const steps = target === "RNA"
    ? ["إضافة Lysis Buffer + Proteinase K", "نقل إلى كولونة السيليكا وطرد مركزي", "غسيل بـ Wash Buffer 1", "غسيل بـ Wash Buffer 2 (كحول)", "تجفيف الكولونة", "الإلوشن بـ 50μL RNase-free water"]
    : ["إضافة Lysis Buffer + Proteinase K", "تحضين 56°م لمدة 10 دقائق", "نقل إلى كولونة السيليكا وطرد مركزي", "غسيل بـ Wash Buffer 1", "غسيل بـ Wash Buffer 2", "الإلوشن بـ 50μL Elution Buffer"];
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);

  const doStep = () => {
    setBusy(true);
    onLog(`تنفيذ: ${steps[i]}`);
    setTimeout(() => {
      setBusy(false);
      if (i + 1 >= steps.length) onDone();
      else setI(i + 1);
    }, 700);
  };

  const wrongStep = () => onError(`تجاوزت الخطوة "${steps[i]}"`);

  return (
    <div>
      <h2 className="text-xl font-bold">🧪 معمل استخلاص {target}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        نفّذ الخطوات بالترتيب باستخدام كولونة السيليكا. أي تخطٍّ يعرّض العينة للتلف.
      </p>

      <div className="mt-4 rounded-2xl border border-border bg-background/40 p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>الخطوة {i + 1} / {steps.length}</span>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">{target}-Extraction</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${((i + (busy ? 0.5 : 0)) / steps.length) * 100}%` }} />
        </div>
        <div className="mt-4 text-lg font-bold">{steps[i]}</div>

        {/* silica column visual */}
        <div className="mt-4 flex justify-center">
          <div className="relative flex h-32 w-16 flex-col items-center rounded-b-2xl border-2 border-border bg-gradient-to-b from-primary/20 to-primary/60">
            <div className="absolute -top-2 h-4 w-16 rounded-full border-2 border-border bg-card" />
            <div
              className="absolute bottom-0 w-full rounded-b-2xl bg-primary/80 transition-all"
              style={{ height: `${20 + i * 12}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={doStep}
            disabled={busy}
            className="flex-1 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "جارٍ التنفيذ…" : "✓ نفّذ الخطوة"}
          </button>
          <button
            onClick={wrongStep}
            className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-2 text-xs text-destructive"
          >
            ⚠ سجّل خطأ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 5 — QUANTIFICATION (NanoDrop)
============================================================ */
function QuantStage({ onDone }: { onDone: (quality: "عالية" | "مقبولة" | "منخفضة") => void }) {
  const [reading, setReading] = useState<null | { conc: number; ratio: number }>(null);
  const measure = () => {
    const conc = 60 + Math.round(Math.random() * 120);
    const ratio = +(1.6 + Math.random() * 0.5).toFixed(2);
    setReading({ conc, ratio });
  };
  const quality = reading
    ? reading.ratio >= 1.8 ? "عالية" : reading.ratio >= 1.7 ? "مقبولة" : "منخفضة"
    : null;
  return (
    <div>
      <h2 className="text-xl font-bold">📊 قياس التركيز — NanoDrop</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        ضع 1 ميكرولتر على الحامل ثم اقرأ التركيز ونسبة النقاء A260/280.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background/40 p-6">
          {/* NanoDrop mock */}
          <div className="mx-auto flex h-40 w-full max-w-xs items-end justify-center rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 p-3">
            <div className="w-full rounded-md bg-black p-3 font-mono text-xs text-green-400 shadow-inner">
              {reading ? (
                <>
                  <div>ng/μL ............ {reading.conc}</div>
                  <div>A260/280 ......... {reading.ratio}</div>
                  <div>الجودة .......... {quality}</div>
                </>
              ) : (
                <div className="opacity-60">— جاهز للقياس —</div>
              )}
            </div>
          </div>
          <button onClick={measure} className="mt-4 w-full rounded-xl bg-accent px-4 py-2 font-bold text-accent-foreground">
            📏 قياس
          </button>
        </div>
        <div className="rounded-2xl border border-border bg-background/40 p-5 text-sm">
          <div className="font-bold">📖 مرجع التفسير</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• A260/280 ≥ 1.8 → نقاء ممتاز</li>
            <li>• 1.7 – 1.8 → مقبول</li>
            <li>• &lt; 1.7 → تلوث ببروتين، أعد الاستخلاص</li>
            <li>• التركيز الأمثل لـ PCR: 20–200 ng/μL</li>
          </ul>
        </div>
      </div>
      <button
        disabled={!reading}
        onClick={() => quality && onDone(quality)}
        className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-50"
      >
        ✓ اعتماد القراءة والمتابعة
      </button>
    </div>
  );
}

/* ============================================================
   STAGE 6 — MASTER MIX
============================================================ */
function MasterMixStage({
  onDone, onError, onLog,
}: { onDone: () => void; onError: (m: string) => void; onLog: (m: string) => void }) {
  const [vols, setVols] = useState<Record<string, number>>(
    Object.fromEntries(REAGENTS.map((r) => [r.id, 0]))
  );
  const total = Object.values(vols).reduce((a, b) => a + b, 0);

  const finish = () => {
    let mistakes = 0;
    REAGENTS.forEach((r) => {
      const diff = Math.abs((vols[r.id] || 0) - r.correctVol);
      if (diff > 0.5) {
        onError(`حجم خاطئ في ${r.name}: أضفت ${vols[r.id]}μL بدلاً من ${r.correctVol}μL`);
        mistakes++;
      }
    });
    if (mistakes === 0) onLog("Master Mix نهائي 20μL — مطابق للبروتوكول");
    onDone();
  };

  return (
    <div>
      <h2 className="text-xl font-bold">🧴 تحضير Master Mix — الحجم النهائي 20 μL</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        اختر الحجم الصحيح لكل مكوّن. تحضّر الخليط على ثلج داخل الكابينة النظيفة.
      </p>
      <div className="mt-4 space-y-3">
        {REAGENTS.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-background/40 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-bold">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.target}</div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <button
                  onClick={() => setVols((v) => ({ ...v, [r.id]: Math.max(0, +(v[r.id] - 0.5).toFixed(1)) }))}
                  className="size-8 rounded-lg border border-border bg-card"
                >−</button>
                <span className="w-16 rounded-lg border border-border bg-card px-2 py-1 text-center font-mono">
                  {vols[r.id].toFixed(1)} μL
                </span>
                <button
                  onClick={() => setVols((v) => ({ ...v, [r.id]: +(v[r.id] + 0.5).toFixed(1) }))}
                  className="size-8 rounded-lg border border-border bg-card"
                >+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 p-3 text-sm">
        <span>الحجم الكلي المحضّر</span>
        <span className={`font-mono font-bold ${Math.abs(total - 20) < 0.6 ? "text-primary" : "text-destructive"}`}>
          {total.toFixed(1)} / 20 μL
        </span>
      </div>
      <button onClick={finish} className="mt-4 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">
        ✓ إغلاق الأنبوب ونقله إلى الجهاز
      </button>
    </div>
  );
}

/* ============================================================
   STAGE 7 — PROGRAM THE THERMAL CYCLER
============================================================ */
function ProgramStage({
  onDone, onError, onLog,
}: { onDone: () => void; onError: (m: string) => void; onLog: (m: string) => void }) {
  const [denatT, setDenatT] = useState(95);
  const [annealT, setAnnealT] = useState(60);
  const [extendT, setExtendT] = useState(72);
  const [cycles, setCycles] = useState(40);
  const submit = () => {
    if (Math.abs(denatT - 95) > 2) onError(`درجة التمسّخ خاطئة: ${denatT}°م`);
    if (annealT < 55 || annealT > 65) onError(`درجة التلدين خارج النطاق: ${annealT}°م`);
    if (Math.abs(extendT - 72) > 2) onError(`درجة الاستطالة خاطئة: ${extendT}°م`);
    if (cycles < 35 || cycles > 45) onError(`عدد الدورات غير مناسب: ${cycles}`);
    onLog(`تم إعداد البرنامج ${denatT}/${annealT}/${extendT} × ${cycles}`);
    onDone();
  };
  return (
    <div>
      <h2 className="text-xl font-bold">⚙️ برمجة Thermal Cycler</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        اضبط درجات الحرارة الثلاث وعدد الدورات المناسبة لـ TaqMan Real-Time PCR.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <NumberField label="Denaturation (°م) — 15 ثانية" value={denatT} setValue={setDenatT} min={90} max={100} />
        <NumberField label="Annealing (°م) — 30 ثانية" value={annealT} setValue={setAnnealT} min={45} max={75} />
        <NumberField label="Extension (°م) — 30 ثانية" value={extendT} setValue={setExtendT} min={65} max={80} />
        <NumberField label="عدد الدورات" value={cycles} setValue={setCycles} min={20} max={50} />
      </div>
      {/* Cycle preview */}
      <div className="mt-5 rounded-2xl border border-border bg-background/40 p-4">
        <div className="mb-2 text-xs text-muted-foreground">معاينة الدورة الواحدة</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-destructive/20 py-3">🔥 {denatT}°م<br/>15s</div>
          <div className="rounded-lg bg-accent/20 py-3">❄ {annealT}°م<br/>30s</div>
          <div className="rounded-lg bg-primary/20 py-3">⚙ {extendT}°م<br/>30s</div>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">× {cycles} دورة</div>
      </div>
      <button onClick={submit} className="mt-5 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">
        ✓ حفظ البرنامج
      </button>
    </div>
  );
}
function NumberField({ label, value, setValue, min, max }: { label: string; value: number; setValue: (n: number) => void; min: number; max: number }) {
  return (
    <label className="block rounded-xl border border-border bg-background/40 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <button onClick={() => setValue(Math.max(min, value - 1))} className="size-8 rounded-lg border border-border bg-card">−</button>
        <input
          type="number" value={value} min={min} max={max}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-24 rounded-lg border border-border bg-card px-2 py-1 text-center font-mono"
        />
        <button onClick={() => setValue(Math.min(max, value + 1))} className="size-8 rounded-lg border border-border bg-card">+</button>
      </div>
    </label>
  );
}

/* ============================================================
   STAGE 8 — RUN
============================================================ */
function RunStage({ onDone, onLog }: { onDone: () => void; onLog: (m: string) => void }) {
  const [lidOpen, setLidOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"—" | "Denat" | "Anneal" | "Extend">("—");
  const [temp, setTemp] = useState(25);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalCycles = 40;

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const start = () => {
    if (lidOpen) { onLog("محاولة تشغيل والغطاء مفتوح — رفض الجهاز"); return; }
    if (!loaded) { onLog("محاولة تشغيل بدون تحميل الأنابيب"); return; }
    setRunning(true);
    onLog("بدء تشغيل PCR");
    let c = 0;
    const phases: Array<{ p: "Denat"|"Anneal"|"Extend"; t: number }> = [
      { p: "Denat", t: 95 }, { p: "Anneal", t: 60 }, { p: "Extend", t: 72 },
    ];
    let step = 0;
    timerRef.current = setInterval(() => {
      const cur = phases[step % 3];
      setPhase(cur.p); setTemp(cur.t);
      step++;
      if (step % 3 === 0) {
        c++; setCycle(c);
        if (c >= totalCycles) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          setPhase("—");
          onLog("اكتمل تشغيل PCR بنجاح");
          setTimeout(onDone, 500);
        }
      }
    }, 250);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    onLog("تم إيقاف الجهاز يدوياً");
  };

  return (
    <div>
      <h2 className="text-xl font-bold">▶ غرفة Real-Time PCR</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        افتح الغطاء، حمّل الأنابيب، أغلق الغطاء ثم شغّل الجهاز. تابع الدورات والحرارة.
      </p>

      {/* 3D-ish machine */}
      <div className="mt-5 rounded-3xl border-2 border-border bg-gradient-to-b from-slate-800 to-slate-900 p-5 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="rounded-lg bg-black px-3 py-2 font-mono text-xs text-green-400">
            CYCLE {cycle.toString().padStart(2, "0")}/{totalCycles} • {phase} • {temp}°C
          </div>
          <div className="flex gap-1">
            <span className={`size-3 rounded-full ${running ? "animate-pulse bg-red-500" : "bg-red-900"}`} />
            <span className={`size-3 rounded-full ${loaded ? "bg-green-500" : "bg-green-900"}`} />
            <span className={`size-3 rounded-full ${!lidOpen ? "bg-blue-500" : "bg-blue-900"}`} />
          </div>
        </div>
        <div className="relative mt-4 h-40 rounded-2xl bg-slate-950">
          {/* lid */}
          <div
            className={`absolute inset-x-3 top-3 h-14 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 shadow-md transition-transform duration-500 ${
              lidOpen ? "-translate-y-8 rotate-x-45" : ""
            }`}
            style={{ transformOrigin: "top center" }}
          />
          {/* tube block */}
          <div className="absolute inset-x-6 bottom-3 grid grid-cols-8 gap-1 rounded-xl bg-slate-800 p-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={`h-5 rounded-b-full border border-slate-600 ${
                  loaded ? "bg-yellow-300/80" : "bg-transparent"
                }`}
                style={{ boxShadow: running ? `inset 0 -4px 6px rgba(255,180,0,${0.3 + (cycle / totalCycles) * 0.6})` : undefined }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => setLidOpen((v) => !v)} disabled={running} className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs">
            {lidOpen ? "🔓 إغلاق الغطاء" : "🔒 فتح الغطاء"}
          </button>
          <button onClick={() => setLoaded(true)} disabled={!lidOpen || loaded} className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs">
            🧪 تحميل الأنابيب
          </button>
          <button onClick={start} disabled={running} className="ml-auto rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-50">
            ▶ Start
          </button>
          <button onClick={stop} disabled={!running} className="rounded-lg bg-destructive px-4 py-2 text-xs font-bold text-destructive-foreground disabled:opacity-50">
            ■ Stop
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 9 — REAL-TIME ANALYZE (curves)
============================================================ */
function AnalyzeStage({ patient, onDone }: { patient: Patient; onDone: () => void }) {
  const ct = patient.expectedCt;
  const points = useMemo(() => {
    // sigmoid amplification if positive
    if (ct === null) return Array.from({ length: 40 }, (_, i) => ({ x: i + 1, y: 0.02 + Math.random() * 0.01 }));
    return Array.from({ length: 40 }, (_, i) => {
      const cycle = i + 1;
      const y = 1 / (1 + Math.exp(-(cycle - ct) * 0.7));
      return { x: cycle, y: y + Math.random() * 0.01 };
    });
  }, [ct]);

  const width = 520, height = 220, pad = 30;
  const path = points.map((p, i) => {
    const px = pad + (p.x / 40) * (width - pad * 2);
    const py = height - pad - p.y * (height - pad * 2);
    return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join(" ");
  const thresholdY = height - pad - 0.15 * (height - pad * 2);
  const result = ct === null || ct > 40 ? "سلبي" : ct > 35 ? "حدّي" : "إيجابي";

  return (
    <div>
      <h2 className="text-xl font-bold">📈 تحليل منحنيات Real-Time</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        يمثّل المنحنى إشارة الفلورة (FAM) عبر الدورات. الخط الأحمر = threshold. Ct = نقطة التقاطع.
      </p>
      <div className="mt-4 rounded-2xl border border-border bg-slate-950 p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          {/* grid */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={pad} x2={width - pad}
              y1={pad + i * ((height - pad * 2) / 4)} y2={pad + i * ((height - pad * 2) / 4)}
              stroke="#1f2937" strokeDasharray="2 3" />
          ))}
          {/* axes */}
          <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#334155" />
          <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#334155" />
          {/* threshold */}
          <line x1={pad} x2={width - pad} y1={thresholdY} y2={thresholdY} stroke="#ef4444" strokeDasharray="4 4" />
          {/* curve */}
          <path d={path} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
          {ct !== null && (
            <>
              <line
                x1={pad + (ct / 40) * (width - pad * 2)} x2={pad + (ct / 40) * (width - pad * 2)}
                y1={pad} y2={height - pad}
                stroke="#a78bfa" strokeDasharray="3 3"
              />
              <text x={pad + (ct / 40) * (width - pad * 2) + 4} y={pad + 12} fill="#a78bfa" fontSize="12">
                Ct = {ct}
              </text>
            </>
          )}
          <text x={width - pad} y={height - 8} textAnchor="end" fill="#64748b" fontSize="10">Cycles →</text>
          <text x={pad + 4} y={pad + 12} fill="#64748b" fontSize="10">ΔRn</text>
        </svg>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Stat label="Ct" value={ct === null ? "—" : String(ct)} />
        <Stat label="Threshold" value="0.15" />
        <Stat label="النتيجة" value={result} highlight={result === "إيجابي" ? "positive" : result === "سلبي" ? "negative" : "warn"} />
      </div>
      <button onClick={onDone} className="mt-5 w-full rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">
        ✓ إصدار التقرير
      </button>
    </div>
  );
}
function Stat({ label, value, highlight }: { label: string; value: string; highlight?: "positive"|"negative"|"warn" }) {
  const color = highlight === "positive" ? "text-destructive"
    : highlight === "negative" ? "text-primary"
    : highlight === "warn" ? "text-toxic" : "";
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-black ${color}`}>{value}</div>
    </div>
  );
}

/* ============================================================
   STAGE 10 — REPORT
============================================================ */
function ReportStage({
  patient, errors, score, log, onReset,
}: {
  patient: Patient; errors: string[]; score: number;
  log: { t: number; msg: string; ok: boolean }[]; onReset: () => void;
}) {
  const ct = patient.expectedCt;
  const result = ct === null || ct > 40 ? "سلبي" : ct > 35 ? "حدّي" : "إيجابي";
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D";
  const rpt = `RPT-${Date.now().toString().slice(-6)}`;
  return (
    <div className="print:bg-white print:text-black">
      <h2 className="text-xl font-bold">📄 التقرير المخبري الرسمي</h2>
      <div id="pcr-report" className="mt-4 rounded-2xl border-2 border-primary/40 bg-background/60 p-6 text-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <div className="text-xs text-muted-foreground">Molecular Diagnostics Lab</div>
            <div className="text-lg font-bold">تقرير فحص {patient.target === "RNA" ? "RT-PCR" : "PCR"}</div>
          </div>
          <div className="text-left text-xs">
            <div>Report: <b>{rpt}</b></div>
            <div>Patient: <b>{patient.id}</b></div>
            <div>Date: {new Date().toLocaleString("ar-EG")}</div>
          </div>
        </div>

        <section className="mt-4 grid gap-3 md:grid-cols-2">
          <Field k="اسم المريض" v={patient.name} />
          <Field k="العمر / النوع" v={`${patient.age} / ${patient.gender}`} />
          <Field k="نوع العينة" v={patient.sample} />
          <Field k="الفحص المطلوب" v={patient.disease} />
          <Field k="Ct Value" v={ct === null ? "—" : String(ct)} />
          <Field k="Threshold" v="0.15" />
        </section>

        <div className={`mt-5 rounded-xl border-2 p-4 text-center text-xl font-black ${
          result === "إيجابي" ? "border-destructive bg-destructive/10 text-destructive"
          : result === "سلبي" ? "border-primary bg-primary/10 text-primary"
          : "border-toxic bg-toxic/10 text-toxic"
        }`}>
          النتيجة النهائية: {result}
        </div>

        <section className="mt-5">
          <div className="text-xs font-bold text-muted-foreground">⚠ الأخطاء المخبرية المسجّلة</div>
          {errors.length === 0 ? (
            <div className="mt-2 rounded-lg bg-success/10 p-2 text-success">لا أخطاء — بروتوكول مثالي.</div>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pr-5 text-destructive">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </section>

        <section className="mt-5">
          <div className="text-xs font-bold text-muted-foreground">📋 سجل تنفيذ الحالة</div>
          <ol className="mt-2 space-y-1 text-xs">
            {log.map((e, i) => (
              <li key={i} className={e.ok ? "" : "text-destructive"}>
                {new Date(e.t).toLocaleTimeString("ar-EG", { hour12: false })} — {e.ok ? "✓" : "⚠"} {e.msg}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-3">
          <Stat label="النقاط" value={String(score)} />
          <Stat label="التقدير" value={grade} />
          <Stat label="عدد الأخطاء" value={String(errors.length)} />
        </section>

        <div className="mt-6 flex items-end justify-between border-t border-border pt-4 text-xs">
          <div>
            <div className="text-muted-foreground">توقيع الأخصائي</div>
            <div className="mt-6 border-t border-border pt-1">✍</div>
          </div>
          <div className="text-left">
            <div className="text-muted-foreground">ختم المختبر</div>
            <div className="mt-2 inline-block rounded-full border-2 border-primary px-3 py-1 text-primary">SEALED</div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <button onClick={() => window.print()} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          🖨 طباعة / PDF
        </button>
        <button onClick={onReset} className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
          🔁 حالة جديدة
        </button>
      </div>
    </div>
  );
}
function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-0.5 font-bold">{v}</div>
    </div>
  );
}
