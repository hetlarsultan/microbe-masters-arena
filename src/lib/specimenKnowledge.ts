import type { SpecimenAnalysis } from "./api/analyze-specimen.functions";

// Local knowledge base — يسمح للتطبيق بالعمل بدون إنترنت
// كل مدخل يمثل نمط عينة شائع مع مسبباته وفحوصه التأكيدية.
export type SpecimenTemplate = {
  keywords: string[];
  data: Omit<SpecimenAnalysis, "confidence" | "raw"> & { confidence?: number };
};

export const SPECIMEN_LIBRARY: SpecimenTemplate[] = [
  {
    keywords: ["جرام", "gram", "كوكي", "قيح", "صديد", "cocci", "staph", "strep"],
    data: {
      specimen: "صبغة جرام لمسحة صديد/قيح",
      category: "بكتيريا",
      findings: [
        "خلايا كوكية موجبة الجرام (بنفسجية) عنقودية الترتيب",
        "خلايا التهابية عديدة (Neutrophils)",
        "خلفية بروتينية كثيفة تدل على تفاعل التهابي حاد",
      ],
      likelyPathogens: [
        { name: "Staphylococcus aureus", arabic: "المكورة العنقودية الذهبية", probability: "مرتفع" },
        { name: "Coagulase-negative Staphylococci", arabic: "عنقوديات سالبة الكواغيولاز", probability: "متوسط" },
        { name: "Streptococcus pyogenes", arabic: "العقدية المقيحة", probability: "منخفض" },
      ],
      diagnosis: "التهاب جلدي/نسيجي قيحي محتمل بالمكورات العنقودية",
      recommendedTests: [
        "زراعة على وسط Blood Agar وMannitol Salt Agar",
        "اختبار Catalase و Coagulase",
        "حساسية المضادات (Disk Diffusion / VITEK)",
        "PCR لجين mecA للكشف عن MRSA",
      ],
    },
  },
  {
    keywords: ["مستعمرات", "colony", "زراعة", "agar", "بلات", "plate"],
    data: {
      specimen: "طبق زراعي (Culture Plate)",
      category: "بكتيريا",
      findings: [
        "نمو مستعمرات مستديرة ملساء بلون مائل للأصفر/الذهبي",
        "انحلال دم بيتا حول بعض المستعمرات",
        "قوام دهني ومظهر لامع",
      ],
      likelyPathogens: [
        { name: "Staphylococcus aureus", arabic: "المكورة العنقودية الذهبية", probability: "مرتفع" },
        { name: "Streptococcus pyogenes", arabic: "العقدية المقيحة", probability: "متوسط" },
      ],
      diagnosis: "عدوى بكتيرية قيحية — يرجّح المكورة العنقودية الذهبية",
      recommendedTests: ["Coagulase Test", "DNase Test", "MALDI-TOF للتعريف النهائي", "Antibiogram"],
    },
  },
  {
    keywords: ["بول", "urine", "urinalysis", "شريط"],
    data: {
      specimen: "تحليل بول (Urinalysis / Dipstick)",
      category: "كيمياء حيوية",
      findings: [
        "Leukocyte Esterase موجب",
        "Nitrites موجب",
        "كريات دم بيضاء > 10 / HPF في الرسوب المجهري",
        "بكتيريا في الرسوب",
      ],
      likelyPathogens: [
        { name: "Escherichia coli", arabic: "الإشريكية القولونية", probability: "مرتفع" },
        { name: "Klebsiella pneumoniae", arabic: "الكلبسيلا الرئوية", probability: "متوسط" },
        { name: "Proteus mirabilis", arabic: "البروتيوس الرائع", probability: "منخفض" },
      ],
      diagnosis: "التهاب مسالك بولية (UTI) — مرجّح بكتيري",
      recommendedTests: ["زراعة بول كمية على CLED/MacConkey", "حساسية مضادات حيوية", "فحص وظائف كلى إن تكرر"],
    },
  },
  {
    keywords: ["دم", "blood", "cbc", "مسحة", "smear"],
    data: {
      specimen: "مسحة دم محيطية (Peripheral Blood Smear)",
      category: "دم",
      findings: [
        "كريات حمراء صغيرة الحجم (Microcytic) شاحبة (Hypochromic)",
        "تباين في الحجم (Anisocytosis) والشكل (Poikilocytosis)",
        "صفائح دموية طبيعية",
      ],
      likelyPathogens: [
        { name: "Iron deficiency anemia", arabic: "فقر دم بعوز الحديد", probability: "مرتفع" },
        { name: "Thalassemia trait", arabic: "سمة الثلاسيميا", probability: "متوسط" },
      ],
      diagnosis: "فقر دم صغير الكريات ناقص الصباغ — يرجّح عوز الحديد",
      recommendedTests: ["Ferritin, Serum Iron, TIBC", "Hb Electrophoresis", "CBC كامل مع Reticulocyte count"],
    },
  },
  {
    keywords: ["elisa", "اليزا", "لوحة", "wells", "بئر", "مناعة"],
    data: {
      specimen: "لوحة ELISA (96 well plate)",
      category: "مناعة",
      findings: [
        "تلوّن أصفر واضح في آبار العينات مقارنة بالضبط السالب",
        "قيم OD تفوق قيمة القطع (Cut-off)",
        "الضبط الموجب والسالب ضمن المدى المقبول",
      ],
      likelyPathogens: [
        { name: "Antigen/Antibody positive", arabic: "نتيجة مصلية إيجابية", probability: "مرتفع" },
      ],
      diagnosis: "نتيجة مصلية إيجابية — تحتاج تأكيد بفحص مرجعي",
      recommendedTests: ["Western Blot / Immunoblot", "PCR للكشف عن المادة الوراثية", "إعادة العينة بعد أسبوعين"],
    },
  },
  {
    keywords: ["pcr", "منحنى", "amplification", "ct", "real-time", "real time"],
    data: {
      specimen: "منحنى Real-Time PCR",
      category: "جيني",
      findings: [
        "منحنى تضخيم سيغمويدي واضح مع تجاوز خط العتبة (Threshold)",
        "قيمة Ct ضمن المدى الموجب",
        "الضبط الداخلي (IC) ناجح",
      ],
      likelyPathogens: [
        { name: "Target pathogen detected", arabic: "المسبب المستهدف مُكتشف", probability: "مرتفع" },
      ],
      diagnosis: "نتيجة PCR إيجابية للمستهدف",
      recommendedTests: ["إعادة الفحص لعينة ثانية للتأكيد", "تسلسل جيني (Sequencing) عند الحاجة"],
    },
  },
  {
    keywords: ["فطر", "fungi", "khoh", "yeast", "hyphae", "candida"],
    data: {
      specimen: "تحضير KOH / مزرعة فطرية",
      category: "فطر",
      findings: [
        "خيوط فطرية متفرعة (Hyphae) وأبواغ (Spores)",
        "خلايا خميرية برعمية (Budding yeast)",
      ],
      likelyPathogens: [
        { name: "Candida albicans", arabic: "المبيضّة البيضاء", probability: "مرتفع" },
        { name: "Aspergillus spp.", arabic: "الرشاشيات", probability: "متوسط" },
      ],
      diagnosis: "عدوى فطرية سطحية/غازية محتملة",
      recommendedTests: ["Sabouraud Dextrose Agar", "Germ Tube Test", "Galactomannan Assay"],
    },
  },
  {
    keywords: ["طفيلي", "parasite", "براز", "stool", "ova", "بيوض"],
    data: {
      specimen: "فحص براز مباشر (Wet Mount)",
      category: "طفيلي",
      findings: [
        "بيوض/أكياس طفيلية مرئية تحت المجهر",
        "خلايا التهابية قليلة",
      ],
      likelyPathogens: [
        { name: "Entamoeba histolytica", arabic: "الأميبا الحالة للنسج", probability: "متوسط" },
        { name: "Giardia lamblia", arabic: "الجيارديا اللمبلية", probability: "متوسط" },
        { name: "Ascaris lumbricoides", arabic: "الصفر الخراطيني", probability: "منخفض" },
      ],
      diagnosis: "عدوى طفيلية معوية محتملة",
      recommendedTests: ["فحص براز مركّز (Formol-Ether)", "Antigen ELISA للجيارديا", "PCR للطفيليات"],
    },
  },
  {
    keywords: ["جل", "gel", "electrophoresis", "رحلان", "band", "شريط"],
    data: {
      specimen: "جل رحلان كهربي (Agarose Gel)",
      category: "جيني",
      findings: [
        "أشرطة DNA واضحة عند الحجم المتوقع للمستهدف",
        "غياب أشرطة غير محددة تدل على تلوث",
        "سلّم الأحجام (Ladder) واضح",
      ],
      likelyPathogens: [
        { name: "Target DNA amplified", arabic: "تضخيم ناجح للمستهدف", probability: "مرتفع" },
      ],
      diagnosis: "نتيجة PCR تقليدية إيجابية",
      recommendedTests: ["Sanger Sequencing للتحقق من التسلسل", "Real-Time PCR كمّي"],
    },
  },
];

export function offlineAnalyze(hint?: string): SpecimenAnalysis {
  const h = (hint ?? "").toLowerCase();
  let best: SpecimenTemplate | null = null;
  let bestScore = 0;

  for (const t of SPECIMEN_LIBRARY) {
    const score = t.keywords.reduce((s, k) => (h.includes(k.toLowerCase()) ? s + 1 : s), 0);
    if (score > bestScore) {
      bestScore = score;
      best = t;
    }
  }

  const pick = best ?? SPECIMEN_LIBRARY[0];
  const confidence = bestScore > 0 ? Math.min(85, 55 + bestScore * 10) : 45;

  return {
    ...pick.data,
    confidence,
    notes:
      (bestScore > 0
        ? "تحليل محلي (بدون إنترنت) استناداً إلى قاعدة معرفة داخلية مطابقة لسياق العينة."
        : "لم يتم الاتصال بخادم الذكاء الاصطناعي — عُرضت نتيجة عامة من قاعدة المعرفة الداخلية. عدّل السياق النصي للحصول على نتيجة أدق.") +
      " النتيجة تعليمية إرشادية فقط.",
  };
}

// يحوّل نتيجة تحليل الصورة إلى مؤشرات على هيئة تقرير Real-Time PCR
export type PCRIndicator = {
  status: "Positive" | "Negative" | "Borderline" | "Invalid";
  ctValue: number;      // Cycle Threshold مقدَّر
  threshold: number;    // خط العتبة
  baseline: number;
  efficiency: number;   // %
  interpretation: string;
  color: string;
};

export function toPCRIndicator(a: SpecimenAnalysis): PCRIndicator {
  const c = Math.max(0, Math.min(100, a.confidence));
  let status: PCRIndicator["status"];
  if (c >= 75) status = "Positive";
  else if (c >= 55) status = "Borderline";
  else if (c >= 20) status = "Negative";
  else status = "Invalid";

  // Ct تقديري: ثقة أعلى = Ct أقل (تضخيم أبكر)
  const ctValue = +(40 - (c / 100) * 22).toFixed(1); // ~ 18 .. 40
  const efficiency = +(95 + (c - 60) * 0.05).toFixed(1);
  const interpretation =
    status === "Positive"
      ? "منحنى تضخيم واضح فوق خط العتبة — نتيجة إيجابية للمستهدف."
      : status === "Borderline"
        ? "قيمة Ct قريبة من الحد — يُنصح بإعادة الفحص لعينة ثانية."
        : status === "Negative"
          ? "لا يوجد تضخيم فوق خط العتبة — نتيجة سلبية."
          : "ضبط داخلي غير ناجح — العينة غير صالحة، أعد الاستخلاص.";
  const color =
    status === "Positive" ? "#22c55e" : status === "Borderline" ? "#f59e0b" : status === "Negative" ? "#64748b" : "#ef4444";

  return { status, ctValue, threshold: 0.2, baseline: 0.05, efficiency, interpretation, color };
}
