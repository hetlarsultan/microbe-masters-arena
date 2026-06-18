import type { PathogenVisual } from "@/lib/pathogenVisuals";

export function PathogenScene({ v }: { v: PathogenVisual }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-background to-card">
      {/* Microscope-style stage */}
      <div className="relative h-56 w-full overflow-hidden bg-black">
        <Scene scene={v.scene} />
        {/* Microscope vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.85) 75%)",
          }}
        />
        {/* Reticle crosshair */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="size-40 rounded-full border border-white/20" />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-white/10" />
        <div className="pointer-events-none absolute top-1/2 left-0 h-px w-full bg-white/10" />
        {/* Scale bar */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] font-mono text-white/80">
          <div className="h-1 w-10 bg-white/80" />
          <span>10 µm · 1000x</span>
        </div>
        <div className="absolute right-3 top-3 rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-mono text-white/90">
          OBJ 100x · OIL
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold tracking-widest text-primary">
              MICROSCOPIC / ANALYTICAL FINDING
            </div>
            <h4 className="mt-0.5 text-lg font-black">
              <span className="me-2">{v.emoji}</span>
              <i>{v.scientificName}</i>
            </h4>
            <div className="text-xs text-muted-foreground">{v.arabicName}</div>
          </div>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase text-primary">
            {v.category}
          </span>
        </div>
        <div className="grid gap-1.5 text-xs">
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
            <span className="font-bold text-foreground/80">المورفولوجيا: </span>
            <span className="text-muted-foreground">{v.morphology}</span>
          </div>
          <div className="rounded-lg border border-border bg-background/40 px-3 py-2">
            <span className="font-bold text-foreground/80">المشاهدة: </span>
            <span className="text-muted-foreground">{v.microscopy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene({ scene }: { scene: PathogenVisual["scene"] }) {
  switch (scene) {
    case "gram-cocci-clusters":
      return <GramCocciClusters />;
    case "gram-cocci-chains":
      return <GramCocciChains />;
    case "gram-bacilli":
      return <GramBacilli />;
    case "acid-fast":
      return <AcidFast />;
    case "virus-particles":
      return <VirusParticles />;
    case "yeast-hyphae":
      return <YeastHyphae />;
    case "parasite-cyst":
      return <ParasiteCyst />;
    case "gel-bands":
      return <GelBands />;
    case "pcr-curve":
      return <PCRCurve />;
    case "elisa-wells":
      return <ElisaWells />;
    case "flow-dotplot":
      return <FlowDotPlot />;
    case "sequence":
      return <Sequence />;
    case "crispr":
      return <Crispr />;
    case "blood-cells":
      return <BloodCells />;
    case "chem-spectrum":
      return <Spectrum />;
    case "colonies":
      return <Colonies />;
  }
}

/* ============== SVG scenes ============== */

function field(bg: string) {
  return (
    <rect width="400" height="240" fill={bg} />
  );
}

function GramCocciClusters() {
  // grape-like purple clusters on pink background
  const clusters = [
    { cx: 120, cy: 110 }, { cx: 240, cy: 80 }, { cx: 300, cy: 170 },
    { cx: 90, cy: 200 }, { cx: 200, cy: 160 },
  ];
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#f5d6e0")}
      {clusters.map((c, i) => (
        <g key={i} transform={`translate(${c.cx}, ${c.cy})`}>
          {Array.from({ length: 12 }).map((_, j) => {
            const a = (j / 12) * Math.PI * 2;
            const r = 14 + (j % 3) * 4;
            return <circle key={j} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={6.5} fill="#5b2a86" stroke="#2c0f4a" strokeWidth="0.6" />;
          })}
        </g>
      ))}
    </svg>
  );
}

function GramCocciChains() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#f5d6e0")}
      {[40, 110, 180].map((y, i) => (
        <g key={i}>
          {Array.from({ length: 14 }).map((_, j) => (
            <circle key={j} cx={20 + j * 25} cy={60 + y * 0.3 + Math.sin(j) * 6} r={7} fill="#5b2a86" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function GramBacilli() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#fbe3ec")}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 30 + (i * 47) % 360;
        const y = 30 + ((i * 71) % 180);
        const rot = (i * 37) % 180;
        return (
          <rect key={i} x={x} y={y} width="42" height="12" rx="6" fill="#e91e63"
            transform={`rotate(${rot} ${x + 21} ${y + 6})`} />
        );
      })}
    </svg>
  );
}

function AcidFast() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#1e3a8a")}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 20 + (i * 53) % 360;
        const y = 20 + ((i * 67) % 190);
        const rot = (i * 41) % 180;
        return (
          <rect key={i} x={x} y={y} width="36" height="9" rx="4" fill="#ef4444"
            transform={`rotate(${rot} ${x + 18} ${y + 4})`} />
        );
      })}
    </svg>
  );
}

function VirusParticles() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#0b132b")}
      {[{ cx: 120, cy: 110 }, { cx: 260, cy: 140 }, { cx: 320, cy: 70 }].map((c, i) => (
        <g key={i} transform={`translate(${c.cx} ${c.cy})`}>
          <circle r="34" fill="#dc2626" />
          {Array.from({ length: 16 }).map((_, j) => {
            const a = (j / 16) * Math.PI * 2;
            return (
              <g key={j} transform={`rotate(${(a * 180) / Math.PI})`}>
                <rect x={32} y={-2} width="14" height="4" fill="#fbbf24" />
                <circle cx={50} cy={0} r="4" fill="#fbbf24" />
              </g>
            );
          })}
          <circle r="14" fill="#7f1d1d" />
        </g>
      ))}
    </svg>
  );
}

function YeastHyphae() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#fff7e6")}
      {/* hyphae */}
      <path d="M20,180 C100,160 160,120 240,140 S360,80 390,60" stroke="#a16207" strokeWidth="6" fill="none" />
      <path d="M40,60 C120,100 200,80 280,120 S370,180 390,200" stroke="#a16207" strokeWidth="6" fill="none" />
      {/* budding yeast */}
      {[{ cx: 90, cy: 80 }, { cx: 180, cy: 170 }, { cx: 290, cy: 90 }, { cx: 330, cy: 200 }].map((c, i) => (
        <g key={i} transform={`translate(${c.cx} ${c.cy})`}>
          <ellipse rx="18" ry="14" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
          <ellipse cx="18" cy="-10" rx="9" ry="7" fill="#fcd34d" stroke="#92400e" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

function ParasiteCyst() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#f0fdf4")}
      {[{ cx: 130, cy: 110 }, { cx: 280, cy: 140 }].map((c, i) => (
        <g key={i} transform={`translate(${c.cx} ${c.cy})`}>
          <ellipse rx="60" ry="42" fill="#bbf7d0" stroke="#166534" strokeWidth="2.5" />
          {[[-22, -12], [22, -12], [-22, 14], [22, 14]].map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r="9" fill="#14532d" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function GelBands() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#0a0a0a")}
      {/* lanes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={30 + i * 60} y={20} width="40" height="200" fill="#111827" stroke="#1f2937" />
      ))}
      {/* bands */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x={30 + i * 60} y={70 + (i % 3) * 8} width="40" height="6" fill="#fbbf24" opacity="0.85" />
          <rect x={30 + i * 60} y={120} width="40" height="9" fill="#f59e0b" />
          <rect x={30 + i * 60} y={170 + (i % 2) * 6} width="40" height="5" fill="#fde68a" opacity="0.7" />
        </g>
      ))}
      <text x="10" y="240" fill="#9ca3af" fontSize="10" fontFamily="monospace">M  1  2  3  4  5</text>
    </svg>
  );
}

function PCRCurve() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#020617")}
      {/* axes */}
      <line x1="40" y1="210" x2="380" y2="210" stroke="#475569" />
      <line x1="40" y1="20" x2="40" y2="210" stroke="#475569" />
      {/* threshold */}
      <line x1="40" y1="150" x2="380" y2="150" stroke="#f59e0b" strokeDasharray="4 4" />
      {/* sigmoid curves */}
      {["#06b6d4", "#22c55e", "#a855f7"].map((c, i) => {
        const pts = Array.from({ length: 40 }).map((_, j) => {
          const x = 40 + j * 8.5;
          const t = (j - (10 + i * 4)) / 4;
          const y = 210 - 180 / (1 + Math.exp(-t));
          return `${x},${y}`;
        });
        return <polyline key={i} points={pts.join(" ")} fill="none" stroke={c} strokeWidth="2.5" />;
      })}
      <text x="48" y="142" fill="#f59e0b" fontSize="10" fontFamily="monospace">Threshold</text>
      <text x="320" y="232" fill="#94a3b8" fontSize="10" fontFamily="monospace">Cycle</text>
    </svg>
  );
}

function ElisaWells() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#e5e7eb")}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 12 }).map((_, c) => {
          const intensity = (r + c) % 4;
          const colors = ["#fef3c7", "#fde68a", "#f59e0b", "#b45309"];
          return (
            <circle
              key={`${r}-${c}`}
              cx={30 + c * 30}
              cy={20 + r * 26}
              r="11"
              fill={colors[intensity]}
              stroke="#9ca3af"
              strokeWidth="1"
            />
          );
        })
      )}
    </svg>
  );
}

function FlowDotPlot() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#0f172a")}
      <line x1="40" y1="210" x2="380" y2="210" stroke="#475569" />
      <line x1="40" y1="20" x2="40" y2="210" stroke="#475569" />
      {/* clusters */}
      {Array.from({ length: 120 }).map((_, i) => {
        const cluster = i % 3;
        const cx = cluster === 0 ? 120 : cluster === 1 ? 250 : 320;
        const cy = cluster === 0 ? 160 : cluster === 1 ? 90 : 60;
        const x = cx + (Math.random() - 0.5) * 60;
        const y = cy + (Math.random() - 0.5) * 50;
        const color = cluster === 0 ? "#22d3ee" : cluster === 1 ? "#f43f5e" : "#a3e635";
        return <circle key={i} cx={x} cy={y} r="2.2" fill={color} />;
      })}
      <text x="48" y="35" fill="#94a3b8" fontSize="10" fontFamily="monospace">CD4+</text>
      <text x="320" y="232" fill="#94a3b8" fontSize="10" fontFamily="monospace">CD3</text>
    </svg>
  );
}

function Sequence() {
  const letters = "ATGCGTACGTTAGCATCGATCGTACGATGCTAGCTAGCATCGATCG";
  const palette: Record<string, string> = { A: "#22c55e", T: "#ef4444", G: "#facc15", C: "#3b82f6" };
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#020617")}
      {letters.split("").map((ch, i) => (
        <text
          key={i}
          x={10 + (i % 23) * 17}
          y={50 + Math.floor(i / 23) * 26}
          fill={palette[ch]}
          fontSize="20"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {ch}
        </text>
      ))}
      {/* chromatogram peaks */}
      {["#22c55e", "#ef4444", "#facc15", "#3b82f6"].map((c, i) => {
        const pts = Array.from({ length: 50 }).map((_, j) => {
          const x = 10 + j * 8;
          const y = 200 - Math.abs(Math.sin(j * 0.4 + i)) * 30;
          return `${x},${y}`;
        });
        return <polyline key={i} points={pts.join(" ")} fill="none" stroke={c} strokeWidth="1.5" opacity="0.8" />;
      })}
    </svg>
  );
}

function Crispr() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#1e1b4b")}
      {/* DNA helix */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = 30 + i * 12;
        const y1 = 120 + Math.sin(i * 0.5) * 30;
        const y2 = 120 - Math.sin(i * 0.5) * 30;
        return (
          <g key={i}>
            <line x1={x} y1={y1} x2={x} y2={y2} stroke="#a78bfa" strokeWidth="1" />
            <circle cx={x} cy={y1} r="3" fill="#22d3ee" />
            <circle cx={x} cy={y2} r="3" fill="#f472b6" />
          </g>
        );
      })}
      {/* scissors */}
      <g transform="translate(200 60)">
        <text fontSize="48" fill="#facc15">✂️</text>
      </g>
      {/* Cas9 blob */}
      <ellipse cx="220" cy="120" rx="40" ry="32" fill="#facc15" opacity="0.4" stroke="#facc15" />
      <text x="200" y="124" fill="#1e1b4b" fontSize="12" fontWeight="bold" fontFamily="monospace">Cas9</text>
    </svg>
  );
}

function BloodCells() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#fef2f2")}
      {Array.from({ length: 35 }).map((_, i) => {
        const x = 20 + (i * 53) % 360;
        const y = 20 + ((i * 71) % 200);
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <circle r="14" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
            <circle r="6" fill="#fca5a5" />
          </g>
        );
      })}
      {/* a white cell */}
      <g transform="translate(220 130)">
        <circle r="22" fill="#f9fafb" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M-10,-4 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0 M-4,8 a6,6 0 1,0 12,0" fill="#7c3aed" />
      </g>
    </svg>
  );
}

function Spectrum() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {field("#0f172a")}
      <line x1="40" y1="210" x2="380" y2="210" stroke="#475569" />
      <line x1="40" y1="20" x2="40" y2="210" stroke="#475569" />
      {(() => {
        const pts = Array.from({ length: 100 }).map((_, j) => {
          const x = 40 + j * 3.4;
          const peak = Math.exp(-Math.pow((j - 40) / 10, 2)) * 160;
          const peak2 = Math.exp(-Math.pow((j - 70) / 14, 2)) * 80;
          const y = 210 - peak - peak2 - 10;
          return `${x},${y}`;
        });
        return <polyline points={pts.join(" ")} fill="none" stroke="#22d3ee" strokeWidth="2.5" />;
      })()}
      <text x="120" y="50" fill="#22d3ee" fontSize="10" fontFamily="monospace">260 nm — DNA</text>
      <text x="220" y="120" fill="#94a3b8" fontSize="10" fontFamily="monospace">280 nm — Protein</text>
    </svg>
  );
}

function Colonies() {
  return (
    <svg viewBox="0 0 400 240" className="absolute inset-0 size-full">
      {/* plate */}
      <circle cx="200" cy="120" r="115" fill="#7f1d1d" />
      <circle cx="200" cy="120" r="108" fill="#991b1b" />
      {Array.from({ length: 40 }).map((_, i) => {
        const a = (i * 137.5) * Math.PI / 180;
        const r = 20 + (i * 7) % 80;
        const x = 200 + Math.cos(a) * r;
        const y = 120 + Math.sin(a) * r;
        return <circle key={i} cx={x} cy={y} r={3 + (i % 4)} fill="#fde047" stroke="#a16207" strokeWidth="0.5" />;
      })}
    </svg>
  );
}
