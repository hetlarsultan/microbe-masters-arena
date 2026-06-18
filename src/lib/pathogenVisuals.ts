// Visual diagnostic illustrations shown after instrument run completion.
// Each entry represents the pathogen / finding visualized as if seen under
// the microscope / on the gel / on the assay plate.

export type PathogenCategory =
  | "bacteria"
  | "virus"
  | "fungus"
  | "parasite"
  | "immune"
  | "genetic"
  | "molecular"
  | "cell"
  | "biochem";

export interface PathogenVisual {
  category: PathogenCategory;
  scientificName: string; // e.g. "Staphylococcus aureus"
  arabicName: string;     // e.g. "المكورة العنقودية الذهبية"
  emoji: string;          // big symbol
  morphology: string;     // short morphology description
  microscopy: string;     // what you would see
  color: string;          // tailwind hue token e.g. "violet"
  // SVG-style mini scene description
  scene:
    | "gram-cocci-clusters"   // grape-like purple cocci
    | "gram-cocci-chains"     // chains of cocci
    | "gram-bacilli"          // rods
    | "acid-fast"             // red rods on blue
    | "virus-particles"       // spiked spheres
    | "yeast-hyphae"          // budding yeast + hyphae
    | "parasite-cyst"         // multi-nucleated cysts
    | "gel-bands"             // electrophoresis bands
    | "pcr-curve"             // amplification curves
    | "elisa-wells"           // 96-well plate
    | "flow-dotplot"          // flow cytometry dots
    | "sequence"              // DNA letters
    | "crispr"                // scissors + DNA
    | "blood-cells"           // RBC field
    | "chem-spectrum"         // spectrophotometer trace
    | "colonies";             // culture plate
}

// keyed by instrument.id
export const PATHOGEN_VISUALS: Record<string, PathogenVisual> = {
  pcr: {
    category: "virus",
    scientificName: "SARS-CoV-2 / Generic Viral RNA",
    arabicName: "كشف الحمض النووي الفيروسي",
    emoji: "🧬",
    morphology: "منحنى تضخيف Real-time PCR — Ct = 24.6",
    microscopy: "إشارة فلورية صاعدة فوق العتبة",
    color: "fuchsia",
    scene: "pcr-curve",
  },
  elisa: {
    category: "immune",
    scientificName: "IgG / IgM Antibodies",
    arabicName: "أجسام مضادة في المصل",
    emoji: "🟨",
    morphology: "آبار صفراء داكنة — OD = 1.42 (Cut-off 0.3)",
    microscopy: "تفاعل لوني إنزيمي إيجابي",
    color: "amber",
    scene: "elisa-wells",
  },
  "gel-electrophoresis": {
    category: "molecular",
    scientificName: "DNA Amplicon 450 bp",
    arabicName: "ناتج تضخيف DNA",
    emoji: "🟦",
    morphology: "حزمة واضحة عند 450 زوج قاعدي",
    microscopy: "هلام Agarose 1.5% — صبغة Ethidium",
    color: "cyan",
    scene: "gel-bands",
  },
  "gram-stain": {
    category: "bacteria",
    scientificName: "Staphylococcus aureus",
    arabicName: "المكورة العنقودية الذهبية",
    emoji: "🟣",
    morphology: "Gram +ve Cocci in clusters (عناقيد عنبية)",
    microscopy: "كريات بنفسجية متجمعة عند تكبير 1000x",
    color: "violet",
    scene: "gram-cocci-clusters",
  },
  "blood-agar": {
    category: "bacteria",
    scientificName: "Staphylococcus aureus",
    arabicName: "مستعمرات بكتيرية على آجار الدم",
    emoji: "🟡",
    morphology: "مستعمرات ذهبية + β-Hemolysis",
    microscopy: "هالة شفافة كاملة حول المستعمرة",
    color: "amber",
    scene: "colonies",
  },
  "flow-cytometer": {
    category: "cell",
    scientificName: "CD4+ T-Lymphocytes",
    arabicName: "تعداد خلايا T المساعدة",
    emoji: "🔵",
    morphology: "CD4 = 320 cell/µL (منخفض)",
    microscopy: "Dot-plot CD3 vs CD4 — populations منفصلة",
    color: "sky",
    scene: "flow-dotplot",
  },
  microscope: {
    category: "bacteria",
    scientificName: "Bacterial Morphology",
    arabicName: "فحص بكتيري عام",
    emoji: "🔬",
    morphology: "عصيات/كرات واضحة تحت 1000x",
    microscopy: "زيت غمر، إضاءة كولر متطابقة",
    color: "indigo",
    scene: "gram-bacilli",
  },
  autoclave: {
    category: "biochem",
    scientificName: "Sterilization Cycle",
    arabicName: "تعقيم بالبخار",
    emoji: "♨️",
    morphology: "121°C / 15 psi / 20 دقيقة",
    microscopy: "شريط مؤشر تغير لونه — تعقيم ناجح",
    color: "orange",
    scene: "chem-spectrum",
  },
  "biosafety-cabinet": {
    category: "biochem",
    scientificName: "Class II Biosafety Cabinet",
    arabicName: "كابينة السلامة الحيوية",
    emoji: "🛡️",
    morphology: "تدفق هوائي HEPA — منطقة معقمة",
    microscopy: "ضغط سالب وتدفق صفائحي محقق",
    color: "emerald",
    scene: "chem-spectrum",
  },
  centrifuge: {
    category: "biochem",
    scientificName: "Serum Separation",
    arabicName: "فصل المصل عن الخلايا",
    emoji: "🩸",
    morphology: "طبقة مصل صفراء فوق الكريات",
    microscopy: "3500 rpm × 10 min",
    color: "rose",
    scene: "blood-cells",
  },
  "elisa-washer": {
    category: "immune",
    scientificName: "ELISA Plate Wash",
    arabicName: "غسيل لوحة المناعة",
    emoji: "💧",
    morphology: "آبار نظيفة بدون خلفية",
    microscopy: "PBS-Tween × 5 دورات",
    color: "sky",
    scene: "elisa-wells",
  },
  "dna-sequencer": {
    category: "genetic",
    scientificName: "Sanger / NGS Sequence",
    arabicName: "قراءة التسلسل الجيني",
    emoji: "🧬",
    morphology: "5′-ATGCGTACGTTAGC…3′ Q30",
    microscopy: "كروماتوجرام نظيف بدون تداخل",
    color: "purple",
    scene: "sequence",
  },
  "crispr-station": {
    category: "genetic",
    scientificName: "CRISPR-Cas9 Knockout",
    arabicName: "تعديل جيني موجّه",
    emoji: "✂️",
    morphology: "كفاءة تعديل 72% — بدون Off-targets",
    microscopy: "Cas9 + sgRNA يقطع الموقع الهدف",
    color: "fuchsia",
    scene: "crispr",
  },
  nanodrop: {
    category: "molecular",
    scientificName: "Pure dsDNA",
    arabicName: "قياس تركيز DNA",
    emoji: "📊",
    morphology: "145 ng/µL — A260/A280 = 1.85",
    microscopy: "ذروة امتصاص عند 260 nm",
    color: "cyan",
    scene: "chem-spectrum",
  },
  "rna-extractor": {
    category: "molecular",
    scientificName: "Viral RNA Extract",
    arabicName: "استخلاص RNA فيروسي",
    emoji: "🧪",
    morphology: "RNA نقي خالٍ من DNase",
    microscopy: "جاهز لـ RT-PCR",
    color: "teal",
    scene: "sequence",
  },
  "afb-microscope": {
    category: "bacteria",
    scientificName: "Mycobacterium tuberculosis",
    arabicName: "عصيات السل الحامضية",
    emoji: "🔴",
    morphology: "عصيات حمراء على خلفية زرقاء",
    microscopy: "صبغة Ziehl-Neelsen / Auramine",
    color: "red",
    scene: "acid-fast",
  },
  "stool-microscopy": {
    category: "parasite",
    scientificName: "Giardia lamblia",
    arabicName: "الجيارديا اللمبلية",
    emoji: "🪱",
    morphology: "أكياس بيضاوية رباعية النوى",
    microscopy: "Wet mount + Lugol iodine 40x",
    color: "lime",
    scene: "parasite-cyst",
  },
  "fungal-culture": {
    category: "fungus",
    scientificName: "Candida albicans",
    arabicName: "المبيضات البيضاء",
    emoji: "🍄",
    morphology: "مستعمرات كريمية + Pseudohyphae",
    microscopy: "براعم + أنبوب إنبات إيجابي",
    color: "yellow",
    scene: "yeast-hyphae",
  },
  "bacterial-transformation": {
    category: "genetic",
    scientificName: "Recombinant E. coli (Amp^R)",
    arabicName: "تحويل بكتيري ناجح",
    emoji: "🧫",
    morphology: "مستعمرات مقاومة للأمبيسلين",
    microscopy: "تعبير جيني مؤكَّد",
    color: "emerald",
    scene: "colonies",
  },
};

export function getPathogenVisual(instrumentId: string): PathogenVisual | null {
  return PATHOGEN_VISUALS[instrumentId] ?? null;
}
