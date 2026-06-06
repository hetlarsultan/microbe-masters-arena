import type { Branch } from "./cases";

export interface InstrumentStep {
  id: string;
  title: string;
  detail: string;
  action: string; // button label
  duration?: number; // ms simulated processing
  warn?: string; // wrong action warning if user tries to skip
  mentor?: string; // spoken mentor guidance
}

export interface Instrument {
  id: string;
  name: string;
  icon: string;
  branch: Branch | "general" | "molecular" | "genetic";
  tagline: string;
  bsl?: "BSL-1" | "BSL-2" | "BSL-3";
  level?: "مبتدئ" | "متوسط" | "متقدم" | "استشاري";
  mentorIntro?: string;
  principle: string; // scientific principle
  safety: string[];
  steps: InstrumentStep[];
  finalResult: string; // shown after completion
  resultVisual?: "pcr" | "elisa" | "gel" | "gram" | "culture" | "flow" | "microscope";
}

export const INSTRUMENTS: Instrument[] = [
  {
    id: "pcr",
    name: "Real-Time PCR — جهاز تفاعل البوليميراز المتسلسل",
    icon: "🧬",
    branch: "molecular",
    tagline: "تضخيف وكشف الحمض النووي للفيروسات والبكتيريا",
    principle:
      "يعتمد على دورات حرارية متكررة (Denaturation 95°C → Annealing 55°C → Extension 72°C) لمضاعفة قطعة DNA مستهدفة، مع كشف فلوري لحظي عند كل دورة.",
    safety: [
      "ارتدِ القفازات والبالطو دائماً — RNA حساسة جداً للتلوث.",
      "افصل مناطق التحضير عن مناطق التضخيف لتجنب الـ Carry-over.",
      "تخلّص من الـ Tips بعد كل استخدام داخل حاوية النفايات الحيوية.",
    ],
    steps: [
      { id: "1", title: "استخراج الحمض النووي", detail: "افتح عمود السبين، أضف 200 µL من العينة + Lysis Buffer، اخلط ثم طرد مركزي.", action: "ابدأ الاستخراج", duration: 1400 },
      { id: "2", title: "تحضير الـ Master Mix", detail: "اخلط: Taq polymerase + dNTPs + Primers + Probe + Buffer داخل أنبوب على ثلج.", action: "حضّر الخليط", duration: 1100 },
      { id: "3", title: "تحميل اللوحة (96-well plate)", detail: "أضف 20 µL Master Mix + 5 µL DNA لكل بئر، ولا تنسَ عينة التحكم السالب والموجب.", action: "حمّل اللوحة", duration: 900 },
      { id: "4", title: "إغلاق وختم اللوحة", detail: "ضع فيلم لاصق شفاف، اضغط جيداً لمنع التبخر، ثم انقل اللوحة إلى الجهاز.", action: "أغلق وأدخل", duration: 700 },
      { id: "5", title: "تشغيل البرنامج الحراري", detail: "95°C × 10 دقائق ثم 40 دورة: 95°C × 15ث، 60°C × 60ث مع قراءة الفلورة.", action: "ابدأ الـ 40 دورة", duration: 2600 },
      { id: "6", title: "قراءة منحنى التضخيف", detail: "حدد قيمة Ct (Cycle threshold) للعينة وقارن بالـ Control.", action: "اعرض النتيجة", duration: 900 },
    ],
    finalResult: "✓ منحنى تضخيف موجب — Ct = 24.6 → حمل فيروسي مرتفع (Positive Detection).",
    resultVisual: "pcr",
  },
  {
    id: "elisa",
    name: "ELISA Reader — جهاز قراءة الإليزا",
    icon: "🟦",
    branch: "immunology",
    tagline: "قياس الأجسام المضادة أو المستضدات بتفاعل لوني",
    principle:
      "يربط الجسم المضاد الأول المستضد على اللوحة، ثم يُضاف جسم مضاد ثانوي مرتبط بإنزيم (HRP) ينتج لوناً عند إضافة الركيزة، يقاس عند 450 nm.",
    safety: [
      "استخدم micropipette معايرة وتغيير الـ tips بين الآبار.",
      "تجنب فقاعات الهواء — تؤثر على القراءة الضوئية.",
      "اعمل في كابينة بعيداً عن أشعة الشمس المباشرة (الركيزة حساسة للضوء).",
    ],
    steps: [
      { id: "1", title: "Coating اللوحة", detail: "تأتي اللوحة جاهزة مغلفة بالمستضد المعروف. تحقق من تاريخ الصلاحية.", action: "افحص اللوحة", duration: 600 },
      { id: "2", title: "إضافة العينة", detail: "أضف 100 µL من مصل المريض إلى كل بئر مع آبار تحكم موجبة وسالبة.", action: "أضف العينات", duration: 1000 },
      { id: "3", title: "الحضانة الأولى", detail: "احضن 30 دقيقة عند 37°C ليرتبط الجسم المضاد بالمستضد.", action: "ابدأ الحضانة", duration: 1500 },
      { id: "4", title: "الغسيل (×3)", detail: "اشطف بـ Wash Buffer لإزالة الأجسام غير المرتبطة.", action: "ابدأ الغسيل", duration: 1100 },
      { id: "5", title: "إضافة Conjugate", detail: "100 µL من جسم مضاد ثانوي مرتبط بـ HRP، احضن 30 دقيقة.", action: "أضف المرافق", duration: 1300 },
      { id: "6", title: "إضافة الركيزة TMB", detail: "تظهر صبغة زرقاء تتناسب مع كمية الأجسام المضادة.", action: "أضف TMB", duration: 1000 },
      { id: "7", title: "محلول الإيقاف", detail: "أضف H₂SO₄ 1N — يتحول اللون إلى أصفر ويثبت التفاعل.", action: "أوقف التفاعل", duration: 600 },
      { id: "8", title: "قراءة OD عند 450 nm", detail: "ضع اللوحة في الـ Reader واقرأ الكثافة البصرية.", action: "اقرأ النتيجة", duration: 1000 },
    ],
    finalResult: "✓ OD = 1.42 (Cut-off = 0.3) → Positive: وجود أجسام مضادة بعيار مرتفع.",
    resultVisual: "elisa",
  },
  {
    id: "gel",
    name: "Gel Electrophoresis — الترحيل الكهربي",
    icon: "⚡",
    branch: "molecular",
    tagline: "فصل قطع DNA حسب الحجم لتأكيد منتج PCR",
    principle:
      "تنتقل قطع DNA (مشحونة سالباً) خلال هلام Agarose نحو القطب الموجب، فتفصلها حسب الحجم — الأصغر يتحرك أسرع.",
    safety: [
      "تعامل مع Ethidium Bromide بحذر — مادة مطفّرة (استخدم بدائل آمنة مثل SYBR).",
      "لا تلمس أقطاب الجهاز أثناء التشغيل (90–120 فولت).",
      "ارتدِ نظارات حماية UV عند تصوير الجل.",
    ],
    steps: [
      { id: "1", title: "تحضير هلام Agarose", detail: "اذب 1g Agarose في 100mL TAE Buffer بالميكروويف حتى يصبح شفافاً.", action: "اذب الأجار", duration: 1400 },
      { id: "2", title: "صب الجل", detail: "اسكب في القالب مع المشط، اتركه يتصلب 20 دقيقة في درجة الغرفة.", action: "اصبب الجل", duration: 1200 },
      { id: "3", title: "وضع الجل في الحوض", detail: "أزل المشط، ضع الجل في الحوض، اغمره بالكامل بـ TAE Buffer.", action: "جهّز الحوض", duration: 700 },
      { id: "4", title: "تحميل العينات", detail: "اخلط العينة مع Loading Dye، حمّل في الآبار + Ladder للمقارنة.", action: "حمّل الآبار", duration: 1000 },
      { id: "5", title: "تشغيل الكهرباء", detail: "100 فولت لمدة 30–45 دقيقة حتى تقترب الصبغة من نهاية الجل.", action: "شغّل 100V", duration: 2200 },
      { id: "6", title: "تصوير تحت UV", detail: "انقل الجل إلى الـ Transilluminator وصور الحزم.", action: "صوّر الجل", duration: 900 },
    ],
    finalResult: "✓ ظهور حزمة عند 450 bp مطابقة للحجم المتوقع — منتج PCR إيجابي ونوعي.",
    resultVisual: "gel",
  },
  {
    id: "gram",
    name: "Gram Staining Station — محطة صبغة جرام",
    icon: "🟣",
    branch: "bacteriology",
    tagline: "تصنيف البكتيريا إلى موجبة أو سالبة لجرام",
    principle:
      "البكتيريا موجبة الجرام لها جدار سميك من الببتيدوغليكان يحتفظ بصبغة الكريستال البنفسجي بعد الكحول، بينما السالبة تفقدها وتأخذ اللون الوردي من السفرانين.",
    safety: [
      "اعمل قرب لهب بنزن لتجنب التلوث المحمول جواً.",
      "تخلّص من الأصباغ في حاوية النفايات الكيميائية المخصصة.",
      "تجنّب لمس الشريحة بعد التثبيت الحراري — قد تكون ساخنة.",
    ],
    steps: [
      { id: "1", title: "تحضير اللطاخة (Smear)", detail: "ضع قطرة ماء فسيولوجي + المستعمرة، اطمسها بشكل دائري على الشريحة.", action: "حضّر اللطاخة", duration: 900 },
      { id: "2", title: "التجفيف والتثبيت", detail: "اتركها تجف في الهواء ثم مرر فوق لهب بنزن 3 مرات لتثبيت البكتيريا.", action: "ثبّت بالحرارة", duration: 900 },
      { id: "3", title: "صبغة Crystal Violet", detail: "غطّ الشريحة لمدة دقيقة كاملة ثم اشطف بالماء.", action: "اصبغ بنفسجي", duration: 1200 },
      { id: "4", title: "إضافة محلول اليود (Mordant)", detail: "دقيقة كاملة — يثبّت الصبغة داخل الجدار البكتيري.", action: "أضف اليود", duration: 1100 },
      { id: "5", title: "إزالة اللون بالكحول (الخطوة الحرجة)", detail: "أضف الكحول قطرة قطرة لمدة 10–15 ثانية فقط ثم اشطف فوراً!", action: "أضف الكحول", duration: 800, warn: "إفراط الكحول = نتائج كاذبة" },
      { id: "6", title: "صبغة Safranin المعاكسة", detail: "غطّ لمدة 30–60 ثانية، اشطف، ثم جفف بمنشفة.", action: "اصبغ سفرانين", duration: 1000 },
      { id: "7", title: "الفحص المجهري", detail: "أضف قطرة زيت الغمر وافحص بعدسة 100x.", action: "افحص بالمجهر", duration: 1100 },
    ],
    finalResult: "✓ كرات بنفسجية في عناقيد — Gram +ve Cocci in clusters → يُرجَّح Staphylococcus.",
    resultVisual: "gram",
  },
  {
    id: "culture",
    name: "Bacterial Culture & Incubator — حاضنة الزراعة",
    icon: "🧫",
    branch: "bacteriology",
    tagline: "زراعة العينة على وسط مناسب وقراءة المستعمرات",
    principle:
      "توفير درجة حرارة (37°C) ورطوبة وأحياناً CO₂ تسمح بنمو المستعمرات على أوساط انتقائية أو تفاضلية لتمييز الأنواع.",
    safety: [
      "كل العمل ضمن نطاق 15 سم حول لهب بنزن.",
      "ضع الأطباق مقلوبة (Agar فوق) لمنع تكثيف الماء.",
      "لا تفتح الحاضنة بكثرة — تذبذب الحرارة يفسد المزرعة.",
    ],
    steps: [
      { id: "1", title: "تعقيم حلقة التلقيح", detail: "احرقها فوق اللهب حتى الاحمرار ثم اتركها تبرد 5 ثوانٍ.", action: "عقّم الحلقة", duration: 700 },
      { id: "2", title: "أخذ العينة", detail: "اغمس الحلقة في العينة (مسحة، براز، بول…).", action: "خذ العينة", duration: 600 },
      { id: "3", title: "التخطيط الرباعي (Streaking)", detail: "خطط في 4 قطاعات مع تعقيم الحلقة بين كل قطاعين للحصول على مستعمرات منفصلة.", action: "خطط الطبق", duration: 1300 },
      { id: "4", title: "وضع الطبق في الحاضنة", detail: "اقلب الطبق ثم ضعه عند 37°C لمدة 18–24 ساعة.", action: "احضن 24 ساعة", duration: 2200 },
      { id: "5", title: "قراءة المستعمرات", detail: "صف الشكل، اللون، الحجم، نوع الانحلال (على آجار الدم).", action: "اقرأ النتيجة", duration: 900 },
    ],
    finalResult: "✓ مستعمرات ذهبية محدبة مع β-Hemolysis على Blood Agar → Staphylococcus aureus محتمل.",
    resultVisual: "culture",
  },
  {
    id: "flow",
    name: "Flow Cytometer — قياس التدفق الخلوي",
    icon: "🌈",
    branch: "immunology",
    tagline: "عدّ وتحليل الخلايا المناعية (CD4, CD8, B cells)",
    principle:
      "تمرر الخلايا المصبوغة بأجسام مضادة فلورية في تيار رقيق أمام شعاع ليزر، فتُحلّل الإشارات الجانبية والأمامية والفلورية لتصنيف كل خلية.",
    safety: [
      "تأكد من توافق الـ Sheath Fluid وعدم وجود فقاعات.",
      "اضبط الـ Compensation لتفادي تداخل الألوان الفلورية.",
      "نظّف الجهاز بمحلول التبييض في نهاية اليوم.",
    ],
    steps: [
      { id: "1", title: "سحب عينة الدم", detail: "5 mL في أنبوب EDTA لمنع التجلط.", action: "اسحب الدم", duration: 800 },
      { id: "2", title: "إزالة كريات الدم الحمراء", detail: "أضف Lysing Solution، احضن 10 دقائق، ثم اطرد مركزياً.", action: "حلّل الـ RBCs", duration: 1300 },
      { id: "3", title: "الصبغ بالأجسام الفلورية", detail: "أضف CD3-FITC + CD4-PE + CD8-APC، احضن في الظلام 20 دقيقة.", action: "اصبغ الخلايا", duration: 1500 },
      { id: "4", title: "غسيل الخلايا", detail: "PBS + طرد مركزي مرتين لإزالة الصبغة الزائدة.", action: "اغسل العينة", duration: 1100 },
      { id: "5", title: "تشغيل الجهاز ومعايرته", detail: "اضبط الـ Voltage والـ Compensation باستخدام Single-stain controls.", action: "عاير الجهاز", duration: 1400 },
      { id: "6", title: "تحليل العينة", detail: "مرّر العينة ودع الجهاز يحلل 10,000 حدث ويرسم الـ Dot Plot.", action: "حلل 10K حدث", duration: 2000 },
    ],
    finalResult: "✓ CD4 = 320 cell/µL (طبيعي 500–1500) → نقص مناعي يستدعي متابعة HIV.",
    resultVisual: "flow",
  },
  {
    id: "microscope",
    name: "Light Microscope — المجهر الضوئي",
    icon: "🔬",
    branch: "general",
    tagline: "فحص الشرائح المصبوغة بعدسات متدرجة حتى 1000x",
    principle:
      "تجميع الضوء عبر مكثّف ثم عدسة شيئية وعينية يكبر الصورة. زيت الغمر مع عدسة 100x يقلل انكسار الضوء ويزيد الوضوح.",
    safety: [
      "نظّف العدسات بمنديل عدسات فقط (lens paper).",
      "ابدأ دائماً بأقل تكبير ثم تدرّج للأعلى.",
      "لا تستخدم زيت الغمر إلا مع عدسة 100x المخصصة.",
    ],
    steps: [
      { id: "1", title: "تشغيل المصدر الضوئي", detail: "افتح المصباح وارفع الكثافة تدريجياً.", action: "شغّل الإضاءة", duration: 600 },
      { id: "2", title: "وضع الشريحة على المسرح", detail: "ثبّت الشريحة بالمشابك، توسط العينة فوق فتحة الإضاءة.", action: "ضع الشريحة", duration: 700 },
      { id: "3", title: "البدء بعدسة 10x", detail: "ركّز بالعجلة الكبيرة (Coarse) ثم الدقيقة (Fine).", action: "ركّز 10x", duration: 1000 },
      { id: "4", title: "الانتقال إلى 40x", detail: "دوّر القرص، اضبط بالعجلة الدقيقة فقط.", action: "ركّز 40x", duration: 900 },
      { id: "5", title: "زيت الغمر مع 100x", detail: "ضع قطرة زيت على الشريحة ثم اخفض العدسة برفق.", action: "ركّز 100x", duration: 1100 },
      { id: "6", title: "التنظيف بعد الفحص", detail: "أزل الزيت بمنديل العدسات فوراً بعد الفحص.", action: "نظّف العدسة", duration: 700 },
    ],
    finalResult: "✓ رؤية واضحة للبكتيريا تحت 1000x — جاهز للتشخيص المورفولوجي.",
    resultVisual: "microscope",
  },
  {
    id: "autoclave",
    name: "Autoclave — جهاز التعقيم بالبخار",
    icon: "🧴",
    branch: "general",
    tagline: "تعقيم الأدوات والأوساط بالبخار المضغوط",
    principle:
      "البخار المشبع تحت ضغط 15 psi يرفع الحرارة إلى 121°C لمدة 15–20 دقيقة، فيقتل جميع الكائنات بما فيها الجراثيم (Spores).",
    safety: [
      "لا تفتح الموصدة إلا عند هبوط الضغط إلى الصفر.",
      "لا تعقم المواد البلاستيكية غير المقاومة للحرارة.",
      "استخدم قفازات مقاومة للحرارة عند الإخراج.",
    ],
    steps: [
      { id: "1", title: "تحضير الأدوات", detail: "لف الأدوات بورق التعقيم وضع شريط مؤشر (Autoclave tape).", action: "لف وضع الشريط", duration: 800 },
      { id: "2", title: "ملء خزان الماء", detail: "تأكد من مستوى الماء المقطر لتوليد البخار.", action: "افحص الماء", duration: 600 },
      { id: "3", title: "تحميل الغرفة", detail: "ضع الأدوات بشكل غير محكم للسماح بدوران البخار.", action: "حمّل بالداخل", duration: 800 },
      { id: "4", title: "إغلاق الباب وضبط الدورة", detail: "121°C، 15 psi، 20 دقيقة.", action: "ابدأ الدورة", duration: 2200 },
      { id: "5", title: "مرحلة التجفيف", detail: "اترك الدورة تنتهي مع تنفيس البخار تلقائياً.", action: "انتظر التجفيف", duration: 1200 },
      { id: "6", title: "التحقق من النجاح", detail: "تحول لون الشريط إلى أسود = تعقيم ناجح.", action: "افحص الشريط", duration: 700 },
    ],
    finalResult: "✓ التعقيم مكتمل — الأدوات جاهزة للاستخدام في الكابينة المعقّمة.",
    resultVisual: "culture",
  },
];

export const INSTRUMENT_BRANCHES: Record<string, { name: string; icon: string }> = {
  general: { name: "عام", icon: "🧰" },
  molecular: { name: "بيولوجيا جزيئية", icon: "🧬" },
  bacteriology: { name: "بكتيريا", icon: "🦠" },
  virology: { name: "فيروسات", icon: "🧫" },
  mycology: { name: "فطريات", icon: "🍄" },
  parasitology: { name: "طفيليات", icon: "🪱" },
  immunology: { name: "مناعة", icon: "🛡️" },
};
