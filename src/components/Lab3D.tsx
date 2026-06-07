import { useMemo } from "react";

type Variant = "pcr" | "elisa" | "gel" | "gram" | "culture" | "flow" | "microscope";

interface Props {
  variant: Variant | string;
  running: boolean;
  progress: number;
  done: boolean;
  stepIndex: number;
  stepTitle?: string;
  totalSteps: number;
}

/**
 * Lab3D — 3D-perspective realistic lab instrument simulator.
 * Uses layered CSS + transforms to render device chassis, screens, lights,
 * and step-driven hotspots that glow with the current action.
 */
export function Lab3D(props: Props) {
  const { variant, running, progress, done, stepIndex, stepTitle, totalSteps } = props;

  return (
    <div
      className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-border"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 110%, oklch(0.30 0.05 200) 0%, oklch(0.14 0.03 200) 60%, oklch(0.10 0.02 200) 100%)",
        boxShadow: "inset 0 30px 60px oklch(0 0 0 / 0.6), inset 0 -10px 40px oklch(0.78 0.18 165 / 0.08)",
      }}
    >
      {/* Lab floor grid */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0 38px, oklch(0.78 0.18 165 / 0.12) 38px 39px), repeating-linear-gradient(90deg, transparent 0 38px, oklch(0.78 0.18 165 / 0.12) 38px 39px)",
          transform: "perspective(800px) rotateX(60deg)",
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />
      {/* HUD top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 text-[10px] tracking-widest">
        <span className="rounded-full border border-border bg-background/60 px-2 py-1 text-muted-foreground">
          3D · {String(variant).toUpperCase()}
        </span>
        <span className="rounded-full border border-border bg-background/60 px-2 py-1 text-muted-foreground">
          STEP {Math.min(stepIndex + 1, totalSteps)}/{totalSteps}
        </span>
        <span
          className={`flex items-center gap-2 rounded-full border px-2 py-1 ${
            running ? "border-toxic/60 bg-toxic/10 text-toxic" : done ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-background/60 text-muted-foreground"
          }`}
        >
          <span className={`size-1.5 rounded-full ${running ? "bg-toxic animate-pulse" : done ? "bg-primary" : "bg-muted-foreground"}`} />
          {running ? "RUNNING" : done ? "COMPLETE" : "READY"}
        </span>
      </div>

      {/* 3D stage */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 40%" }}
      >
        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(14deg) rotateY(${running ? -8 : -4}deg)`,
            transition: "transform 600ms ease",
          }}
        >
          {variant === "pcr" && <PCR3D running={running} progress={progress} done={done} stepIndex={stepIndex} />}
          {variant === "elisa" && <Elisa3D running={running} progress={progress} done={done} stepIndex={stepIndex} />}
          {variant === "gel" && <Gel3D running={running} progress={progress} done={done} stepIndex={stepIndex} />}
          {variant === "gram" && <Gram3D running={running} done={done} stepIndex={stepIndex} />}
          {variant === "culture" && <Culture3D running={running} done={done} stepIndex={stepIndex} />}
          {variant === "flow" && <Flow3D running={running} done={done} stepIndex={stepIndex} />}
          {variant === "microscope" && <Scope3D running={running} done={done} stepIndex={stepIndex} />}
        </div>
      </div>

      {/* Step caption */}
      {stepTitle && (
        <div className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-primary/40 bg-background/80 px-4 py-2 text-center text-xs backdrop-blur">
          <span className="font-bold text-primary">⌖ </span>
          <span className="text-foreground/90">{stepTitle}</span>
        </div>
      )}
    </div>
  );
}

/* ===================== Chassis primitives ===================== */

function Chassis({
  width = 320,
  height = 200,
  depth = 110,
  color = "oklch(0.28 0.02 200)",
  accent = "oklch(0.78 0.18 165)",
  children,
}: {
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ transformStyle: "preserve-3d", width, height }} className="relative">
      {/* top */}
      <div
        className="absolute left-0 top-0 rounded-t-xl"
        style={{
          width,
          height: depth,
          background: `linear-gradient(180deg, oklch(0.40 0.03 200), ${color})`,
          transform: `rotateX(90deg) translateZ(${height / 2}px) translateY(${-depth / 2}px)`,
          boxShadow: `inset 0 0 30px ${accent} / 0.2`,
        }}
      />
      {/* front */}
      <div
        className="absolute inset-0 overflow-hidden rounded-xl border border-border"
        style={{
          background: `linear-gradient(160deg, ${color}, oklch(0.18 0.02 200))`,
          boxShadow: `0 30px 60px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(1 0 0 / 0.05)`,
          transform: `translateZ(${depth / 2}px)`,
        }}
      >
        {children}
      </div>
      {/* sides for depth */}
      <div
        className="absolute left-0 top-0 rounded-r"
        style={{
          width: depth,
          height,
          background: "linear-gradient(90deg, oklch(0.10 0.02 200), oklch(0.22 0.02 200))",
          transform: `rotateY(90deg) translateZ(${-depth / 2}px) translateX(${-depth / 2}px)`,
        }}
      />
      <div
        className="absolute right-0 top-0 rounded-l"
        style={{
          width: depth,
          height,
          background: "linear-gradient(270deg, oklch(0.10 0.02 200), oklch(0.22 0.02 200))",
          transform: `rotateY(-90deg) translateZ(${-depth / 2}px) translateX(${depth / 2}px)`,
          right: 0,
        }}
      />
      {/* shadow */}
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 rounded-[50%] opacity-70"
        style={{
          width: width * 1.1,
          height: 26,
          background: "radial-gradient(ellipse, oklch(0 0 0 / 0.7), transparent 70%)",
          transform: "translateY(8px)",
        }}
      />
    </div>
  );
}

function Screen({ children, glow }: { children: React.ReactNode; glow?: boolean }) {
  return (
    <div
      className="overflow-hidden rounded-md border border-primary/40"
      style={{
        background: "linear-gradient(180deg, oklch(0.18 0.05 200), oklch(0.10 0.04 200))",
        boxShadow: glow ? "0 0 18px oklch(0.78 0.18 165 / 0.6), inset 0 0 18px oklch(0.78 0.18 165 / 0.3)" : "inset 0 0 10px oklch(0 0 0 / 0.5)",
      }}
    >
      {children}
    </div>
  );
}

function LED({ on, color = "oklch(0.78 0.18 165)" }: { on?: boolean; color?: string }) {
  return (
    <span
      className="inline-block size-2 rounded-full"
      style={{
        background: on ? color : "oklch(0.20 0.02 200)",
        boxShadow: on ? `0 0 8px ${color}, 0 0 2px ${color}` : "inset 0 0 2px black",
      }}
    />
  );
}

function Hotspot({ active, done, label, style }: { active: boolean; done?: boolean; label: string; style?: React.CSSProperties }) {
  const state = active ? "active" : done ? "done" : "idle";
  const ring =
    state === "active"
      ? "border-toxic bg-toxic/40 animate-ping"
      : state === "done"
      ? "border-primary bg-primary/50"
      : "border-border/40 bg-background/40";
  const labelCls =
    state === "active"
      ? "border-toxic/60 bg-background/95 text-toxic"
      : state === "done"
      ? "border-primary/50 bg-background/90 text-primary"
      : "border-border/40 bg-background/70 text-muted-foreground";
  return (
    <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={style}>
      <span className={`block size-5 rounded-full border-2 ${ring}`} />
      <span className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${labelCls}`}>
        {state === "done" ? "✓ " : state === "active" ? "● " : ""}{label}
      </span>
    </div>
  );
}


/* ===================== PCR ===================== */

function PCR3D({ running, progress, done, stepIndex }: { running: boolean; progress: number; done: boolean; stepIndex: number }) {
  const temp = done ? 72 : running ? [95, 60, 72][Math.floor((progress / 100) * 3) % 3] : 25;
  const cycle = done ? 40 : Math.round((progress / 100) * 40);
  const lidOpen = stepIndex < 4;
  return (
    <Chassis width={360} height={220} depth={130}>
      {/* top brand strip */}
      <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-4 py-2 text-[10px] tracking-widest text-muted-foreground">
        <span className="font-bold text-primary">QIA·CYCLER 9600</span>
        <span className="flex items-center gap-2">
          <LED on={running} color="oklch(0.75 0.22 30)" />
          <LED on={running || done} color="oklch(0.78 0.18 165)" />
          <LED on={done} color="oklch(0.85 0.18 90)" />
        </span>
      </div>
      <div className="grid grid-cols-[1fr_1.2fr] gap-3 p-4">
        {/* Screen */}
        <Screen glow={running || done}>
          <div className="space-y-1 p-3 font-mono text-[10px] text-primary">
            <div className="flex justify-between"><span>TEMP</span><span className="text-toxic">{temp}°C</span></div>
            <div className="flex justify-between"><span>CYCLE</span><span>{cycle}/40</span></div>
            <div className="mt-2 h-16 rounded border border-primary/30 bg-black/40 p-1">
              <svg viewBox="0 0 100 40" className="size-full">
                <path
                  d={`M0 38 ${Array.from({ length: 40 })
                    .map((_, i) => {
                      const x = (i / 39) * 100;
                      const y = i < cycle ? 38 - Math.min(35, Math.pow(Math.max(0, i - 15), 1.4) * 0.7) : 38;
                      return `L${x} ${y}`;
                    })
                    .join(" ")}`}
                  fill="none"
                  stroke="oklch(0.78 0.18 165)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground"><span>Ct ≈</span><span>{done ? "24.6" : "—"}</span></div>
          </div>
        </Screen>
        {/* Thermal block + lid */}
        <div className="relative rounded-md border border-border bg-black/50 p-3">
          <div
            className="absolute inset-x-3 top-3 h-3 rounded-t bg-secondary/80 transition-transform"
            style={{ transform: lidOpen ? "translateY(-22px) rotateX(-30deg)" : "translateY(0)", transformOrigin: "top" }}
          />
          <div className="mt-3 grid grid-cols-8 gap-[2px] rounded bg-black/60 p-1">
            {Array.from({ length: 96 }).map((_, i) => {
              const filled = stepIndex >= 2;
              const lit = (running || done) && filled;
              return (
                <span
                  key={i}
                  className="block aspect-square rounded-full"
                  style={{
                    background: filled
                      ? lit
                        ? "oklch(0.78 0.18 165)"
                        : "oklch(0.55 0.10 200)"
                      : "oklch(0.20 0.02 200)",
                    boxShadow: lit ? "0 0 4px oklch(0.78 0.18 165)" : undefined,
                  }}
                />
              );
            })}
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
            <span>96-WELL BLOCK</span>
            <span className={running ? "text-toxic" : ""}>{running ? "▮▮▮ HEATING" : done ? "DONE" : "IDLE"}</span>
          </div>
        </div>
      </div>
      {/* Hotspots over device */}
      <Hotspot active={stepIndex === 0} label="إدخال العينة" style={{ left: "20%", top: "62%" }} />
      <Hotspot active={stepIndex === 1} label="Master Mix" style={{ left: "22%", top: "78%" }} />
      <Hotspot active={stepIndex === 2} label="تحميل اللوحة" style={{ left: "70%", top: "62%" }} />
      <Hotspot active={stepIndex === 3} label="إغلاق الغطاء" style={{ left: "70%", top: "42%" }} />
      <Hotspot active={stepIndex === 4} label="بدء الدورات" style={{ left: "30%", top: "40%" }} />
      <Hotspot active={stepIndex >= 5} label="قراءة النتيجة" style={{ left: "35%", top: "55%" }} />
    </Chassis>
  );
}

/* ===================== ELISA ===================== */

function Elisa3D({ running, progress, done, stepIndex }: { running: boolean; progress: number; done: boolean; stepIndex: number }) {
  const intensity = done ? 1 : progress / 100;
  return (
    <Chassis width={360} height={220} depth={120}>
      <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-4 py-2 text-[10px] tracking-widest text-muted-foreground">
        <span className="font-bold text-primary">BIO·READER 450</span>
        <span className="flex items-center gap-2">
          <LED on={running} color="oklch(0.85 0.18 90)" />
          <LED on={done} />
        </span>
      </div>
      <div className="grid grid-cols-[1fr_1.4fr] gap-3 p-4">
        <Screen glow={done}>
          <div className="p-3 font-mono text-[10px] text-primary">
            <div>WAVELENGTH</div>
            <div className="text-lg text-toxic">450 nm</div>
            <div className="mt-2">OD VALUE</div>
            <div className="text-2xl font-bold text-primary">{done ? "1.42" : running ? (intensity * 1.42).toFixed(2) : "—"}</div>
            <div className="mt-2 text-[9px] text-muted-foreground">{done ? "✓ POSITIVE" : "READING…"}</div>
          </div>
        </Screen>
        <div className="rounded-md border border-border bg-black/50 p-2">
          <div className="grid grid-cols-12 gap-[2px]">
            {Array.from({ length: 96 }).map((_, i) => {
              const ctrl = i % 4 === 0;
              const c = ctrl
                ? "oklch(0.25 0.02 200)"
                : done
                ? `oklch(0.85 0.18 90 / ${0.4 + Math.random() * 0.6})`
                : `oklch(0.70 0.10 220 / ${0.2 + intensity * 0.7})`;
              return (
                <span
                  key={i}
                  className="block aspect-square rounded-full border border-border/40"
                  style={{ background: c, boxShadow: !ctrl && done ? "0 0 4px oklch(0.85 0.18 90)" : undefined }}
                />
              );
            })}
          </div>
          <div className="mt-2 text-center text-[9px] text-muted-foreground">96-WELL ELISA PLATE</div>
        </div>
      </div>
      <Hotspot active={stepIndex === 0} label="إضافة المستضد" style={{ left: "70%", top: "55%" }} />
      <Hotspot active={stepIndex === 1} label="غسيل" style={{ left: "70%", top: "75%" }} />
      <Hotspot active={stepIndex === 2} label="إضافة الكونجوجيت" style={{ left: "55%", top: "55%" }} />
      <Hotspot active={stepIndex === 3} label="إضافة Substrate" style={{ left: "85%", top: "55%" }} />
      <Hotspot active={stepIndex >= 4} label="القراءة 450nm" style={{ left: "25%", top: "55%" }} />
    </Chassis>
  );
}

/* ===================== Gel Electrophoresis ===================== */

function Gel3D({ running, progress, done, stepIndex }: { running: boolean; progress: number; done: boolean; stepIndex: number }) {
  const dist = done ? 85 : (progress / 100) * 85;
  return (
    <Chassis width={380} height={210} depth={110} color="oklch(0.22 0.02 200)">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-4 py-2 text-[10px] tracking-widest text-muted-foreground">
        <span className="font-bold text-primary">ELECTRO·BOX 100V</span>
        <span className="flex items-center gap-3">
          <span className={running ? "text-toxic" : "text-muted-foreground"}>{running ? "100 V • 400 mA" : "0 V"}</span>
          <LED on={running} color="oklch(0.65 0.25 25)" />
        </span>
      </div>
      <div className="p-4">
        <div
          className="relative h-32 rounded border border-border"
          style={{
            background: "linear-gradient(180deg, oklch(0.30 0.08 280 / 0.5), oklch(0.18 0.05 280 / 0.7))",
            boxShadow: "inset 0 0 30px oklch(0.55 0.20 280 / 0.4)",
          }}
        >
          {/* wells */}
          <div className="absolute inset-x-4 top-2 flex justify-around">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-2 w-6 rounded-sm bg-black/70" />
            ))}
          </div>
          {/* bands */}
          {(running || done) &&
            [60, 80, 40, 90, 55, 70].map((s, i) => (
              <div
                key={i}
                className="absolute h-1 w-6 rounded-sm transition-all"
                style={{
                  top: `${10 + dist * (s / 100)}%`,
                  left: `${8 + i * 14}%`,
                  background: "oklch(0.85 0.20 90)",
                  boxShadow: "0 0 8px oklch(0.85 0.20 90)",
                }}
              />
            ))}
          {/* electrodes */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-toxic via-toxic/60 to-toxic" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary" />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>− CATHODE</span>
          <span>{done ? "✓ 450 bp band" : "MIGRATION"}</span>
          <span>+ ANODE</span>
        </div>
      </div>
      <Hotspot active={stepIndex === 0} label="صب الجل" style={{ left: "50%", top: "55%" }} />
      <Hotspot active={stepIndex === 1} label="تحميل العينات" style={{ left: "50%", top: "45%" }} />
      <Hotspot active={stepIndex === 2} label="تشغيل التيار" style={{ left: "88%", top: "30%" }} />
      <Hotspot active={stepIndex >= 3} label="UV Imaging" style={{ left: "20%", top: "70%" }} />
    </Chassis>
  );
}

/* ===================== Gram Staining ===================== */

function Gram3D({ running, done, stepIndex }: { running: boolean; done: boolean; stepIndex: number }) {
  const stainColor = done
    ? "oklch(0.45 0.20 300)"
    : stepIndex >= 3
    ? "oklch(0.55 0.22 30)"
    : stepIndex >= 1
    ? "oklch(0.55 0.20 300)"
    : "oklch(0.70 0.05 200)";
  return (
    <Chassis width={340} height={210} depth={100} color="oklch(0.24 0.02 200)">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-4 py-2 text-[10px] tracking-widest text-muted-foreground">
        <span className="font-bold text-primary">GRAM·STAIN STATION</span>
        <span className="flex items-center gap-2">
          <LED on={running} />
        </span>
      </div>
      <div className="grid grid-cols-[1.2fr_1fr] gap-3 p-4">
        {/* Slide */}
        <div className="relative rounded border border-border bg-black/40 p-3">
          <div
            className="mx-auto h-28 w-full max-w-[180px] rounded-sm border border-border"
            style={{
              background: `radial-gradient(circle, ${stainColor} 30%, oklch(0.95 0.02 200) 80%)`,
              boxShadow: `0 0 20px ${stainColor}`,
            }}
          >
            <div className="grid h-full grid-cols-6 place-items-center gap-1 p-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full"
                  style={{ background: stainColor, boxShadow: `0 0 4px ${stainColor}` }}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-muted-foreground">شريحة ميكروسكوب 1000x</div>
        </div>
        {/* Reagent bottles */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "Crystal Violet", color: "oklch(0.45 0.20 300)", step: 0 },
            { name: "Iodine", color: "oklch(0.55 0.18 80)", step: 1 },
            { name: "Alcohol", color: "oklch(0.80 0.02 200)", step: 2 },
            { name: "Safranin", color: "oklch(0.65 0.22 30)", step: 3 },
          ].map((r) => (
            <div
              key={r.name}
              className={`rounded border p-2 text-[9px] transition-all ${stepIndex === r.step ? "border-toxic scale-105" : "border-border"}`}
            >
              <div
                className="mx-auto h-12 w-6 rounded-sm"
                style={{ background: `linear-gradient(180deg, ${r.color}, oklch(0.20 0.02 200))` }}
              />
              <div className="mt-1 text-center text-muted-foreground">{r.name}</div>
            </div>
          ))}
        </div>
      </div>
    </Chassis>
  );
}

/* ===================== Culture / Incubator ===================== */

function Culture3D({ running, done, stepIndex }: { running: boolean; done: boolean; stepIndex: number }) {
  return (
    <Chassis width={340} height={230} depth={130} color="oklch(0.20 0.02 200)">
      <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-4 py-2 text-[10px] tracking-widest text-muted-foreground">
        <span className="font-bold text-primary">INCUBATOR · 37°C / 5% CO₂</span>
        <span className="flex items-center gap-2">
          <LED on={running || done} color="oklch(0.65 0.25 25)" />
          <span className={running ? "text-toxic" : ""}>{running ? "37.0°C" : done ? "DONE" : "—"}</span>
        </span>
      </div>
      <div className="p-4">
        <div className="relative h-40 rounded border border-border bg-black/50 p-3">
          {/* glass door */}
          <div
            className="absolute inset-2 rounded border border-primary/30"
            style={{
              background: "linear-gradient(135deg, oklch(0.30 0.05 200 / 0.3), oklch(0.20 0.05 200 / 0.6))",
              boxShadow: "inset 0 0 30px oklch(0.78 0.18 165 / 0.2)",
            }}
          >
            {/* shelves with plates */}
            <div className="grid h-full grid-rows-3 gap-1 p-2">
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex items-center justify-around border-b border-primary/20 pb-1">
                  {[0, 1, 2].map((c) => (
                    <div
                      key={c}
                      className="relative size-8 rounded-full border border-amber-200/30"
                      style={{
                        background: "radial-gradient(circle, oklch(0.30 0.10 30 / 0.8), oklch(0.20 0.08 30 / 0.9))",
                      }}
                    >
                      {done && (
                        <>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className="absolute size-1 rounded-full bg-amber-100"
                              style={{
                                top: `${20 + Math.random() * 60}%`,
                                left: `${20 + Math.random() * 60}%`,
                                boxShadow: "0 0 3px oklch(0.90 0.10 70)",
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>Blood Agar / MacConkey / Chocolate</span>
          <span>{done ? "✓ نمو مستعمرات" : running ? "⌛ حضانة 24h" : "⏸"}</span>
        </div>
      </div>
      <Hotspot active={stepIndex === 0} label="تلقيح الطبق" style={{ left: "30%", top: "50%" }} />
      <Hotspot active={stepIndex === 1} label="إغلاق الباب" style={{ left: "85%", top: "55%" }} />
      <Hotspot active={stepIndex >= 2} label="قراءة المستعمرات" style={{ left: "50%", top: "70%" }} />
    </Chassis>
  );
}

/* ===================== Flow Cytometer ===================== */

function Flow3D({ running, done, stepIndex }: { running: boolean; done: boolean; stepIndex: number }) {
  const dots = useMemo(
    () => Array.from({ length: 80 }).map(() => ({ x: Math.random() * 90, y: Math.random() * 90, t: Math.random() > 0.5 })),
    []
  );
  return (
    <Chassis width={380} height={220} depth={130}>
      <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-4 py-2 text-[10px] tracking-widest text-muted-foreground">
        <span className="font-bold text-primary">FLOW · CYTO ANALYZER</span>
        <span className="flex items-center gap-2"><LED on={running} color="oklch(0.78 0.20 320)" /><LED on={done} /></span>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4">
        <Screen glow={running || done}>
          <div className="p-2 font-mono text-[9px] text-primary">
            <div>FSC vs SSC</div>
            <div className="relative mt-1 h-24 rounded border border-primary/30 bg-black/60">
              {(running || done) &&
                dots.slice(0, done ? 60 : 25).map((d, i) => (
                  <span
                    key={i}
                    className="absolute size-[3px] rounded-full bg-primary"
                    style={{ top: `${d.y}%`, left: `${d.x}%`, boxShadow: "0 0 2px oklch(0.78 0.18 165)" }}
                  />
                ))}
            </div>
          </div>
        </Screen>
        <Screen glow={done}>
          <div className="p-2 font-mono text-[9px] text-primary">
            <div>CD4 vs CD8</div>
            <div className="relative mt-1 h-24 rounded border border-accent/30 bg-black/60">
              {(running || done) &&
                dots.slice(0, done ? 70 : 30).map((d, i) => (
                  <span
                    key={i}
                    className="absolute size-[3px] rounded-full"
                    style={{
                      top: `${d.y}%`,
                      left: `${d.x}%`,
                      background: d.t ? "oklch(0.78 0.20 320)" : "oklch(0.78 0.18 165)",
                      boxShadow: "0 0 2px currentColor",
                    }}
                  />
                ))}
            </div>
          </div>
        </Screen>
      </div>
      <Hotspot active={stepIndex === 0} label="تحضير العينة" style={{ left: "50%", top: "85%" }} />
      <Hotspot active={stepIndex === 1} label="تحميل الأنبوب" style={{ left: "90%", top: "55%" }} />
      <Hotspot active={stepIndex >= 2} label="قراءة Gating" style={{ left: "30%", top: "55%" }} />
    </Chassis>
  );
}

/* ===================== Microscope ===================== */

function Scope3D({ running, done, stepIndex }: { running: boolean; done: boolean; stepIndex: number }) {
  return (
    <div className="relative grid place-items-center" style={{ width: 360, height: 240 }}>
      {/* base */}
      <div
        className="absolute bottom-0 h-10 w-60 rounded-b-xl"
        style={{
          background: "linear-gradient(180deg, oklch(0.30 0.02 200), oklch(0.15 0.02 200))",
          boxShadow: "0 20px 40px oklch(0 0 0 / 0.7)",
        }}
      />
      {/* arm */}
      <div
        className="absolute bottom-10 right-1/2 h-32 w-10 translate-x-12 rounded-t-xl"
        style={{
          background: "linear-gradient(180deg, oklch(0.28 0.02 200), oklch(0.20 0.02 200))",
        }}
      />
      {/* eyepiece tube */}
      <div
        className="absolute right-1/2 top-2 h-20 w-12 translate-x-16 rounded-t-xl border border-border"
        style={{
          background: "linear-gradient(180deg, oklch(0.34 0.02 200), oklch(0.22 0.02 200))",
        }}
      >
        <div className="mx-auto mt-1 size-8 rounded-full border border-primary/40 bg-black" />
      </div>
      {/* objective turret */}
      <div
        className="absolute bottom-24 right-1/2 size-16 translate-x-14 rounded-full border-4 border-border"
        style={{
          background: "radial-gradient(circle, oklch(0.28 0.02 200), oklch(0.14 0.02 200))",
          boxShadow: "inset 0 0 20px black",
        }}
      >
        {[40, 100, 400, 1000].map((mag, i) => (
          <div
            key={mag}
            className={`absolute size-3 rounded-full ${stepIndex >= i ? "bg-primary" : "bg-secondary"}`}
            style={{
              top: `${50 + 35 * Math.sin((i / 4) * Math.PI * 2)}%`,
              left: `${50 + 35 * Math.cos((i / 4) * Math.PI * 2)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
      {/* stage + slide + view */}
      <div
        className="absolute bottom-14 right-1/2 h-3 w-44 translate-x-10 bg-secondary"
        style={{ boxShadow: "0 2px 8px black" }}
      />
      {/* Eyepiece view circle */}
      <div
        className="absolute left-6 top-6 size-32 rounded-full border-4 border-border bg-black"
        style={{ boxShadow: "0 0 30px oklch(0.78 0.18 165 / 0.4)" }}
      >
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-900/50 to-transparent">
          {(running || done) && (
            <div className="absolute inset-0 grid grid-cols-4 place-items-center gap-1 p-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <span
                  key={i}
                  className="size-2 rounded-full"
                  style={{
                    background: done ? "oklch(0.55 0.22 300)" : "oklch(0.70 0.15 320 / 0.7)",
                    boxShadow: "0 0 4px currentColor",
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-1 text-center text-[9px] text-primary">{done ? "1000x ✓" : running ? "تركيز…" : "ضع الشريحة"}</div>
      </div>
      <Hotspot active={stepIndex === 0} label="ضع الشريحة" style={{ left: "60%", top: "65%" }} />
      <Hotspot active={stepIndex === 1} label="بدّل العدسة" style={{ left: "65%", top: "50%" }} />
      <Hotspot active={stepIndex >= 2} label="اضبط التركيز" style={{ left: "75%", top: "55%" }} />
    </div>
  );
}
