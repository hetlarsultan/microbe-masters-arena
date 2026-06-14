// Visual sample/reagent cards used by the Manual Mode of the simulator.
// Each card is rendered as an "image-like" gradient tile with an emoji glyph.

export type SampleCard = {
  id: string;
  label: string;
  emoji: string;
  /** CSS background — looks like a tinted photo of the item */
  bg: string;
  /** Short hint shown under the label */
  hint?: string;
};

/** The patient sample shown above the bench — depends on the lab branch / id. */
export function getPatientSample(instrumentId: string, branch: string): SampleCard {
  const map: Record<string, SampleCard> = {
    pcr: { id: "swab", label: "مسحة بلعومية", emoji: "🧫", bg: "linear-gradient(135deg,#1e3a5f,#0b1d33)", hint: "Nasopharyngeal swab" },
    elisa: { id: "serum", label: "أنبوب مصل المريض", emoji: "🩸", bg: "linear-gradient(135deg,#7a1f1f,#3a0d0d)", hint: "Yellow-top SST tube" },
    elisa_washer: { id: "plate", label: "لوحة 96-well", emoji: "🟦", bg: "linear-gradient(135deg,#1f4d7a,#0b2540)", hint: "ELISA microplate" },
    gel: { id: "amplicon", label: "ناتج PCR", emoji: "🧬", bg: "linear-gradient(135deg,#143d2e,#0a1f18)", hint: "Amplicon tube" },
    gram: { id: "slide", label: "شريحة لطاخة", emoji: "🔬", bg: "linear-gradient(135deg,#3d2a5c,#1c1230)", hint: "Heat-fixed smear" },
    culture: { id: "swab2", label: "مسحة جرحية", emoji: "🦠", bg: "linear-gradient(135deg,#5c2a2a,#2a1010)", hint: "Wound swab" },
    flow: { id: "edta", label: "دم EDTA", emoji: "🩸", bg: "linear-gradient(135deg,#4a1130,#1f0518)", hint: "Purple-top EDTA" },
    microscope: { id: "slide2", label: "شريحة مصبوغة", emoji: "🔬", bg: "linear-gradient(135deg,#1c2b4a,#0a1224)", hint: "Stained slide" },
    autoclave: { id: "tools", label: "أدوات للتعقيم", emoji: "🧰", bg: "linear-gradient(135deg,#5a4a1f,#2a2008)", hint: "Wrapped instruments" },
    biosafety: { id: "ppe", label: "معدات الحماية", emoji: "🥽", bg: "linear-gradient(135deg,#1f4a4a,#0a2020)", hint: "PPE kit" },
    centrifuge: { id: "tubes", label: "أنابيب دم", emoji: "🧪", bg: "linear-gradient(135deg,#7a1f1f,#3a0d0d)", hint: "Whole-blood tubes" },
    sequencer: { id: "dna", label: "تفاعل التسلسل", emoji: "📜", bg: "linear-gradient(135deg,#143d2e,#0a1f18)", hint: "Sanger reaction" },
    crispr: { id: "cells", label: "خلايا مستهدفة", emoji: "🧫", bg: "linear-gradient(135deg,#3d1f5c,#1a0d30)", hint: "Target cells" },
    spectrophotometer: { id: "dnatube", label: "عينة DNA", emoji: "🧬", bg: "linear-gradient(135deg,#1f4a5c,#0a1f30)", hint: "Extracted DNA" },
    rna_extraction: { id: "viral", label: "عينة فيروسية", emoji: "🦠", bg: "linear-gradient(135deg,#5c1f3d,#2a0d1c)", hint: "Viral lysate" },
    fluorescence: { id: "fluor", label: "شريحة فلورية", emoji: "💡", bg: "linear-gradient(135deg,#1f3d5c,#0a1c30)", hint: "Fluorescent slide" },
    stool_exam: { id: "stool", label: "عينة براز", emoji: "🪱", bg: "linear-gradient(135deg,#3d2a1f,#1c1208)", hint: "Stool container" },
    sabouraud: { id: "skin", label: "كشاطة جلد", emoji: "🍄", bg: "linear-gradient(135deg,#4a3d1f,#1f1808)", hint: "Skin scraping" },
  };
  if (map[instrumentId]) return map[instrumentId];
  return { id: "generic", label: "عينة المريض", emoji: "🧪", bg: "linear-gradient(135deg,#1f2937,#0b1220)", hint: branch };
}

/** Generic distractor pool — items that LOOK plausible but are wrong for the step. */
const DISTRACTORS: SampleCard[] = [
  { id: "eth", label: "إيثانول 70%", emoji: "🧴", bg: "linear-gradient(135deg,#1f4a4a,#0a2020)" },
  { id: "saline", label: "محلول ملحي", emoji: "💧", bg: "linear-gradient(135deg,#1f3d5c,#0a1c30)" },
  { id: "iodine", label: "محلول لوغول", emoji: "🟤", bg: "linear-gradient(135deg,#5c3d1f,#2a1c08)" },
  { id: "h2so4", label: "حمض الإيقاف H₂SO₄", emoji: "⚗️", bg: "linear-gradient(135deg,#5c1f3d,#2a0d1c)" },
  { id: "agarose", label: "هلام Agarose", emoji: "🟫", bg: "linear-gradient(135deg,#3d2a1f,#1c1208)" },
  { id: "ladder", label: "DNA Ladder", emoji: "🪜", bg: "linear-gradient(135deg,#1f3d2a,#0a1c14)" },
  { id: "primer", label: "Primers + dNTPs", emoji: "🧬", bg: "linear-gradient(135deg,#1f2a5c,#0a0f2a)" },
  { id: "tmb", label: "ركيزة TMB", emoji: "🟦", bg: "linear-gradient(135deg,#1f4d7a,#0b2540)" },
  { id: "wash", label: "Wash Buffer", emoji: "🚿", bg: "linear-gradient(135deg,#2a4a5c,#0f1f30)" },
  { id: "tip", label: "Tip + ماصة", emoji: "💉", bg: "linear-gradient(135deg,#3d3d3d,#1a1a1a)" },
  { id: "loop", label: "حلقة تلقيح", emoji: "🪡", bg: "linear-gradient(135deg,#4a3d1f,#1f1808)" },
  { id: "bunsen", label: "لهب بنزن", emoji: "🔥", bg: "linear-gradient(135deg,#5c2a1f,#2a100a)" },
  { id: "oil", label: "زيت الغمر", emoji: "🛢", bg: "linear-gradient(135deg,#3d3d1f,#1c1c08)" },
  { id: "filter", label: "فلتر ضوئي", emoji: "🔆", bg: "linear-gradient(135deg,#3d1f5c,#1c0c2a)" },
  { id: "cas9", label: "Cas9 + gRNA", emoji: "✂️", bg: "linear-gradient(135deg,#1f5c4a,#0a2a20)" },
  { id: "lysis", label: "Lysis Buffer", emoji: "🧪", bg: "linear-gradient(135deg,#5c4a1f,#2a2008)" },
];

/** Map a step.action / step.title to its "ideal" card glyph so the correct option looks distinct. */
function cardForStep(actionLabel: string, title: string, fallback: string): SampleCard {
  const t = (actionLabel + " " + title).toLowerCase();
  const pick = (id: string, label: string, emoji: string, bg: string): SampleCard => ({ id, label, emoji, bg });
  if (t.includes("ppe") || t.includes("الحماية") || t.includes("ارتدِ")) return pick("ppe", "معدات الحماية", "🥽", "linear-gradient(135deg,#1f4a4a,#0a2020)");
  if (t.includes("عقّم") || t.includes("تعقيم") || t.includes("إيثانول")) return pick("eth", "إيثانول 70%", "🧴", "linear-gradient(135deg,#1f4a4a,#0a2020)");
  if (t.includes("استخلاص") || t.includes("lysis") || t.includes("كسّر")) return pick("lysis", "Lysis Buffer", "🧪", "linear-gradient(135deg,#5c4a1f,#2a2008)");
  if (t.includes("master") || t.includes("primer") || t.includes("dntp") || t.includes("الخليط")) return pick("primer", "Master Mix", "🧬", "linear-gradient(135deg,#1f2a5c,#0a0f2a)");
  if (t.includes("loaded") || t.includes("لوحة") || t.includes("96")) return pick("plate", "لوحة 96", "🟦", "linear-gradient(135deg,#1f4d7a,#0b2540)");
  if (t.includes("غسيل") || t.includes("اغسل") || t.includes("wash") || t.includes("اشطف")) return pick("wash", "Wash Buffer", "🚿", "linear-gradient(135deg,#2a4a5c,#0f1f30)");
  if (t.includes("tmb") || t.includes("ركيزة")) return pick("tmb", "ركيزة TMB", "🟦", "linear-gradient(135deg,#1f4d7a,#0b2540)");
  if (t.includes("h₂so₄") || t.includes("الإيقاف") || t.includes("أوقف")) return pick("h2so4", "H₂SO₄ Stop", "⚗️", "linear-gradient(135deg,#5c1f3d,#2a0d1c)");
  if (t.includes("agar") || t.includes("هلام") || t.includes("جل")) return pick("agarose", "Agarose", "🟫", "linear-gradient(135deg,#3d2a1f,#1c1208)");
  if (t.includes("ladder")) return pick("ladder", "DNA Ladder", "🪜", "linear-gradient(135deg,#1f3d2a,#0a1c14)");
  if (t.includes("uv") || t.includes("صوّر")) return pick("uv", "UV Transilluminator", "🔆", "linear-gradient(135deg,#3d1f5c,#1c0c2a)");
  if (t.includes("لهب") || t.includes("ثبّت")) return pick("bunsen", "لهب بنزن", "🔥", "linear-gradient(135deg,#5c2a1f,#2a100a)");
  if (t.includes("crystal") || t.includes("بنفسجي")) return pick("cv", "Crystal Violet", "🟣", "linear-gradient(135deg,#3d1f5c,#1c0c2a)");
  if (t.includes("iod") || t.includes("اليود") || t.includes("لوغول")) return pick("iodine", "اليود/لوغول", "🟤", "linear-gradient(135deg,#5c3d1f,#2a1c08)");
  if (t.includes("الكحول")) return pick("alc", "Decolorizer", "🧴", "linear-gradient(135deg,#1f4a4a,#0a2020)");
  if (t.includes("safranin") || t.includes("سفرانين")) return pick("saf", "Safranin", "🌸", "linear-gradient(135deg,#5c1f3d,#2a0d1c)");
  if (t.includes("زيت")) return pick("oil", "زيت الغمر", "🛢", "linear-gradient(135deg,#3d3d1f,#1c1c08)");
  if (t.includes("حلقة")) return pick("loop", "حلقة تلقيح", "🪡", "linear-gradient(135deg,#4a3d1f,#1f1808)");
  if (t.includes("حضن") || t.includes("الحاضنة")) return pick("incu", "حاضنة 37°C", "🌡", "linear-gradient(135deg,#5c2a1f,#2a100a)");
  if (t.includes("طرد") || t.includes("centrifuge") || t.includes("وازن")) return pick("cent", "طرد مركزي", "🌀", "linear-gradient(135deg,#1f3d5c,#0a1c30)");
  if (t.includes("cas9") || t.includes("crispr") || t.includes("rnp")) return pick("cas9", "Cas9 + gRNA", "✂️", "linear-gradient(135deg,#1f5c4a,#0a2a20)");
  if (t.includes("filter") || t.includes("فلتر")) return pick("filter", "فلتر ضوئي", "🔆", "linear-gradient(135deg,#3d1f5c,#1c0c2a)");
  if (t.includes("blank")) return pick("blank", "Blank Buffer", "💧", "linear-gradient(135deg,#1f3d5c,#0a1c30)");
  if (t.includes("اقرأ") || t.includes("قراءة") || t.includes("النتيجة") || t.includes("اعرض")) return pick("read", "قراءة الجهاز", "📈", "linear-gradient(135deg,#1f3d5c,#0a1c30)");
  if (t.includes("ابدأ") || t.includes("شغّل") || t.includes("الدورات") || t.includes("الترحيل")) return pick("start", "تشغيل الدورة", "▶️", "linear-gradient(135deg,#1f5c4a,#0a2a20)");
  return { id: "step", label: actionLabel || title, emoji: "🧪", bg: fallback };
}

/** Build 4 shuffled cards for a step: 1 correct + 3 distractors. */
export function buildStepChoices(
  instrumentId: string,
  actionLabel: string,
  title: string,
  stepIndex: number
): { correctId: string; cards: SampleCard[] } {
  const correct = cardForStep(actionLabel, title, "linear-gradient(135deg,#1f2937,#0b1220)");
  // Pick 3 distractors that differ from correct.id and rotate by step index for variety
  const pool = DISTRACTORS.filter((d) => d.id !== correct.id);
  const start = (stepIndex * 3) % pool.length;
  const picks: SampleCard[] = [];
  for (let i = 0; i < 3 && i < pool.length; i++) {
    picks.push(pool[(start + i * 2) % pool.length]);
  }
  const all = [correct, ...picks];
  // Deterministic shuffle based on stepIndex
  const shuffled = all
    .map((c, i) => ({ c, k: (i + 1) * 7 + stepIndex * 13 }))
    .sort((a, b) => (a.k % 11) - (b.k % 11))
    .map((x) => x.c);
  // ignore instrumentId for now (could specialize later)
  void instrumentId;
  return { correctId: correct.id, cards: shuffled };
}
