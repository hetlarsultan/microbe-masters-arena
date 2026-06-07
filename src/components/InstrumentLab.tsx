import { useEffect, useMemo, useState } from "react";
import { INSTRUMENTS, INSTRUMENT_BRANCHES, type Instrument } from "@/lib/instruments";
import { Lab3D } from "@/components/Lab3D";


type View = "list" | "run";

export function InstrumentLab({ onBack }: { onBack: () => void }) {
  const [view, setView] = useState<View>("list");
  const [filter, setFilter] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const list = useMemo(
    () => (filter === "all" ? INSTRUMENTS : INSTRUMENTS.filter((i) => i.branch === filter)),
    [filter]
  );
  const active = INSTRUMENTS.find((i) => i.id === activeId) ?? null;

  if (view === "run" && active) {
    return (
      <InstrumentRunner
        instrument={active}
        onBack={() => {
          setView("list");
          setActiveId(null);
        }}
      />
    );
  }

  const branches = ["all", ...Object.keys(INSTRUMENT_BRANCHES)];

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
            ← القائمة
          </button>
          <div className="text-sm text-muted-foreground">محاكاة الأجهزة</div>
        </div>

        <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-8">
          <div className="absolute -left-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 text-xs tracking-widest text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-toxic" />
              SIMULATION MODE
            </div>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">
              <span className="bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">
                محاكاة الأجهزة المخبرية
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              شغّل أجهزة المعمل خطوة بخطوة كأنك أمامها حقيقةً — PCR، ELISA، Gel،
              المجهر، الحاضنة، Flow Cytometer والمزيد.
            </p>
          </div>
        </header>

        <div className="my-6 flex flex-wrap gap-2">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setFilter(b)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                filter === b
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {b === "all" ? "🔎 الكل" : `${INSTRUMENT_BRANCHES[b].icon} ${INSTRUMENT_BRANCHES[b].name}`}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((ins) => (
            <button
              key={ins.id}
              onClick={() => {
                setActiveId(ins.id);
                setView("run");
              }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-right transition-all hover:-translate-y-1 hover:border-primary/60"
            >
              <div className="absolute -left-6 -top-6 size-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-5xl">{ins.icon}</span>
                  <span className="rounded-full border border-border bg-background/40 px-2 py-1 text-[10px] tracking-widest text-muted-foreground">
                    {INSTRUMENT_BRANCHES[ins.branch].icon} {INSTRUMENT_BRANCHES[ins.branch].name}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-tight">{ins.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{ins.tagline}</p>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{ins.steps.length} خطوات</span>
                  <span className="font-bold text-primary">شغّل الجهاز ←</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================ RUNNER ============================ */

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ar-SA";
    u.rate = 0.95;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {}
}

function InstrumentRunner({ instrument, onBack }: { instrument: Instrument; onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<"training" | "exam">("training");
  const [voiceOn, setVoiceOn] = useState(true);
  const [logs, setLogs] = useState<string[]>([`[init] جهاز ${instrument.name} جاهز للتشغيل`]);
  const [errors, setErrors] = useState<{ stepId: string; stepTitle: string; note: string; time: string }[]>([]);
  const [stepTimes, setStepTimes] = useState<Record<string, string>>({});
  const [patientId] = useState(() => `PT-${Math.floor(Math.random() * 9000 + 1000)}`);
  const [startedAt] = useState(() => new Date());

  const step = instrument.steps[currentStep];
  const pct = (completed.length / instrument.steps.length) * 100;

  // Speak mentor intro on mount
  useEffect(() => {
    if (voiceOn && instrument.mentorIntro) speak(instrument.mentorIntro);
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument.id]);

  // Speak step mentor text when step changes (training mode only)
  useEffect(() => {
    if (mode !== "training" || !voiceOn || !step) return;
    const text = step.mentor || step.detail;
    if (text) speak(`الخطوة ${currentStep + 1}: ${step.title}. ${text}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, instrument.id]);

  useEffect(() => {
    if (!running || !step) return;
    const duration = step.duration ?? 1000;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / duration) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setRunning(false);
        setCompleted((c) => [...c, step.id]);
        const t = new Date().toLocaleTimeString("ar-EG");
        setStepTimes((m) => ({ ...m, [step.id]: t }));
        setLogs((l) => [...l, `[ok] ✓ ${step.title} — ${t}`]);
        if (currentStep + 1 >= instrument.steps.length) {
          setDone(true);
        } else {
          setCurrentStep((s) => s + 1);
          setProgress(0);
        }
      }
    }, 60);
    return () => clearInterval(id);
  }, [running, step, currentStep, instrument.steps.length]);

  function logError(note: string) {
    if (!step) return;
    const time = new Date().toLocaleTimeString("ar-EG");
    setErrors((e) => [...e, { stepId: step.id, stepTitle: step.title, note, time }]);
    setLogs((l) => [...l, `[err] ⚠ ${step.title}: ${note}`]);
  }

  function reset() {
    setCurrentStep(0);
    setCompleted([]);
    setRunning(false);
    setProgress(0);
    setDone(false);
    setErrors([]);
    setStepTimes({});
    setLogs([`[reset] إعادة تشغيل ${instrument.name}`]);
  }


  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
            ← الأجهزة
          </button>
          <div className="text-sm text-muted-foreground">
            الخطوة {Math.min(currentStep + 1, instrument.steps.length)} / {instrument.steps.length}
          </div>
        </div>

        <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="grid size-20 place-items-center rounded-2xl bg-secondary text-5xl">
              {instrument.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-black md:text-3xl">{instrument.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{instrument.tagline}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                {instrument.level && <span className="rounded-full border border-border bg-background/40 px-2 py-1 tracking-widest text-muted-foreground">المستوى: {instrument.level}</span>}
                {instrument.bsl && <span className="rounded-full border border-toxic/40 bg-toxic/10 px-2 py-1 tracking-widest text-toxic">{instrument.bsl}</span>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 rounded-full border border-border bg-background/40 p-1 text-xs">
                <button onClick={() => setMode("training")} className={`rounded-full px-3 py-1 ${mode === "training" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>تدريب</button>
                <button onClick={() => { setMode("exam"); window.speechSynthesis?.cancel(); }} className={`rounded-full px-3 py-1 ${mode === "exam" ? "bg-toxic text-background" : "text-muted-foreground"}`}>امتحان</button>
              </div>
              <button onClick={() => { setVoiceOn(v => !v); window.speechSynthesis?.cancel(); }} className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs">
                {voiceOn ? "🔊 صوت الدكتور" : "🔇 صامت"}
              </button>
            </div>
          </div>

          {/* Mentor speech bubble */}
          {mode === "training" && step && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/20 text-2xl">👨‍⚕️</div>
              <div className="flex-1">
                <div className="text-xs font-bold tracking-widest text-primary">د. المشرف</div>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                  {step.mentor || `سنقوم الآن بـ: ${step.title}. ${step.detail}`}
                </p>
              </div>
              <button onClick={() => speak(step.mentor || step.detail)} className="rounded-full border border-primary/40 bg-background/60 px-3 py-1 text-xs text-primary hover:bg-primary/10">
                🔊 إعادة
              </button>
            </div>
          )}

          {/* progress bar */}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-background/60">
            <div
              className="h-full bg-gradient-to-l from-primary to-toxic transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </header>


        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT: machine */}
          <section className="space-y-4">
            <Lab3D
              variant={instrument.resultVisual ?? "culture"}
              running={running}
              progress={progress}
              done={done}
              stepIndex={currentStep}
              stepTitle={step?.title}
              totalSteps={instrument.steps.length}
            />


            {/* Current step controls */}
            {!done && step && (
              <div className="rounded-2xl border border-primary/40 bg-card p-5 glow">
                <div className="mb-1 text-xs font-bold tracking-widest text-primary">
                  الخطوة الحالية
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
                {step.warn && (
                  <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">
                    ⚠ {step.warn}
                  </div>
                )}

                {running ? (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>جارٍ التشغيل…</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background">
                      <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setRunning(true);
                        setLogs((l) => [...l, `[run] ▶ ${step.action}…`]);
                      }}
                      className="flex-1 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
                    >
                      ▶ {step.action}
                    </button>
                    <button
                      onClick={() => logError(step.warn || "خطأ مخبري في الخطوة")}
                      title="بلّغ عن خطأ مخبري"
                      className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-3 text-destructive hover:bg-destructive/20"
                    >
                      ⚠ خطأ
                    </button>
                  </div>
                )}
              </div>
            )}

            {done && (
              <MedicalReport
                instrument={instrument}
                patientId={patientId}
                startedAt={startedAt}
                completedAt={new Date()}
                completed={completed}
                stepTimes={stepTimes}
                errors={errors}
                mode={mode}
                onReset={reset}
                onBack={onBack}
              />
            )}
          </section>



          {/* RIGHT: steps + science */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">
                🧠 مبدأ العمل
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{instrument.principle}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">
                🛡️ احتياطات السلامة
              </div>
              <ul className="mt-2 space-y-2 text-sm">
                {instrument.safety.map((s, i) => (
                  <li key={i} className="flex gap-2 text-foreground/85">
                    <span className="text-toxic">●</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 text-xs font-bold tracking-widest text-muted-foreground">
                📋 خطوات البروتوكول
              </div>
              <ol className="space-y-2">
                {instrument.steps.map((s, i) => {
                  const isDone = completed.includes(s.id);
                  const isCurrent = i === currentStep && !done;
                  return (
                    <li
                      key={s.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-sm transition-all ${
                        isDone
                          ? "border-primary/40 bg-primary/5 text-primary"
                          : isCurrent
                          ? "border-toxic bg-toxic/5"
                          : "border-border bg-background/40 text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                            ? "bg-toxic text-background animate-pulse"
                            : "bg-secondary"
                        }`}
                      >
                        {isDone ? "✓" : i + 1}
                      </span>
                      <span className="flex-1 font-medium">{s.title}</span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Console log */}
            <div className="rounded-2xl border border-border bg-background/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-success" /> LIVE LOG
              </div>
              <div className="max-h-40 space-y-1 overflow-auto font-mono text-xs text-foreground/80">
                {logs.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ============================ VISUALS ============================ */

function MachineVisual({
  variant,
  running,
  progress,
  done,
}: {
  variant: string;
  running: boolean;
  progress: number;
  done: boolean;
}) {
  return (
    <div className="petri-dish relative h-72 overflow-hidden rounded-3xl p-5">
      <div
        className="absolute inset-0 opacity-40 transition-opacity"
        style={{ background: "var(--gradient-toxic)" }}
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full border border-border bg-background/60 px-2 py-1 tracking-widest text-muted-foreground">
            {variant.toUpperCase()} • LIVE
          </span>
          <span className={`flex items-center gap-2 ${running ? "text-toxic" : done ? "text-primary" : "text-muted-foreground"}`}>
            <span className={`size-2 rounded-full ${running ? "bg-toxic animate-pulse" : done ? "bg-primary" : "bg-muted-foreground"}`} />
            {running ? "RUNNING" : done ? "COMPLETE" : "IDLE"}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {variant === "pcr" && <PCRViz running={running} progress={progress} done={done} />}
          {variant === "elisa" && <ElisaViz running={running} progress={progress} done={done} />}
          {variant === "gel" && <GelViz running={running} progress={progress} done={done} />}
          {variant === "gram" && <GramViz running={running} done={done} />}
          {variant === "culture" && <CultureViz running={running} done={done} />}
          {variant === "flow" && <FlowViz running={running} done={done} />}
          {variant === "microscope" && <ScopeViz running={running} done={done} />}
        </div>
      </div>
    </div>
  );
}

function PCRViz({ running, progress, done }: { running: boolean; progress: number; done: boolean }) {
  const cycles = 40;
  const filled = done ? cycles : Math.round((progress / 100) * cycles);
  return (
    <div className="w-full">
      <div className="text-center text-xs text-muted-foreground">دورات حرارية: {filled}/{cycles}</div>
      <div className="mt-3 grid grid-cols-10 gap-1">
        {Array.from({ length: cycles }).map((_, i) => (
          <div
            key={i}
            className={`h-3 rounded-sm transition-all ${
              i < filled ? "bg-primary glow" : "bg-secondary/60"
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-around text-center text-xs">
        <div><div className="text-toxic font-bold">95°C</div><div className="text-muted-foreground">Denature</div></div>
        <div><div className="text-accent font-bold">55°C</div><div className="text-muted-foreground">Anneal</div></div>
        <div><div className="text-primary font-bold">72°C</div><div className="text-muted-foreground">Extend</div></div>
      </div>
    </div>
  );
}

function ElisaViz({ running, progress, done }: { running: boolean; progress: number; done: boolean }) {
  const wells = 96;
  const intensity = done ? 1 : progress / 100;
  return (
    <div>
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: wells }).map((_, i) => {
          const isSample = i % 3 !== 0;
          const color = isSample
            ? done
              ? `oklch(0.85 0.18 90 / ${0.4 + Math.random() * 0.6})`
              : `oklch(0.70 0.15 220 / ${0.2 + intensity * 0.7})`
            : "oklch(0.30 0.05 200)";
          return (
            <div
              key={i}
              className="size-4 rounded-full border border-border transition-colors"
              style={{ background: color }}
            />
          );
        })}
      </div>
      <div className="mt-3 text-center text-xs text-muted-foreground">
        {done ? "OD 450 nm = 1.42" : running ? "تطور اللون…" : "لوحة 96 بئر"}
      </div>
    </div>
  );
}

function GelViz({ running, progress, done }: { running: boolean; progress: number; done: boolean }) {
  const dist = done ? 80 : (progress / 100) * 80;
  const lanes = [50, 70, 30, 60, 45];
  return (
    <div className="relative h-44 w-full max-w-md rounded-lg border border-border bg-background/80 p-3">
      <div className="absolute inset-x-3 top-3 flex justify-around">
        {lanes.map((_, i) => (
          <div key={i} className="h-2 w-6 rounded-sm bg-toxic/70" />
        ))}
      </div>
      {running || done ? (
        <>
          {lanes.map((size, i) => (
            <div
              key={i}
              className="absolute h-1.5 w-6 rounded-sm bg-primary transition-all glow"
              style={{
                top: `${10 + (dist * (size / 100))}%`,
                left: `${15 + i * 18}%`,
              }}
            />
          ))}
        </>
      ) : null}
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">
        {done ? "حزمة عند 450 bp ✓" : "100V — الترحيل جارٍ"}
      </div>
    </div>
  );
}

function GramViz({ running, done }: { running: boolean; done: boolean }) {
  return (
    <div className="relative grid size-48 place-items-center rounded-full border-4 border-border bg-background/60">
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`size-4 rounded-full transition-all ${
              done ? "bg-purple-500" : running ? "bg-pink-400/60" : "bg-secondary"
            }`}
            style={{ boxShadow: done ? "0 0 8px oklch(0.55 0.22 300)" : undefined }}
          />
        ))}
      </div>
      <div className="absolute -bottom-1 text-xs text-muted-foreground">100x + Oil</div>
    </div>
  );
}

function CultureViz({ running, done }: { running: boolean; done: boolean }) {
  return (
    <div className="relative grid size-52 place-items-center rounded-full border-4 border-border bg-gradient-to-br from-red-900/60 to-red-950/80">
      {done && (
        <>
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-200/90"
              style={{
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                top: `${15 + Math.random() * 70}%`,
                left: `${15 + Math.random() * 70}%`,
                boxShadow: "0 0 6px oklch(0.85 0.12 70)",
              }}
            />
          ))}
        </>
      )}
      {running && !done && (
        <div className="text-xs text-muted-foreground">37°C — حضانة جارية…</div>
      )}
      {!running && !done && (
        <div className="text-xs text-muted-foreground">Blood Agar plate</div>
      )}
    </div>
  );
}

function FlowViz({ running, done }: { running: boolean; done: boolean }) {
  return (
    <div className="grid h-44 w-full max-w-md grid-cols-2 gap-2">
      <div className="relative rounded-lg border border-border bg-background/60 p-2">
        <div className="text-[10px] text-muted-foreground">FSC vs SSC</div>
        <div className="relative h-full">
          {(running || done) &&
            Array.from({ length: done ? 60 : 25 }).map((_, i) => (
              <span
                key={i}
                className="absolute size-1 rounded-full bg-primary"
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                }}
              />
            ))}
        </div>
      </div>
      <div className="relative rounded-lg border border-border bg-background/60 p-2">
        <div className="text-[10px] text-muted-foreground">CD4 vs CD8</div>
        <div className="relative h-full">
          {(running || done) &&
            Array.from({ length: done ? 50 : 20 }).map((_, i) => (
              <span
                key={i}
                className="absolute size-1 rounded-full"
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                  background: i % 2 ? "oklch(0.72 0.2 320)" : "oklch(0.78 0.18 165)",
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function ScopeViz({ running, done }: { running: boolean; done: boolean }) {
  return (
    <div className="relative grid size-48 place-items-center rounded-full border-4 border-border bg-black">
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-900/40 to-transparent" />
      {(running || done) && (
        <div className="relative grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={`size-3 rounded-full ${done ? "bg-purple-400" : "bg-pink-300/60"}`}
              style={{ boxShadow: "0 0 4px oklch(0.65 0.22 300)" }}
            />
          ))}
        </div>
      )}
      <div className="absolute bottom-2 text-xs text-muted-foreground">
        {done ? "1000x — وضوح كامل" : "ضع الشريحة"}
      </div>
    </div>
  );
}

/* ============================ MEDICAL REPORT ============================ */

function MedicalReport({
  instrument,
  patientId,
  startedAt,
  completedAt,
  completed,
  stepTimes,
  errors,
  mode,
  onReset,
  onBack,
}: {
  instrument: Instrument;
  patientId: string;
  startedAt: Date;
  completedAt: Date;
  completed: string[];
  stepTimes: Record<string, string>;
  errors: { stepId: string; stepTitle: string; note: string; time: string }[];
  mode: "training" | "exam";
  onReset: () => void;
  onBack: () => void;
}) {
  const reportId = `RPT-${completedAt.getFullYear()}${String(completedAt.getMonth() + 1).padStart(2, "0")}${String(completedAt.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const totalSteps = instrument.steps.length;
  const doneCount = completed.length;
  const errCount = errors.length;
  const accuracy = Math.max(0, Math.round(((doneCount - errCount) / totalSteps) * 100));
  const grade = errCount === 0 ? "ممتاز A+" : errCount === 1 ? "جيد جداً B" : errCount <= 3 ? "مقبول C" : "يحتاج إعادة D";
  const durationMin = Math.max(1, Math.round((completedAt.getTime() - startedAt.getTime()) / 60000));

  function downloadReport() {
    const lines = [
      `تقرير مخبري طبي — MICROBIOLOGY LAB REPORT`,
      `==========================================`,
      `رقم التقرير: ${reportId}`,
      `رقم المريض: ${patientId}`,
      `الجهاز: ${instrument.name}`,
      `القسم: ${instrument.branch}`,
      `الوضع: ${mode === "training" ? "تدريب" : "امتحان"}`,
      `تاريخ البدء: ${startedAt.toLocaleString("ar-EG")}`,
      `تاريخ الانتهاء: ${completedAt.toLocaleString("ar-EG")}`,
      `المدة الكلية: ${durationMin} دقيقة`,
      ``,
      `— الخطوات المنفذة —`,
      ...instrument.steps.map((s, i) => `${i + 1}. ${s.title}  [${stepTimes[s.id] ?? "—"}]`),
      ``,
      `— الأخطاء المسجلة (${errCount}) —`,
      ...(errCount === 0 ? ["لا توجد أخطاء — أداء مثالي."] : errors.map((e, i) => `${i + 1}. [${e.time}] ${e.stepTitle} → ${e.note}`)),
      ``,
      `— التشخيص النهائي —`,
      instrument.finalResult,
      ``,
      `— التقييم —`,
      `الدقة: ${accuracy}%`,
      `التقدير: ${grade}`,
      ``,
      `توقيع المشرف: د. _______________________`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-2xl glow">
      {/* Letterhead */}
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div>
          <div className="text-xs font-bold tracking-widest text-primary">MEDICAL LABORATORY REPORT</div>
          <h2 className="mt-1 text-xl font-black">تقرير مخبري طبي</h2>
          <div className="mt-1 text-xs text-muted-foreground">MicroLab Clinical Diagnostics</div>
        </div>
        <div className="text-left text-xs text-muted-foreground">
          <div>رقم التقرير: <span className="font-bold text-foreground">{reportId}</span></div>
          <div>رقم المريض: <span className="font-bold text-foreground">{patientId}</span></div>
          <div>التاريخ: {completedAt.toLocaleDateString("ar-EG")}</div>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
        <Field label="الجهاز" value={instrument.name} />
        <Field label="القسم" value={instrument.branch} />
        <Field label="الوضع" value={mode === "training" ? "تدريب" : "امتحان"} />
        <Field label="المدة" value={`${durationMin} د`} />
      </div>

      {/* Diagnosis */}
      <div className="mt-5 rounded-xl border-2 border-primary/60 bg-primary/10 p-4">
        <div className="text-xs font-bold tracking-widest text-primary">🩺 التشخيص النهائي</div>
        <p className="mt-2 text-sm font-bold leading-relaxed text-foreground">{instrument.finalResult}</p>
      </div>

      {/* Steps */}
      <div className="mt-5">
        <div className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">📋 الخطوات المنفذة ({doneCount}/{totalSteps})</div>
        <ol className="space-y-1.5 text-sm">
          {instrument.steps.map((s, i) => {
            const isDone = completed.includes(s.id);
            return (
              <li key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`grid size-6 place-items-center rounded-full text-[10px] font-bold ${isDone ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="font-medium">{s.title}</span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{stepTimes[s.id] ?? "—"}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Errors */}
      <div className="mt-5">
        <div className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">⚠ الأخطاء المسجلة ({errCount})</div>
        {errCount === 0 ? (
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-3 text-sm text-primary">
            ✓ لا توجد أخطاء — أداء مثالي.
          </div>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {errors.map((e, i) => (
              <li key={i} className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive">
                <div className="flex justify-between text-[11px] opacity-80">
                  <span>الخطوة: {e.stepTitle}</span>
                  <span className="font-mono">{e.time}</span>
                </div>
                <div className="mt-1 text-foreground/90">⚠ {e.note}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Scorecard */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="الدقة" value={`${accuracy}%`} tone="primary" />
        <Stat label="الخطوات" value={`${doneCount}/${totalSteps}`} tone="muted" />
        <Stat label="التقدير" value={grade} tone={errCount === 0 ? "primary" : errCount <= 3 ? "muted" : "danger"} />
      </div>

      {/* Signature */}
      <div className="mt-6 flex items-end justify-between border-t border-border pt-4 text-xs">
        <div>
          <div className="text-muted-foreground">توقيع المشرف</div>
          <div className="mt-2 italic text-foreground/70">د. ـــــــــــــــــــــــــ</div>
        </div>
        <div className="text-left text-muted-foreground">
          ختم المختبر 🧪
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 grid gap-2 md:grid-cols-4">
        <button onClick={() => window.print()} className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-semibold hover:bg-secondary/70">
          🖨 طباعة
        </button>
        <button onClick={downloadReport} className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-semibold hover:bg-secondary/70">
          ⬇ تحميل
        </button>
        <button onClick={onReset} className="rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-semibold hover:bg-secondary/70">
          ↻ إعادة الحالة
        </button>
        <button onClick={onBack} className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
          أجهزة أخرى
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
      <div className="text-[10px] tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "primary" | "muted" | "danger" }) {
  const cls = tone === "primary" ? "border-primary/40 bg-primary/10 text-primary" : tone === "danger" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border bg-background/40 text-foreground";
  return (
    <div className={`rounded-xl border p-3 text-center ${cls}`}>
      <div className="text-[10px] tracking-widest opacity-80">{label}</div>
      <div className="mt-1 text-lg font-black">{value}</div>
    </div>
  );
}
