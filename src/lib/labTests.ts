// مكتبة شاملة للتحاليل الكيميائية والأوساط الزراعية واختبارات الحساسية والفحوص الجزيئية
// المستخدمة في مختبرات الأحياء الدقيقة الطبية.

export type LabTestCategory =
  | "media"        // أوساط زراعية
  | "biochem"      // اختبارات كيميائية حيوية
  | "sensitivity"  // حساسية المضادات الحيوية
  | "molecular";   // فحوص جزيئية / PCR

export type LabTest = {
  id: string;
  icon: string;
  name: string;        // بالعربية
  english: string;
  category: LabTestCategory;
  purpose: string;
  principle: string;
  procedure: string[]; // خطوات مختصرة
  interpretation: { label: string; meaning: string; color?: string }[];
  targets?: string[];  // مسببات مستهدفة
  timeToResult: string;
  qc?: string;         // ضوابط الجودة
  notes?: string;
};

export const LAB_TEST_CATEGORIES: { id: LabTestCategory; label: string; icon: string; hint: string }[] = [
  { id: "media", label: "الأوساط الزراعية", icon: "🧫", hint: "Blood, MSA, MacConkey…" },
  { id: "biochem", label: "الاختبارات الكيميائية الحيوية", icon: "⚗️", hint: "Catalase, Coagulase, Oxidase…" },
  { id: "sensitivity", label: "حساسية المضادات الحيوية", icon: "💊", hint: "Disk Diffusion, VITEK, E-test" },
  { id: "molecular", label: "الفحوص الجزيئية", icon: "🧬", hint: "PCR mecA, 16S rRNA, VanA…" },
];

export const LAB_TESTS: LabTest[] = [
  /* ============ الأوساط الزراعية ============ */
  {
    id: "blood-agar",
    icon: "🩸",
    name: "أجار الدم",
    english: "Blood Agar (BAP)",
    category: "media",
    purpose: "زراعة عامة وكشف نمط انحلال الدم للمكورات المسببة للالتهاب.",
    principle:
      "وسط مغذٍّ يحتوي 5% دم أغنام يكشف الإنزيمات الحالّة للدم (Hemolysins) التي تفرزها البكتيريا.",
    procedure: [
      "تلقيح العينة بطريقة الخطوط الأربعة (Streak plate).",
      "الحضن الهوائي عند 35–37°م لمدة 18–24 ساعة.",
      "قراءة نمط الانحلال حول المستعمرات.",
    ],
    interpretation: [
      { label: "β-hemolysis", meaning: "انحلال كامل شفاف — Streptococcus pyogenes, S. aureus", color: "#22c55e" },
      { label: "α-hemolysis", meaning: "انحلال جزئي مخضرّ — S. pneumoniae, viridans strep", color: "#84cc16" },
      { label: "γ (لا انحلال)", meaning: "لا انحلال — Enterococcus faecalis", color: "#64748b" },
    ],
    timeToResult: "18–24 ساعة",
    qc: "S. aureus ATCC 25923 (β) / S. pneumoniae ATCC 49619 (α).",
  },
  {
    id: "msa",
    icon: "🟡",
    name: "أجار المانيتول الملحي",
    english: "Mannitol Salt Agar (MSA)",
    category: "media",
    purpose: "وسط انتقائي وتفريقي للمكورات العنقودية، وتمييز S. aureus عن غيرها.",
    principle:
      "يحوي 7.5% NaCl (انتقائي للـ Staph) و Mannitol + Phenol Red كمؤشر: تخمّر المانيتول ينتج حمضاً يحوّل اللون إلى أصفر.",
    procedure: [
      "تلقيح المسحة/المستعمرة بالخطوط.",
      "الحضن عند 35°م لمدة 24–48 ساعة هوائياً.",
      "ملاحظة النمو ولون الوسط حول المستعمرات.",
    ],
    interpretation: [
      { label: "أصفر (مانيتول +)", meaning: "Staphylococcus aureus — يخمّر المانيتول", color: "#eab308" },
      { label: "أحمر/زهري (مانيتول −)", meaning: "Coagulase-negative staph (S. epidermidis)", color: "#f43f5e" },
      { label: "لا نمو", meaning: "بكتيريا غير مقاومة للملح", color: "#64748b" },
    ],
    targets: ["Staphylococcus aureus", "S. epidermidis", "S. saprophyticus"],
    timeToResult: "24–48 ساعة",
  },
  {
    id: "macconkey",
    icon: "🌸",
    name: "أجار ماكونكي",
    english: "MacConkey Agar",
    category: "media",
    purpose: "انتقائي للعصويات سالبة الجرام وتفريق مخمّرات اللاكتوز.",
    principle: "أملاح الصفراء + بلّور بنفسجي تمنع Gram+، واللاكتوز + الأحمر المتعادل يميّز التخمير.",
    procedure: [
      "التلقيح بالخطوط.",
      "حضن 35°م / 18–24 س هوائياً.",
      "قراءة اللون وشكل المستعمرات.",
    ],
    interpretation: [
      { label: "مستعمرات وردية", meaning: "E. coli, Klebsiella (LF+)", color: "#f472b6" },
      { label: "شفافة / لا لون", meaning: "Salmonella, Shigella, Proteus (LF−)", color: "#94a3b8" },
    ],
    timeToResult: "18–24 ساعة",
  },
  {
    id: "chocolate",
    icon: "🍫",
    name: "أجار الشوكولا",
    english: "Chocolate Agar",
    category: "media",
    purpose: "زراعة الجراثيم الصعبة النمو Fastidious كالنيسيريا والهيموفيلس.",
    principle: "حرارة تحلّل كريات الدم فتحرر الهيمين (X) وNAD (V) اللازمين للنمو.",
    procedure: [
      "التلقيح بالخطوط.",
      "الحضن في 5% CO₂ عند 35°م لمدة 24–48 س.",
    ],
    interpretation: [
      { label: "نمو", meaning: "Neisseria gonorrhoeae/meningitidis, Haemophilus influenzae", color: "#a855f7" },
    ],
    timeToResult: "24–48 ساعة",
  },
  {
    id: "sda",
    icon: "🍄",
    name: "أجار سابورو",
    english: "Sabouraud Dextrose Agar (SDA)",
    category: "media",
    purpose: "زراعة الفطريات والخمائر.",
    principle: "pH حمضي (~5.6) ومحتوى دكستروز عالٍ يمنع معظم البكتيريا ويسمح بالفطريات.",
    procedure: [
      "تلقيح على أنبوب مائل.",
      "حضن 25–30°م حتى 4 أسابيع.",
    ],
    interpretation: [
      { label: "مستعمرات كريمية", meaning: "Candida spp.", color: "#f5deb3" },
      { label: "خيوط قطنية", meaning: "Aspergillus, dermatophytes", color: "#94a3b8" },
    ],
    timeToResult: "2 أيام – 4 أسابيع",
  },
  {
    id: "cled",
    icon: "🟢",
    name: "أجار CLED",
    english: "CLED Agar",
    category: "media",
    purpose: "زراعة كمّية للبول ومنع انتشار Proteus.",
    principle: "خالٍ من الإلكتروليتات فيقيّد التموّج، ويميّز مخمّر اللاكتوز.",
    procedure: [
      "تلقيح 1 μL أو 10 μL باستخدام Calibrated loop.",
      "حضن 35°م / 24 س.",
      "عدّ المستعمرات وضربها بمعامل اللوب.",
    ],
    interpretation: [
      { label: "≥ 10⁵ CFU/mL", meaning: "التهاب مسالك بولية مؤكد", color: "#22c55e" },
      { label: "10³–10⁴", meaning: "قد يكون تلوث — يعتمد على العَرَض", color: "#f59e0b" },
    ],
    timeToResult: "18–24 ساعة",
  },
  {
    id: "emb",
    icon: "🟣",
    name: "أجار EMB",
    english: "Eosin Methylene Blue",
    category: "media",
    purpose: "انتقائي وتفريقي للعصويات سالبة الجرام مع كشف E. coli.",
    principle: "الصباغان يمنعان Gram+ ويعطيان E. coli بريقاً معدنياً أخضر.",
    procedure: ["تلقيح بالخطوط.", "حضن 35°م / 24 س."],
    interpretation: [
      { label: "بريق أخضر معدني", meaning: "E. coli", color: "#10b981" },
      { label: "بنفسجي بلا بريق", meaning: "Enterobacter, Klebsiella", color: "#a78bfa" },
    ],
    timeToResult: "24 ساعة",
  },

  /* ============ الاختبارات الكيميائية الحيوية ============ */
  {
    id: "catalase",
    icon: "🫧",
    name: "اختبار الكاتاليز",
    english: "Catalase Test",
    category: "biochem",
    purpose: "تفريق المكورات العنقودية (Staph +) عن العقديات (Strep −).",
    principle:
      "إنزيم Catalase يحلّل H₂O₂ إلى ماء وأوكسجين → تصاعد فقاعات فورية.",
    procedure: [
      "وضع قطرة H₂O₂ 3% على شريحة زجاجية.",
      "نقل مستعمرة من وسط لا يحتوي دماً (لتفادي الإيجابية الكاذبة).",
      "مراقبة الفقاعات خلال ثوانٍ.",
    ],
    interpretation: [
      { label: "فقاعات (+)", meaning: "Staphylococcus spp., Micrococcus", color: "#22c55e" },
      { label: "لا فقاعات (−)", meaning: "Streptococcus, Enterococcus", color: "#ef4444" },
    ],
    qc: "S. aureus (+) / S. pyogenes (−).",
    timeToResult: "أقل من دقيقة",
    notes: "لا تستخدم عقيمة معدنية — قد تعطي إيجابية كاذبة.",
  },
  {
    id: "coagulase",
    icon: "🧪",
    name: "اختبار الكواغيولاز",
    english: "Coagulase Test",
    category: "biochem",
    purpose: "تمييز S. aureus (+) عن عنقوديات سالبة الكواغيولاز CoNS (−).",
    principle:
      "إنزيم Coagulase يحوّل الفيبرينوجين إلى فيبرين فيتخثّر البلازما. يوجد نوعان: مرتبط بالخلية (Slide) وحرّ (Tube).",
    procedure: [
      "Slide test: مزج مستعمرة مع قطرة بلازما أرنب — تكتّل خلال 10 ث = (+).",
      "Tube test: إضافة مستعمرة إلى 0.5 مل بلازما وحضنها 37°م، فحص التخثّر عند 1, 4, 24 ساعة.",
    ],
    interpretation: [
      { label: "تخثّر (+)", meaning: "Staphylococcus aureus", color: "#22c55e" },
      { label: "لا تخثّر (−)", meaning: "S. epidermidis, S. saprophyticus", color: "#ef4444" },
    ],
    qc: "S. aureus ATCC 25923 (+) / S. epidermidis ATCC 12228 (−).",
    timeToResult: "10 ثوانٍ – 24 ساعة",
    notes: "أكّد Slide السلبي بـ Tube test لتفادي السلبية الكاذبة.",
  },
  {
    id: "oxidase",
    icon: "🟪",
    name: "اختبار الأوكسيديز",
    english: "Oxidase Test",
    category: "biochem",
    purpose: "الكشف عن سيتوكروم-c أوكسيديز — تمييز Pseudomonas والنيسيريا.",
    principle: "كاشف Kovacs يتأكسد فيتلوّن بنفسجي داكن.",
    procedure: [
      "قطعة ورق أوكسيديز مبللة.",
      "مسح مستعمرة طازجة بحلقة بلاستيكية.",
      "قراءة اللون خلال 10–30 ثانية.",
    ],
    interpretation: [
      { label: "بنفسجي (+)", meaning: "Pseudomonas, Neisseria, Vibrio", color: "#8b5cf6" },
      { label: "لا لون (−)", meaning: "Enterobacterales", color: "#94a3b8" },
    ],
    timeToResult: "أقل من دقيقة",
  },
  {
    id: "indole",
    icon: "🧫",
    name: "اختبار الإندول",
    english: "Indole Test (SIM/Kovacs)",
    category: "biochem",
    purpose: "تمييز E. coli (+) عن باقي Enterobacterales.",
    principle: "إنزيم tryptophanase يفكك التربتوفان → Indole يتفاعل مع Kovacs → حلقة حمراء.",
    procedure: [
      "زراعة في مرق التربتوفان 24 س عند 35°م.",
      "إضافة 5 قطرات Kovacs reagent.",
    ],
    interpretation: [
      { label: "حلقة حمراء (+)", meaning: "E. coli", color: "#ef4444" },
      { label: "أصفر (−)", meaning: "Enterobacter, Klebsiella", color: "#eab308" },
    ],
    timeToResult: "24 ساعة",
  },
  {
    id: "urease",
    icon: "💧",
    name: "اختبار اليورياز",
    english: "Urease Test",
    category: "biochem",
    purpose: "الكشف عن Proteus وHelicobacter pylori.",
    principle: "اليورياز يحلل اليوريا → NH₃ يرفع pH فيحوّل Phenol Red إلى وردي.",
    procedure: [
      "تلقيح مائل Christensen urea.",
      "حضن 24 س عند 35°م.",
    ],
    interpretation: [
      { label: "وردي فوشي (+)", meaning: "Proteus, H. pylori", color: "#ec4899" },
      { label: "أصفر (−)", meaning: "E. coli, Shigella", color: "#eab308" },
    ],
    timeToResult: "2–24 ساعة",
  },
  {
    id: "tsi",
    icon: "🧯",
    name: "اختبار TSI",
    english: "Triple Sugar Iron Agar",
    category: "biochem",
    purpose: "تمييز Enterobacterales حسب تخمير السكاكر وإنتاج H₂S والغاز.",
    principle: "3 سكاكر + Fe²⁺ + Phenol Red → تغيّرات لون وH₂S أسود.",
    procedure: [
      "طعن العميق (Butt) وخطّ على المائل (Slant).",
      "حضن 18–24 س عند 35°م بغطاء مرخى.",
    ],
    interpretation: [
      { label: "K/A gas+ H₂S+", meaning: "Salmonella spp.", color: "#111" },
      { label: "A/A gas+", meaning: "E. coli", color: "#eab308" },
      { label: "K/K", meaning: "Pseudomonas (لا تخمير)", color: "#f43f5e" },
    ],
    timeToResult: "18–24 ساعة",
  },
  {
    id: "citrate",
    icon: "🟦",
    name: "اختبار السترات (Simmons)",
    english: "Simmons Citrate",
    category: "biochem",
    purpose: "الكشف عن استخدام السترات كمصدر كربون وحيد.",
    principle: "استهلاك السترات يرفع pH → Bromothymol Blue يتحوّل إلى أزرق.",
    procedure: ["تلقيح خفيف على المائل.", "حضن 24–48 س عند 35°م."],
    interpretation: [
      { label: "أزرق (+)", meaning: "Klebsiella, Enterobacter", color: "#3b82f6" },
      { label: "أخضر (−)", meaning: "E. coli, Shigella", color: "#22c55e" },
    ],
    timeToResult: "24–48 ساعة",
  },
  {
    id: "optochin",
    icon: "🎯",
    name: "اختبار الأوبتوشين",
    english: "Optochin Susceptibility",
    category: "biochem",
    purpose: "تمييز S. pneumoniae عن باقي α-hemolytic strep.",
    principle: "قرص Optochin (ethylhydrocupreine) يثبّط pneumococcus.",
    procedure: ["زرع على أجار دم + قرص P.", "حضن 5% CO₂ / 24 س."],
    interpretation: [
      { label: "منطقة ≥ 14 مم (حساس)", meaning: "S. pneumoniae", color: "#22c55e" },
      { label: "< 14 مم (مقاوم)", meaning: "Viridans streptococci", color: "#ef4444" },
    ],
    timeToResult: "24 ساعة",
  },

  /* ============ حساسية المضادات الحيوية ============ */
  {
    id: "disk-diffusion",
    icon: "💊",
    name: "الانتشار بالأقراص (Kirby-Bauer)",
    english: "Disk Diffusion (Kirby-Bauer)",
    category: "sensitivity",
    purpose: "تحديد حساسية العزلة لعدة مضادات على وسط Mueller-Hinton.",
    principle:
      "قرص مضاد ينتشر شعاعياً في الأجار مكوّناً منطقة تثبيط يعتمد قطرها على تركيز المضاد وسرعة نموّ الجرثوم.",
    procedure: [
      "تحضير معلّق بكتيري بكثافة 0.5 McFarland.",
      "مسح موحّد على أجار Mueller-Hinton بمسحة قطنية معقّمة (3 اتجاهات).",
      "وضع أقراص المضادات خلال 15 دقيقة.",
      "حضن 35°م / 16–18 س.",
      "قياس أقطار مناطق التثبيط بالمم ومقارنتها بجداول CLSI/EUCAST.",
    ],
    interpretation: [
      { label: "S — Susceptible", meaning: "المضاد فعّال بجرعة قياسية", color: "#22c55e" },
      { label: "I — Intermediate", meaning: "قد يفيد بجرعات مرتفعة أو مواقع تركّز عالٍ", color: "#f59e0b" },
      { label: "R — Resistant", meaning: "غير فعّال — تجنّب استعماله", color: "#ef4444" },
    ],
    qc: "E. coli ATCC 25922 / S. aureus ATCC 25923 / P. aeruginosa ATCC 27853.",
    timeToResult: "16–24 ساعة",
    notes: "سماكة الأجار 4 مم بالضبط — أي انحراف يشوّه القياس.",
  },
  {
    id: "vitek",
    icon: "🧠",
    name: "جهاز VITEK 2",
    english: "VITEK 2 Automated ID/AST",
    category: "sensitivity",
    purpose: "تعريف الجرثوم وتحديد MIC آلياً لعشرات المضادات.",
    principle:
      "بطاقات دقيقة مغلقة (ID/AST) بها ركائز كيميائية حيوية وتراكيز مضادات مختلفة، يقرأها الجهاز ضوئياً كل 15 دقيقة ويحلّل النموّ بمنحنى.",
    procedure: [
      "تحضير معلّق 0.5–0.63 McFarland في محلول ملحي.",
      "تحميل بطاقات ID وAST في الحامل (Cassette).",
      "إدخال المريض/العينة في البرنامج (Smart Carrier Station).",
      "تشغيل الجهاز — قراءة تلقائية 4–18 ساعة.",
      "تفسير التقرير مع نظام الخبير AES.",
    ],
    interpretation: [
      { label: "MIC رقمي + S/I/R", meaning: "تصنيف حسب CLSI/EUCAST", color: "#0ea5e9" },
      { label: "AES alert", meaning: "نمط مقاومة غير مألوف — يستوجب تأكيداً", color: "#f59e0b" },
    ],
    timeToResult: "4–18 ساعة",
    qc: "بطاقات QC أسبوعية بسلالات ATCC.",
  },
  {
    id: "etest",
    icon: "📏",
    name: "شريط E-test",
    english: "Epsilometer Test (E-test)",
    category: "sensitivity",
    purpose: "قياس MIC (أقل تركيز مثبّط) بدقة على أجار.",
    principle: "شريط بلاستيكي يحمل تدرّج تركيز أُسّي للمضاد → منطقة تثبيط بيضاوية.",
    procedure: [
      "مسح 0.5 McFarland على Mueller-Hinton.",
      "وضع الشريط بالملقط بعد جفاف السطح.",
      "الحضن 35°م / 16–20 س.",
      "قراءة MIC عند تقاطع البيضاوي مع الشريط.",
    ],
    interpretation: [
      { label: "MIC ≤ حد الحساسية", meaning: "الحساسية مؤكدة", color: "#22c55e" },
      { label: "MIC ≥ حد المقاومة", meaning: "مقاوم", color: "#ef4444" },
    ],
    timeToResult: "16–24 ساعة",
  },
  {
    id: "broth-mic",
    icon: "🧪",
    name: "التخفيف المرقي (MIC)",
    english: "Broth Microdilution MIC",
    category: "sensitivity",
    purpose: "المرجع الذهبي لتحديد MIC.",
    principle: "تخفيفات ثنائية للمضاد في CAMHB مع لُقاح 5×10⁵ CFU/mL.",
    procedure: [
      "تحضير لوحة 96 بئر بتخفيفات ثنائية.",
      "إضافة الملقاح.",
      "الحضن 35°م / 16–20 س.",
      "قراءة أدنى تركيز يمنع النمو المرئي.",
    ],
    interpretation: [
      { label: "أدنى تركيز صافٍ", meaning: "MIC هو ذلك التركيز بـ μg/mL", color: "#0ea5e9" },
    ],
    timeToResult: "16–20 ساعة",
  },

  /* ============ فحوص جزيئية ============ */
  {
    id: "pcr-meca",
    icon: "🧬",
    name: "PCR لجين mecA",
    english: "mecA Real-Time PCR (MRSA)",
    category: "molecular",
    purpose: "الكشف السريع عن مقاومة الميثيسيلين في المكورات العنقودية (MRSA / MRCoNS).",
    principle:
      "الجين mecA يرمّز PBP2a المسؤول عن مقاومة كامل زمرة بيتا-لاكتام. الـ Real-Time PCR يستخدم بادئتين ومسبار TaqMan نوعياً.",
    procedure: [
      "استخلاص DNA من المستعمرة أو من مسحة الأنف مباشرة.",
      "تحضير Master Mix (Taq, dNTPs, MgCl₂, primers, probe FAM).",
      "إضافة 5 μL DNA لكل تفاعل 20 μL.",
      "بروتوكول حراري: 95°م 10د → 40 دورة (95°م/15ث، 60°م/1د).",
      "قراءة منحنيات التضخيم وحساب Ct.",
    ],
    interpretation: [
      { label: "Ct ≤ 35 مع IC (+)", meaning: "MRSA / mecA إيجابي — عزل المريض وبدء Vancomycin", color: "#ef4444" },
      { label: "لا تضخيم مع IC (+)", meaning: "MSSA — بيتا-لاكتام فعّال", color: "#22c55e" },
      { label: "IC سلبي", meaning: "غير صالح — أعد الاستخلاص", color: "#f59e0b" },
    ],
    targets: ["Staphylococcus aureus resistant to methicillin (MRSA)"],
    qc: "Positive control: MRSA ATCC 43300 / Negative: MSSA ATCC 29213 / NTC (ماء).",
    timeToResult: "1–2 ساعة",
    notes: "يجب فصل مناطق التحضير والتضخيم منعاً للتلوث المتقاطع.",
  },
  {
    id: "pcr-16s",
    icon: "🧬",
    name: "16S rRNA Sequencing",
    english: "16S rRNA Gene Sequencing",
    category: "molecular",
    purpose: "تعريف البكتيريا غير القابلة للتنميط التقليدي.",
    principle: "تضخيم منطقة V3-V4 المحفوظة ومقارنة التسلسل بقاعدة بيانات (NCBI/EzTaxon).",
    procedure: [
      "استخلاص DNA، تضخيم بـ 27F/1492R.",
      "تنقية المنتج، تسلسل Sanger.",
      "مقارنة BLAST.",
    ],
    interpretation: [
      { label: "تطابق ≥ 99%", meaning: "تعريف نوعي مؤكد", color: "#22c55e" },
      { label: "97–99%", meaning: "تعريف جنسي فقط", color: "#f59e0b" },
    ],
    timeToResult: "24–48 ساعة",
  },
  {
    id: "pcr-vanA",
    icon: "🧬",
    name: "PCR للجين vanA/vanB",
    english: "vanA/vanB PCR (VRE)",
    category: "molecular",
    purpose: "كشف Enterococcus المقاوم للفانكوميسين (VRE).",
    principle: "vanA/vanB يعيدان بناء جدار الخلية بلبنة D-Ala-D-Lac بدل D-Ala-D-Ala.",
    procedure: [
      "استخلاص DNA من مسحة شرجية أو مستعمرة.",
      "Real-Time PCR ثنائي القنوات (FAM/HEX).",
    ],
    interpretation: [
      { label: "vanA (+)", meaning: "مقاومة عالية لفانكوميسين وتيكوبلانين", color: "#ef4444" },
      { label: "vanB (+)", meaning: "مقاومة لفانكوميسين فقط", color: "#f59e0b" },
      { label: "سلبي", meaning: "حساس", color: "#22c55e" },
    ],
    timeToResult: "1–2 ساعة",
  },
  {
    id: "pcr-ctxm",
    icon: "🧬",
    name: "PCR للجينات CTX-M / KPC / NDM",
    english: "ESBL & Carbapenemase PCR",
    category: "molecular",
    purpose: "كشف الجينات المسؤولة عن مقاومة السيفالوسبورينات والكاربابينم.",
    principle: "Multiplex Real-Time PCR يستهدف عدة جينات معاً.",
    procedure: [
      "استخلاص DNA من العزلة/الدم.",
      "PCR متعدد الأهداف مع مسابر مختلفة الألوان.",
    ],
    interpretation: [
      { label: "CTX-M (+)", meaning: "ESBL — تجنّب السيفالوسبورينات", color: "#ef4444" },
      { label: "KPC/NDM/OXA-48 (+)", meaning: "Carbapenem-resistant — عزل صارم", color: "#b91c1c" },
    ],
    timeToResult: "1–3 ساعات",
  },
];

export function getTest(id: string) {
  return LAB_TESTS.find((t) => t.id === id);
}
