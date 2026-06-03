export type Branch = "bacteriology" | "virology" | "mycology" | "parasitology" | "immunology";

export interface Test {
  id: string;
  name: string;
  result: string;
  hint?: string;
}

export interface Case {
  id: string;
  branch: Branch;
  patient: string;
  history: string;
  symptoms: string[];
  specimen: string;
  tests: Test[];
  options: string[];
  answer: string;
  treatment: string;
  explanation: string;
  emoji: string;
}

export const BRANCHES: Record<Branch, { name: string; icon: string; desc: string; hue: number }> = {
  bacteriology: { name: "علم البكتيريا", icon: "🦠", desc: "تشخيص العدوى البكتيرية وزراعتها", hue: 165 },
  virology:     { name: "علم الفيروسات", icon: "🧬", desc: "كشف الفيروسات والأمراض الفيروسية", hue: 320 },
  mycology:     { name: "علم الفطريات", icon: "🍄", desc: "تشخيص العدوى الفطرية", hue: 60 },
  parasitology: { name: "علم الطفيليات", icon: "🪱", desc: "تحديد الطفيليات في العينات", hue: 30 },
  immunology:   { name: "علم المناعة",  icon: "🛡️", desc: "اختبارات الأجسام المضادة والمناعة", hue: 220 },
};

export const CASES: Case[] = [
  {
    id: "c1", branch: "bacteriology", emoji: "🫁",
    patient: "رجل 45 سنة",
    history: "حمى مفاجئة وسعال مع بلغم صدئ اللون منذ 3 أيام",
    symptoms: ["حمى 39°C", "سعال منتج", "ألم صدري", "ضيق نفس"],
    specimen: "عينة بلغم",
    tests: [
      { id: "gram", name: "صبغة جرام", result: "مكورات موجبة الجرام مزدوجة (Diplococci)" },
      { id: "culture", name: "زراعة على آجار الدم", result: "انحلال دم ألفا — هالة خضراء" },
      { id: "optochin", name: "اختبار الأوبتوكين", result: "حساس (Sensitive)" },
    ],
    options: ["Streptococcus pneumoniae", "Staphylococcus aureus", "Klebsiella pneumoniae", "Mycoplasma pneumoniae"],
    answer: "Streptococcus pneumoniae",
    treatment: "Amoxicillin أو Ceftriaxone",
    explanation: "المكورات الرئوية مكورات موجبة الجرام، تسبب انحلال دم ألفا وحساسة للأوبتوكين، مما يميزها عن Strep viridans.",
  },
  {
    id: "c2", branch: "bacteriology", emoji: "🍔",
    patient: "طفل 8 سنوات",
    history: "إسهال دموي وتقلصات بطنية بعد تناول لحم غير مطهٍ جيداً",
    symptoms: ["إسهال دموي", "ألم بطني", "حمى خفيفة"],
    specimen: "عينة براز",
    tests: [
      { id: "mac", name: "آجار ماك كونكي", result: "مستعمرات وردية — مخمرة للاكتوز" },
      { id: "smac", name: "Sorbitol MacConkey", result: "لا تخمر السوربيتول (مستعمرات شفافة)" },
      { id: "shiga", name: "اختبار سم الشيغا", result: "إيجابي (Shiga toxin +)" },
    ],
    options: ["E. coli O157:H7", "Salmonella typhi", "Shigella dysenteriae", "Vibrio cholerae"],
    answer: "E. coli O157:H7",
    treatment: "دعم بالسوائل فقط — تجنب المضادات الحيوية (خطر HUS)",
    explanation: "السلالة O157:H7 لا تخمر السوربيتول وتنتج سم شيغا، وقد تؤدي إلى متلازمة انحلال الدم اليوريمية.",
  },
  {
    id: "c3", branch: "virology", emoji: "🧠",
    patient: "شابة 22 سنة",
    history: "حمى وتقرحات مؤلمة متكررة في الشفاه",
    symptoms: ["حويصلات شفوية", "حمى", "تضخم عقد لمفية"],
    specimen: "مسحة من الحويصلة",
    tests: [
      { id: "tzanck", name: "مسحة تزانك", result: "خلايا عملاقة متعددة النوى" },
      { id: "pcr", name: "PCR للحمض النووي", result: "DNA إيجابي لـ HSV-1" },
    ],
    options: ["HSV-1", "VZV", "EBV", "CMV"],
    answer: "HSV-1",
    treatment: "Acyclovir فموياً",
    explanation: "فيروس الهربس البسيط نوع 1 يسبب الحويصلات الفموية المتكررة. خلايا تزانك مميزة لعدوى الهربس.",
  },
  {
    id: "c4", branch: "virology", emoji: "🫀",
    patient: "رجل 30 سنة",
    history: "تعب مزمن واصفرار جلد بعد وشم منذ 6 أشهر",
    symptoms: ["يرقان", "تعب", "آلام مفاصل"],
    specimen: "عينة دم",
    tests: [
      { id: "hbsag", name: "HBsAg", result: "سلبي" },
      { id: "anti", name: "Anti-HCV", result: "إيجابي" },
      { id: "rna", name: "HCV RNA (PCR)", result: "حمل فيروسي مرتفع" },
    ],
    options: ["التهاب الكبد B", "التهاب الكبد C", "التهاب الكبد A", "HIV"],
    answer: "التهاب الكبد C",
    treatment: "مضادات فيروسية مباشرة (DAAs) مثل Sofosbuvir",
    explanation: "HCV ينتقل عبر الدم والوشوم غير المعقمة، وPCR الإيجابي يؤكد العدوى النشطة.",
  },
  {
    id: "c5", branch: "mycology", emoji: "🦶",
    patient: "مريض سكري 60 سنة",
    history: "تقشر وحكة بين أصابع القدم منذ شهرين",
    symptoms: ["تقشر", "حكة", "رائحة كريهة"],
    specimen: "كشط جلدي",
    tests: [
      { id: "koh", name: "تحضير KOH 10%", result: "خيوط فطرية مقسمة (Septate hyphae)" },
      { id: "sda", name: "Sabouraud agar", result: "مستعمرات بيضاء قطنية" },
    ],
    options: ["Trichophyton rubrum", "Candida albicans", "Aspergillus fumigatus", "Cryptococcus neoformans"],
    answer: "Trichophyton rubrum",
    treatment: "Terbinafine موضعي",
    explanation: "سعفة القدم يسببها غالباً Trichophyton rubrum، وهو فطر جلدي ذو خيوط مقسمة.",
  },
  {
    id: "c6", branch: "mycology", emoji: "🌬️",
    patient: "مريض زرع نخاع",
    history: "حمى لا تستجيب للمضادات الحيوية ونفث دم",
    symptoms: ["حمى", "نفث دم", "آفات رئوية بالأشعة"],
    specimen: "غسيل قصبي",
    tests: [
      { id: "micro", name: "فحص مجهري", result: "خيوط متفرعة بزاوية 45° حادة" },
      { id: "gm", name: "Galactomannan", result: "إيجابي" },
    ],
    options: ["Aspergillus fumigatus", "Mucor", "Candida albicans", "Histoplasma"],
    answer: "Aspergillus fumigatus",
    treatment: "Voriconazole",
    explanation: "الرشاشيات تنتج خيوطاً مقسمة متفرعة بزاوية حادة، وGalactomannan مؤشر مصلي مفيد في المرضى المنقوصي المناعة.",
  },
  {
    id: "c7", branch: "parasitology", emoji: "🦟",
    patient: "مسافر عائد من أفريقيا",
    history: "نوبات حمى دورية مع رعشة وتعرق كل 48 ساعة",
    symptoms: ["حمى دورية", "صداع", "فقر دم", "تضخم طحال"],
    specimen: "مسحة دم سميكة ورقيقة",
    tests: [
      { id: "giemsa", name: "صبغة جيمزا", result: "أشكال حلقية وschizonts داخل كريات الدم الحمراء" },
      { id: "rdt", name: "اختبار سريع للملاريا", result: "إيجابي لـ P. falciparum" },
    ],
    options: ["Plasmodium falciparum", "Leishmania donovani", "Trypanosoma", "Babesia"],
    answer: "Plasmodium falciparum",
    treatment: "Artemisinin-based combination (ACT)",
    explanation: "الملاريا الخبيثة (P. falciparum) شائعة في أفريقيا وقد تسبب مضاعفات قاتلة. صبغة جيمزا هي المعيار الذهبي.",
  },
  {
    id: "c8", branch: "parasitology", emoji: "💧",
    patient: "طفل 5 سنوات",
    history: "إسهال دهني مزمن وانتفاخ بعد رحلة تخييم",
    symptoms: ["إسهال دهني", "غازات", "فقدان وزن"],
    specimen: "براز",
    tests: [
      { id: "ova", name: "فحص البراز المباشر", result: "كيسات بيضاوية بأربع نوى" },
      { id: "ag", name: "Stool antigen", result: "إيجابي" },
    ],
    options: ["Giardia lamblia", "Entamoeba histolytica", "Cryptosporidium", "Ascaris"],
    answer: "Giardia lamblia",
    treatment: "Metronidazole",
    explanation: "الجيارديا تنتقل عبر المياه الملوثة وتسبب إسهالاً دهنياً مزمناً. الكيسات رباعية النوى مميزة.",
  },
  {
    id: "c9", branch: "immunology", emoji: "🛡️",
    patient: "امرأة 28 سنة",
    history: "ألم مفاصل وطفح فراشي على الوجه وحساسية للشمس",
    symptoms: ["طفح فراشي", "ألم مفاصل", "تعب", "تساقط شعر"],
    specimen: "عينة مصل",
    tests: [
      { id: "ana", name: "ANA", result: "إيجابي بعيار 1:640 — نمط متجانس" },
      { id: "dsdna", name: "Anti-dsDNA", result: "إيجابي مرتفع" },
      { id: "c3", name: "C3, C4", result: "منخفضة" },
    ],
    options: ["الذئبة الحمامية الجهازية SLE", "التهاب المفاصل الرثوي", "تصلب الجلد", "متلازمة شوغرن"],
    answer: "الذئبة الحمامية الجهازية SLE",
    treatment: "Hydroxychloroquine + كورتيكوستيرويدات",
    explanation: "Anti-dsDNA نوعي جداً للذئبة، وانخفاض المتممة يدل على نشاط المرض.",
  },
  {
    id: "c10", branch: "immunology", emoji: "🩸",
    patient: "طفل 9 أشهر",
    history: "عدوى متكررة بكتيرية شديدة منذ الولادة",
    symptoms: ["التهابات رئوية متكررة", "إسهال مزمن", "فشل نمو"],
    specimen: "دم",
    tests: [
      { id: "ig", name: "مستويات الغلوبولين المناعي", result: "IgG, IgA, IgM منخفضة جداً" },
      { id: "bcell", name: "تعداد خلايا B بالـ Flow cytometry", result: "غائبة تقريباً" },
    ],
    options: ["Bruton's agammaglobulinemia (XLA)", "CVID", "SCID", "DiGeorge syndrome"],
    answer: "Bruton's agammaglobulinemia (XLA)",
    treatment: "تعويض الغلوبولين المناعي IVIG شهرياً",
    explanation: "نقص خلايا B وغياب جميع الغلوبولينات مع بداية مبكرة عند الذكور يوحي بـ XLA (طفرة BTK).",
  },
];
