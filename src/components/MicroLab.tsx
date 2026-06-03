import { useMemo, useState } from "react";
import { BRANCHES, CASES, type Branch, type Case, type Test } from "@/lib/cases";
import { EQUIPMENT, type Equipment } from "@/lib/equipment";

type Stage = "menu" | "case" | "result" | "learn";

export function MicroLab() {
  const [stage, setStage] = useState<Stage>("menu");
  const [branch, setBranch] = useState<Branch | "all">("all");
  const [learnBranch, setLearnBranch] = useState<Branch | "general">("general");
  const [caseIdx, setCaseIdx] = useState(0);
  const [runTests, setRunTests] = useState<Record<string, boolean>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);

  const deck = useMemo(
    () => (branch === "all" ? CASES : CASES.filter((c) => c.branch === branch)),
    [branch]
  );
  const current: Case | undefined = deck[caseIdx];

  function startBranch(b: Branch | "all") {
    setBranch(b);
    setCaseIdx(0);
    setRunTests({});
    setPicked(null);
    setStage("case");
  }

  function openLearn(b: Branch | "general") {
    setLearnBranch(b);
    setStage("learn");
  }

  function toggleTest(t: Test) {
    setRunTests((r) => ({ ...r, [t.id]: true }));
  }

  function submit(opt: string) {
    if (picked || !current) return;
    setPicked(opt);
    const correct = opt === current.answer;
    const runCount = Object.keys(runTests).length;
    const base = correct ? 100 : 0;
    const efficiency = correct ? Math.max(0, 40 - runCount * 10) : 0;
    const streakBonus = correct ? streak * 15 : 0;
    setScore((s) => s + base + efficiency + streakBonus);
    setStreak((s) => (correct ? s + 1 : 0));
    if (correct && current) setSolved((arr) => Array.from(new Set([...arr, current.id])));
    setStage("result");
  }

  function next() {
    setRunTests({});
    setPicked(null);
    if (caseIdx + 1 < deck.length) {
      setCaseIdx(caseIdx + 1);
      setStage("case");
    } else {
      setStage("menu");
    }
  }

  if (stage === "menu") {
    return (
      <Menu
        onStart={startBranch}
        onLearn={openLearn}
        score={score}
        solvedCount={solved.length}
        total={CASES.length}
      />
    );
  }

  if (stage === "learn") {
    return <LearnView branch={learnBranch} onBack={() => setStage("menu")} onChange={setLearnBranch} />;
  }

  if (!current) return null;

  if (stage === "case") {
    return (
      <CaseView
        c={current}
        runTests={runTests}
        onRun={toggleTest}
        onPick={submit}
        score={score}
        streak={streak}
        progress={`${caseIdx + 1} / ${deck.length}`}
        onExit={() => setStage("menu")}
      />
    );
  }

  return (
    <Result
      c={current}
      picked={picked!}
      onNext={next}
      onExit={() => setStage("menu")}
      isLast={caseIdx + 1 >= deck.length}
    />
  );
}

/* ---------------- Menu ---------------- */

function FloatingMicrobes() {
  const items = ["🦠", "🧬", "🍄", "🪱", "🛡️", "🧫", "🔬", "💊"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
      {items.map((m, i) => (
        <span
          key={i}
          className="microbe absolute text-3xl"
          style={{
            top: `${(i * 37) % 90}%`,
            left: `${(i * 53) % 90}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${6 + (i % 4) * 2}s`,
          }}
        >
          {m}
        </span>
      ))}
    </div>
  );
}

function Menu({
  onStart, onLearn, score, solvedCount, total,
}: {
  onStart: (b: Branch | "all") => void;
  onLearn: (b: Branch | "general") => void;
  score: number;
  solvedCount: number;
  total: number;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-12">
      <FloatingMicrobes />
      <div className="relative mx-auto max-w-5xl">
        <header className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1 text-xs tracking-widest text-muted-foreground backdrop-blur">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            مختبر المحاكاة الميكروبيولوجي
          </div>
          <h1 className="bg-gradient-to-l from-primary via-toxic to-accent bg-clip-text text-5xl font-black leading-tight text-transparent md:text-7xl">
            MicroLab
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            شخّص الحالات السريرية كأخصائي ميكروبيولوجي حقيقي — اختر الفحوص بحكمة،
            فكل فحص إضافي يخصم من نقاطك.
          </p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
            <Stat label="النقاط" value={score} />
            <Stat label="حالات محلولة" value={`${solvedCount}/${total}`} />
            <Stat label="فروع" value={5} />
          </div>
        </header>

        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground">
            اختر التخصص
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <BranchCard
              icon="🧪"
              name="كل الفروع"
              desc="تحدٍّ شامل عبر جميع التخصصات"
              hue={180}
              onClick={() => onStart("all")}
              featured
            />
            {(Object.keys(BRANCHES) as Branch[]).map((b) => (
              <BranchCard
                key={b}
                icon={BRANCHES[b].icon}
                name={BRANCHES[b].name}
                desc={BRANCHES[b].desc}
                hue={BRANCHES[b].hue}
                onClick={() => onStart(b)}
                onLearn={() => onLearn(b)}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-4 text-sm font-semibold tracking-widest text-muted-foreground">
            🧰 مكتبة الأجهزة والمعدات — تعلّم تفاعلي
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LearnTile icon="🧰" name="الأجهزة العامة للمختبر" hue={200} onClick={() => onLearn("general")} />
            {(Object.keys(BRANCHES) as Branch[]).map((b) => (
              <LearnTile
                key={b}
                icon={BRANCHES[b].icon}
                name={`معدات ${BRANCHES[b].name}`}
                hue={BRANCHES[b].hue}
                onClick={() => onLearn(b)}
              />
            ))}
          </div>
        </section>

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          صُمم للتعليم الطبي — ليس بديلاً عن الاستشارة السريرية
        </footer>
      </div>
    </div>
  );
}

function LearnTile({ icon, name, hue, onClick }: { icon: string; name: string; hue: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 text-right transition-all hover:-translate-y-0.5 hover:border-primary/60"
    >
      <div
        className="grid size-12 place-items-center rounded-lg text-2xl"
        style={{ background: `oklch(0.30 0.08 ${hue} / 0.6)` }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-muted-foreground">تعلّم الأدوات وطريقة الاستخدام</div>
      </div>
      <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">📖</span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-3 backdrop-blur">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold text-primary">{value}</div>
    </div>
  );
}

function BranchCard({
  icon, name, desc, hue, onClick, onLearn, featured,
}: {
  icon: string; name: string; desc: string; hue: number; onClick: () => void; onLearn?: () => void; featured?: boolean;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 text-right transition-all hover:-translate-y-1 hover:border-primary/60"
      style={{ boxShadow: featured ? "var(--shadow-glow)" : undefined }}
    >
      <div
        className="absolute -left-10 -top-10 size-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
        style={{ background: `oklch(0.75 0.2 ${hue})` }}
      />
      <div className="relative">
        <div className="text-5xl">{icon}</div>
        <h3 className="mt-4 text-xl font-bold">{name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onClick}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            ابدأ التشخيص ←
          </button>
          {onLearn && (
            <button
              onClick={onLearn}
              className="rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              📖 تعلّم الأدوات
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Case ---------------- */

function CaseView({
  c, runTests, onRun, onPick, score, streak, progress, onExit,
}: {
  c: Case;
  runTests: Record<string, boolean>;
  onRun: (t: Test) => void;
  onPick: (opt: string) => void;
  score: number; streak: number; progress: string;
  onExit: () => void;
}) {
  const branchInfo = BRANCHES[c.branch];
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={onExit} className="text-sm text-muted-foreground hover:text-foreground">
            ← القائمة
          </button>
          <div className="flex items-center gap-3 text-sm">
            <Pill label="التخصص" value={`${branchInfo.icon} ${branchInfo.name}`} />
            <Pill label="الحالة" value={progress} />
            <Pill label="السلسلة" value={`🔥 ${streak}`} />
            <Pill label="النقاط" value={String(score)} highlight />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Patient card */}
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-4xl">
                {c.emoji}
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">المريض</div>
                <h2 className="text-2xl font-bold">{c.patient}</h2>
                <p className="mt-2 text-muted-foreground">{c.history}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold tracking-widest text-muted-foreground">الأعراض</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.symptoms.map((s) => (
                  <span key={s} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-xs font-semibold tracking-widest text-muted-foreground">العينة المرسلة للمختبر</div>
              <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-primary">
                🧫 {c.specimen}
              </div>
            </div>

            {/* Diagnosis options */}
            <div className="mt-6">
              <div className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground">
                ما هو التشخيص؟
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {c.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onPick(opt)}
                    className="rounded-xl border border-border bg-secondary/40 p-3 text-right text-sm font-medium transition-all hover:border-primary hover:bg-primary/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Lab panel */}
          <section className="space-y-4">
            <div className="petri-dish relative overflow-hidden rounded-3xl p-6">
              <div className="absolute inset-0 spin-slow opacity-60"
                style={{ background: "var(--gradient-toxic)" }} />
              <div className="relative">
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">
                  طبق بتري
                </div>
                <h3 className="mt-1 text-xl font-bold">المختبر التشخيصي</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  اطلب الفحوص. كل فحص يخصم 10 نقاط من المكافأة، فاختر بعناية.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {c.tests.map((t) => {
                const done = runTests[t.id];
                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      done ? "border-primary/60 bg-primary/5 glow" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        {!done && <div className="text-xs text-muted-foreground">-10 نقاط</div>}
                      </div>
                      {!done ? (
                        <button
                          onClick={() => onRun(t)}
                          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
                        >
                          إجراء
                        </button>
                      ) : (
                        <span className="text-xs text-primary">✓ مكتمل</span>
                      )}
                    </div>
                    {done && (
                      <div className="mt-3 rounded-lg border border-border bg-background/60 p-3 font-mono text-sm leading-relaxed text-foreground/90">
                        ▸ {t.result}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-full border px-3 py-1 text-xs ${highlight ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
      <span className="opacity-70">{label}: </span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

/* ---------------- Result ---------------- */

function Result({
  c, picked, onNext, onExit, isLast,
}: {
  c: Case; picked: string; onNext: () => void; onExit: () => void; isLast: boolean;
}) {
  const correct = picked === c.answer;
  return (
    <div className="grid min-h-screen place-items-center px-6 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <div className={`mx-auto grid size-24 place-items-center rounded-full text-5xl ${correct ? "bg-primary/15 text-primary glow" : "bg-destructive/15 text-destructive"}`}>
            {correct ? "✓" : "✕"}
          </div>
          <h2 className="mt-4 text-3xl font-black">
            {correct ? "تشخيص صحيح!" : "تشخيص خاطئ"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            إجابتك: <span className="font-semibold text-foreground">{picked}</span>
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <InfoRow label="التشخيص الصحيح" value={c.answer} accent />
          <InfoRow label="الشرح" value={c.explanation} />
          <InfoRow label="العلاج" value={c.treatment} />
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={onExit}
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 font-semibold transition-colors hover:bg-secondary/70"
          >
            القائمة الرئيسية
          </button>
          <button
            onClick={onNext}
            className="flex-1 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            {isLast ? "إنهاء" : "الحالة التالية ←"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="text-xs font-semibold tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 ${accent ? "text-lg font-bold text-primary" : "text-foreground/90"}`}>
        {value}
      </div>
    </div>
  );
}

/* ---------------- Learn ---------------- */

function LearnView({
  branch, onBack, onChange,
}: {
  branch: Branch | "general";
  onBack: () => void;
  onChange: (b: Branch | "general") => void;
}) {
  const list = EQUIPMENT[branch];
  const title =
    branch === "general" ? "🧰 الأجهزة العامة للمختبر" : `${BRANCHES[branch].icon} معدات ${BRANCHES[branch].name}`;
  const [openId, setOpenId] = useState<string | null>(null);

  const tabs: Array<{ key: Branch | "general"; label: string; icon: string }> = [
    { key: "general", label: "عام", icon: "🧰" },
    ...(Object.keys(BRANCHES) as Branch[]).map((b) => ({
      key: b,
      label: BRANCHES[b].name,
      icon: BRANCHES[b].icon,
    })),
  ];

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
            ← القائمة
          </button>
          <div className="text-sm text-muted-foreground">وضع التعلّم</div>
        </div>

        <header className="rounded-3xl border border-border bg-card p-6">
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="mt-2 text-muted-foreground">
            تعرّف على الأدوات والأجهزة المستخدمة، وكيفية الاستخدام، ونصائح عملية للمختبر.
          </p>
        </header>

        <div className="my-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { onChange(t.key); setOpenId(null); }}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                branch === t.key
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="ml-2">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {list.map((eq) => (
            <EquipmentCard
              key={eq.name}
              eq={eq}
              open={openId === eq.name}
              onToggle={() => setOpenId(openId === eq.name ? null : eq.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function EquipmentCard({ eq, open, onToggle }: { eq: Equipment; open: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border bg-card transition-all ${open ? "border-primary/60 glow" : "border-border"}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-5 text-right">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-secondary/60 text-3xl">
          {eq.icon}
        </div>
        <div className="flex-1">
          <div className="font-bold">{eq.name}</div>
          <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{eq.use}</div>
        </div>
        <span className={`text-primary transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border p-5 pt-4">
          <LearnRow icon="🎯" label="الاستخدام" text={eq.use} />
          <LearnRow icon="⚙️" label="طريقة العمل" text={eq.howTo} />
          <LearnRow icon="💡" label="نصيحة عملية" text={eq.tips} />
        </div>
      )}
    </div>
  );
}

function LearnRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground">
        <span>{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm leading-relaxed text-foreground/90">{text}</div>
    </div>
  );
}
