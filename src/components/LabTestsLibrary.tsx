import { useMemo, useState } from "react";
import { LAB_TESTS, LAB_TEST_CATEGORIES, type LabTest, type LabTestCategory } from "@/lib/labTests";

export function LabTestsLibrary({ onBack }: { onBack: () => void }) {
  const [cat, setCat] = useState<LabTestCategory | "all">("all");
  const [selected, setSelected] = useState<LabTest | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return LAB_TESTS.filter((t) => {
      const okCat = cat === "all" ? true : t.category === cat;
      const okQ =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.english.toLowerCase().includes(query) ||
        t.purpose.toLowerCase().includes(query);
      return okCat && okQ;
    });
  }, [cat, q]);

  return (
    <div dir="rtl" className="min-h-screen bg-background px-4 py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
          >
            ← رجوع
          </button>
          <div className="text-right">
            <div className="text-xs tracking-widest text-primary">LABORATORY REFERENCE</div>
            <h1 className="text-2xl font-black md:text-3xl">🧫 مكتبة التحاليل والأوساط الزراعية</h1>
          </div>
        </div>

        <p className="mb-4 rounded-xl border border-border bg-card/60 p-3 text-sm text-muted-foreground">
          مرجع تفاعلي شامل لكل تحليل مخبري: الأوساط الزراعية، الاختبارات الكيميائية الحيوية،
          حساسية المضادات (Disk Diffusion / VITEK)، والفحوص الجزيئية (PCR mecA لكشف MRSA وغيرها).
        </p>

        <div className="mb-4 grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث… (مثال: Coagulase، Blood Agar، mecA)"
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
          />
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="الكل" icon="🗂" />
          {LAB_TEST_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
              label={c.label}
              icon={c.icon}
            />
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="group rounded-2xl border border-border bg-card p-4 text-right transition-all hover:-translate-y-0.5 hover:border-primary"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-3xl">{t.icon}</div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {catLabel(t.category)}
                </span>
              </div>
              <div className="mt-2 text-base font-black">{t.name}</div>
              <div className="text-xs italic text-muted-foreground">{t.english}</div>
              <div className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.purpose}</div>
              <div className="mt-2 text-[10px] text-muted-foreground">⏱ {t.timeToResult}</div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
              لا توجد نتائج مطابقة.
            </div>
          )}
        </div>
      </div>

      {selected && <TestModal test={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function catLabel(c: LabTestCategory) {
  return LAB_TEST_CATEGORIES.find((x) => x.id === c)?.label ?? c;
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/50"
      }`}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </button>
  );
}

function TestModal({ test, onClose }: { test: LabTest; onClose: () => void }) {
  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="text-5xl">{test.icon}</div>
            <div>
              <div className="text-xs font-bold tracking-widest text-primary">
                {catLabel(test.category)}
              </div>
              <h2 className="text-xl font-black md:text-2xl">{test.name}</h2>
              <div className="text-sm italic text-muted-foreground">{test.english}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-background px-3 py-1 text-sm hover:bg-accent"
          >
            ✕
          </button>
        </div>

        <Field title="🎯 الغرض" text={test.purpose} />
        <Field title="🧠 المبدأ" text={test.principle} />

        <div className="mt-3 rounded-xl border border-border bg-background/50 p-3">
          <div className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">
            🧾 خطوات العمل
          </div>
          <ol className="list-inside list-decimal space-y-1 text-sm">
            {test.procedure.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-background/50 p-3">
          <div className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">
            📊 التفسير
          </div>
          <ul className="space-y-2 text-sm">
            {test.interpretation.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-2"
              >
                <span
                  className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{ background: r.color ?? "#64748b" }}
                />
                <div>
                  <div className="font-bold">{r.label}</div>
                  <div className="text-xs text-muted-foreground">{r.meaning}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {test.targets && test.targets.length > 0 && (
          <div className="mt-3 rounded-xl border border-border bg-background/50 p-3">
            <div className="mb-2 text-xs font-bold tracking-widest text-muted-foreground">
              🦠 المسببات المستهدفة
            </div>
            <div className="flex flex-wrap gap-2">
              {test.targets.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/50 p-3 text-sm">
            <div className="text-xs font-bold tracking-widest text-muted-foreground">⏱ زمن النتيجة</div>
            <div className="mt-1">{test.timeToResult}</div>
          </div>
          {test.qc && (
            <div className="rounded-xl border border-border bg-background/50 p-3 text-sm">
              <div className="text-xs font-bold tracking-widest text-muted-foreground">✅ ضبط الجودة</div>
              <div className="mt-1">{test.qc}</div>
            </div>
          )}
        </div>

        {test.notes && (
          <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
            <div className="mb-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              ملاحظات مهمة
            </div>
            <div>{test.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-3 rounded-xl border border-border bg-background/50 p-3">
      <div className="mb-1 text-xs font-bold tracking-widest text-muted-foreground">{title}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
}
