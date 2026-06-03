export type Branch = "bacteriology" | "virology" | "mycology" | "parasitology" | "immunology";

export interface Test {
  id: string;
  name: string;
  result: string;
  hint: string;
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

export const BRANCHES: Record<Branch, { name: string; color: string; icon: string; desc: string }> = {
  bacteriology: { name: "علم البكتيريا", color: "165", icon: "🦠", desc: "تشخيص العدوى البكتيرية وزراعتها" },
  virology: { name: "علم الفيروسات", color: "320", icon: "🧬", desc: "كشف الفيروسات والأمراض الفيروسية" },
  mycology: { name: "علم الفطريات", color: "60", icon: "🍄", desc: "تشخيص العدوى الفطرية" },
  parasitology: { name: "علم الطفيليات", color: "30", icon: "🪱", desc: "تحديد الطفيليات في العينات" },
  immunology: { name: "علم المناعة", color: "200", icon: "🛡️", desc: "اختبارات الأجسام المضادة والمناعة" },
};

export const CASES: Case[] = [
  {
    id: "c1", branch: "bacteriology", emoji: "🫁",
    patient: "رجل 45 سنة",
    history: "حمى مفاجئة وسعال مع بلغم صدئ اللون منذ 3 أيام",
    symptoms: ["حمى 39°C", "سعال منتج", "ألم صدري", "ضيق نفس"],
    specimen: "عينة بلغم",
    tests: [
      { id: "gram", name: "صبغة جرام", result: "مكورات موجبة الجرام مزدوجة (Diplococci)", hint: "إيجابي" },
      { id: "culture", name: "زراعة على آجار الدم", result: "انحلال دم ألفا (Alpha-hemolysis)", hint: "أخضر حول المستعمرات" },
      { id: "optochin", name: "اختبار الأوبتوكين", result: "حساس (Sensitive)", hint: "تثبيط النمو" },
    ],
    options: ["Streptococcus pneumoniae", "Staphylococcus aureus", "Klebsiella pneumoniae", "Mycoplasma pneumoniae"],
    answer: "Streptococcus pneumoniae",
    treatment: "Amoxicillin أو Ceftriaxone",
    explanation: "المكورات الرئوية مكورات موجبة الجرام، تسبب انحلال دم ألفا، وحساسة للأوبتوكين — مما يميزها عن Strep viridans.",
  },
  {
    id: "c2", branch: "bacteriology", emoji: "🍔",
    patient: "طفل 8 سنوات",
    history: "إسهال دموي وتقلصات بطنية بعد تناول لحم غير مطهٍ جيداً",
    symptoms: ["إسهال دموي", "ألم بطني", "حمى خفيفة"],
    specimen: "عينة براز",
    tests: [
      { id: "macconkey", name: "آجار ماك كونكي", result: "مستعمرات وردية (Lactose fermenter)", hint: "تخمر اللاكتوز" },
      { id: "sorbitol", name: "آجار سوربيتول ماك كونكي", result: "لا يخمر السوربيتول (عديم اللون)", hint: "مميز جداً" },
      { id: "shiga", name: "اختبار سم الشيغا", result: "إيجابي (Shiga toxin +)", hint: "ذيفان قوي" },
    ],
    options: ["E. coli O157:H7", "Salmonella typhi", "Shigella dysenteriae", "Vibrio cholerae"],
    answer: "E. coli O157:H7",
    treatment: "دعم سوائل فقط — تجنب المضادات الحيوية (تزيد خطر HUS)",
    explanation: "السلالة O157:H7 لا تخمر السوربيتول وتنتج سم شيغا، وقد تسبب متلازمة انحلال الدم اليوريمية.",
  },
  {
    id: "c3", branch: "virology", emoji: "🧠",
    patient: "شابة 22 سنة",
    history: "حمى وصداع شديد وطفح جلدي مع تقرحات مؤلمة في الشفاه",
    symptoms: ["حويصلات شفوية", "حمى", "تضخم عقد لمفية"],
    specimen: "مسحة من الحويصلة",
    tests: [
      { id: "tzanck", name: "مسحة تزانك (Tzanck)", result: "خلايا عملاقة متعددة النوى", hint: "مميزة لفيروسات الهربس" },
      { id: "pcr", name: "PCR للحمض النووي", result: "DNA إيجابي لـ HSV-1", hint: "تأكيد جزيئي" },
    ],
    options: ["HSV-1", "VZV", "EBV", "CMV"],
    answer: "HSV-1",
    treatment: "Acyclovir فموياً",
    explanation: "فيروس الهربس البسيط النوع 1 يسبب الحويصلات الفموية المتكررة. خلايا تزانك العملاقة شائعة في عدوى الهربس.",
  },
  {
    id: "c4", branch: "virology", emoji: "🫀",
    patient: "رجل 30 سنة",
    history: "تعب مزمن واصفرار جلد بعد وشم منذ 6 أشهر",
    symptoms: ["يرقان", "تعب", "آلام مفاصل"],
    specimen: "عينة دم",
    tests: [
      { id: "hbsag", name: "HBsAg", result: "سلبي", hint: "" },
      { id: "antihcv", name: "Anti-HCV", result: "إيجابي", hint: "" },
      { id: "rna", name: "HCV RNA (PCR)", result: "إيجابي، حمل فيروسي مرتفع", hint: "" },
    ],
    options: ["التهاب الكبد B", "التهاب الكبد C", "التهاب الكبد A", "HIV"],
    answer: "التهاب الكبد C",
    treatment: "مضادات الفيروسات مباشرة المفعول (DAAs) مثل Sofosbuvir",
    explanation: "HCV ينتقل عبر الدم والوشوم غير المعقمة. PCR الإيجابي يؤكد العدوى النشطة.",
  },
  {
    id: "c5", branch: "mycology", emoji: "🦶",
    patient: "مريض سكري 60 سنة",
    history: "تقشر وحكة بين أصابع القدم منذ شهرين",
    symptoms: ["تقشر", "حكة", "رائحة كريهة"],
    specimen: "كشط جلدي",
    tests: [
      { id: "koh", name: "تحضير KOH 10%", result: "خيوط فطرية مقسمة (Septate hyphae)", hint: "تذيب الكيراتين" },
      { id: "sda", name: "زراعة على Sabouraud agar", result: "مستعمرات بيضاء قطنية", hint: "" },
    ],
    options: ["Trichophyton rubrum", "Candida albicans", "Aspergillus fumigatus", "Cryptococcus neoformans"],
    answer: "Trichophyton rubrum",
    treatment: "Terbinafine موضعي",
    explanation: "سعفة القدم (Tinea pedis) يسببها عادةً Trichophyton rubrum، وهو فطر جلدي ذو خيوط مقسمة.",
  },
  {
    id: "c6", branch: "mycology", emoji: "🌬️",
    patient: "مريض زرع نخاع",
    history: "حمى لا تستجيب للمضادات الحيوية ونفث دم",
    symptoms: ["حمى", "نفث دم", "آفات رئوية على الأشعة"],
    specimen: "غسيل قصبي",
    tests: [
      { id: "koh2", name: "فحص مجهري", result: "خيوط متفرعة بزاوية 45° حادة", hint: "تفرع حاد" },
      { id: "gm", name: "اختبار Galactomannan", result: "إيجابي", hint: "" },
    ],
    options: ["Aspergillus fumigatus", "Mucor", "Candida albicans", "Histoplasma"],
    answer: "Aspergillus fumigatus",
    treatment: "Voriconazole",
    explanation: "الرشاشيات تنتج