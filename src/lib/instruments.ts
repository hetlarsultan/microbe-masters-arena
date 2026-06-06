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
  {
    id: "biosafety",
    name: "Biosafety Cabinet Class II — خزانة السلامة الحيوية",
    icon: "🧑‍🔬",
    branch: "general",
    bsl: "BSL-2",
    level: "مبتدئ",
    tagline: "بيئة معقّمة بتدفق هواء HEPA لحماية العينة والفني",
    mentorIntro: "مرحباً دكتور. قبل أي عمل ميكروبيولوجي، نبدأ من خزانة السلامة الحيوية. ارتدِ معدات الحماية ثم اتبع الخطوات.",
    principle:
      "تدفق هوائي رأسي يمر عبر فلتر HEPA لخلق حاجز معقّم بين الفني والعينة، مع شفط الهواء الملوث وتجديده داخلياً.",
    safety: [
      "ارتدِ القفازات، البالطو، النظارات الواقية والكمامة N95 قبل الفتح.",
      "لا تخرج يديك بسرعة من الكابينة — يكسر تدفق الهواء.",
      "اعمل في المنطقة الوسطى، وامسح السطح بـ 70% إيثانول قبل وبعد.",
    ],
    steps: [
      { id: "1", title: "ارتداء معدات الحماية الشخصية (PPE)", detail: "بالطو + قفازات نتريل + نظارات + كمامة.", action: "ارتدِ الـ PPE", duration: 900, mentor: "ارتدِ القفازات والمعطف والنظارات الواقية، وتأكد من إغلاق الأزرار جيداً." },
      { id: "2", title: "تشغيل الكابينة وانتظار استقرار التدفق", detail: "افتح الـ Blower ودع التدفق يستقر 3–5 دقائق.", action: "شغّل التدفق", duration: 1400, mentor: "افتح الكابينة وانتظر استقرار تدفق الهواء قبل البدء." },
      { id: "3", title: "تعقيم سطح العمل", detail: "امسح بالإيثانول 70% بحركة دائرية من الخلف للأمام.", action: "عقّم السطح", duration: 1000, mentor: "نظّف سطح العمل بالإيثانول من الداخل نحو الخارج." },
      { id: "4", title: "ترتيب الأدوات", detail: "ضع الأدوات النظيفة يساراً والمستخدمة يميناً.", action: "رتّب الأدوات", duration: 800 },
      { id: "5", title: "بدء العمل المخبري", detail: "ابدأ العمل في المنطقة الوسطى مع تجنّب الحركات المفاجئة.", action: "ابدأ العمل", duration: 1100, mentor: "ابدأ بتنفيذ البروتوكول داخل المنطقة المعقّمة بهدوء." },
      { id: "6", title: "التنظيف بعد الانتهاء", detail: "تخلّص من النفايات في الـ Biohazard bag وامسح السطح.", action: "اختم وعقّم", duration: 900 },
    ],
    finalResult: "✓ الكابينة آمنة ومعقّمة — يمكنك المتابعة لباقي الفحوصات بأمان.",
    resultVisual: "culture",
  },
  {
    id: "centrifuge",
    name: "Centrifuge — جهاز الطرد المركزي",
    icon: "🌀",
    branch: "general",
    level: "مبتدئ",
    tagline: "فصل مكونات العينة حسب الكثافة",
    principle:
      "قوة طاردة مركزية (RCF) تفصل الجزيئات الثقيلة لقاع الأنبوب والخفيفة للأعلى، تُحسب بـ RCF = 1.118×10⁻⁵ × r × RPM².",
    safety: [
      "وازن الأنابيب دائماً بأنبوب مقابل بنفس الوزن.",
      "لا تفتح الغطاء أثناء الدوران — خطر شديد.",
      "افحص الـ Rotor للكسور قبل التحميل.",
    ],
    steps: [
      { id: "1", title: "موازنة الأنابيب", detail: "ضع أنبوبين بنفس الوزن في مواضع متقابلة 180°.", action: "وازن العينات", duration: 900, mentor: "تأكد من توازن الأنابيب بدقة قبل التشغيل." },
      { id: "2", title: "ضبط السرعة والوقت", detail: "اضبط 3000 RPM لمدة 10 دقائق لفصل المصل.", action: "اضبط البرنامج", duration: 800, mentor: "اضبط السرعة 3000 لفة لمدة عشر دقائق." },
      { id: "3", title: "إغلاق الغطاء والتشغيل", detail: "تأكد من الإغلاق ثم اضغط START.", action: "ابدأ الدوران", duration: 2200 },
      { id: "4", title: "إخراج الأنابيب", detail: "انتظر التوقف الكامل قبل الفتح.", action: "أخرج العينات", duration: 800 },
    ],
    finalResult: "✓ تم فصل المصل (Serum) في الأعلى عن الخلايا في القاع — جاهز للسحب.",
    resultVisual: "culture",
  },
  {
    id: "elisa_washer",
    name: "ELISA Washer — غسّالة أطباق الإليزا",
    icon: "🚿",
    branch: "immunology",
    level: "متوسط",
    tagline: "غسيل آلي دقيق لأطباق 96-well لإزالة المرتبطات غير النوعية",
    principle:
      "إبر تحقن وتشفط Wash Buffer تلقائياً مرات متتالية لإزالة الأجسام غير المرتبطة دون إتلاف المستضد المثبّت.",
    safety: [
      "تأكد من عدم انسداد الإبر — يسبب نتائج كاذبة.",
      "استخدم Wash Buffer جديد طازج.",
      "اشطف الإبر بالماء المقطر بعد كل دورة.",
    ],
    steps: [
      { id: "1", title: "تجهيز Wash Buffer", detail: "خفف PBS-Tween 20× إلى 1× في الماء المقطر.", action: "حضّر المحلول", duration: 800 },
      { id: "2", title: "ملء خزان الغسيل", detail: "اربط الأنبوب بخزان Wash Buffer وأنبوب التصريف بالنفايات.", action: "وصّل الخزانات", duration: 700 },
      { id: "3", title: "وضع اللوحة في الجهاز", detail: "ثبّت اللوحة بالحامل واختر برنامج 4 دورات × 300 µL.", action: "حمّل اللوحة", duration: 900, mentor: "ضع اللوحة بعناية وتأكد من تطابق الآبار مع الإبر." },
      { id: "4", title: "تشغيل دورة الغسيل", detail: "اضغط START — يحقن ويشفط 4 مرات.", action: "ابدأ الغسيل", duration: 2000 },
      { id: "5", title: "تجفيف اللوحة", detail: "اقلب اللوحة على منشفة ورقية بضربات خفيفة.", action: "جفّف اللوحة", duration: 700 },
    ],
    finalResult: "✓ تم الغسيل بنجاح — اللوحة جاهزة لإضافة Conjugate.",
    resultVisual: "elisa",
  },
  {
    id: "sequencer",
    name: "DNA Sequencer — جهاز تحديد التسلسل الجيني (Sanger)",
    icon: "📜",
    branch: "genetic",
    level: "متقدم",
    tagline: "قراءة تسلسل النيوكليوتيدات A T G C بدقة عالية",
    principle:
      "طريقة Sanger تعتمد على ddNTPs ملوّنة فلورياً توقف بناء السلسلة عند كل قاعدة، ثم يقرأ الليزر الألوان أثناء الترحيل الشعيري.",
    safety: [
      "تعامل مع ddNTPs بحذر — حساسة للضوء.",
      "حافظ على شعيرة الترحيل (Capillary) نظيفة.",
      "تخلّص من النفايات في حاوية مخصصة.",
    ],
    steps: [
      { id: "1", title: "تحضير تفاعل التسلسل", detail: "اخلط DNA Template + Primer + BigDye + Buffer.", action: "حضّر التفاعل", duration: 1200 },
      { id: "2", title: "دورات تسلسل حرارية", detail: "25 دورة: 96°C × 10ث، 50°C × 5ث، 60°C × 4د.", action: "ابدأ الدورات", duration: 2200 },
      { id: "3", title: "تنقية المنتج", detail: "أزل ddNTPs الزائدة بأعمدة Sephadex أو ترسيب إيثانولي.", action: "نقّ المنتج", duration: 1400 },
      { id: "4", title: "تحميل في الـ Sequencer", detail: "ضع العينة في صفيحة 96 وضعها داخل الجهاز.", action: "حمّل العينة", duration: 900 },
      { id: "5", title: "الترحيل الشعيري", detail: "تنفصل القطع داخل الشعيرة ويقرأ الليزر الفلورة.", action: "شغّل الترحيل", duration: 2400, mentor: "الجهاز يقرأ القواعد واحدة تلو الأخرى لتوليد الكروماتوغرام." },
      { id: "6", title: "قراءة الكروماتوغرام", detail: "افحص قمم A T G C وحدّد جودة القراءة (Phred score).", action: "اقرأ التسلسل", duration: 1100 },
    ],
    finalResult: "✓ التسلسل: 5′-ATGCGTACGTTAGC...3′ — جودة Q30 ممتازة، لا توجد طفرات.",
    resultVisual: "gel",
  },
  {
    id: "crispr",
    name: "CRISPR-Cas9 Workstation — محطة التعديل الجيني",
    icon: "✂️",
    branch: "genetic",
    level: "استشاري",
    tagline: "قص وتعديل DNA بدقة باستخدام إنزيم Cas9 مع gRNA",
    mentorIntro: "اليوم سنقوم بتعديل جيني دقيق باستخدام CRISPR-Cas9. التزم بالخطوات بدقة عالية.",
    principle:
      "RNA دليل (gRNA) يقود إنزيم Cas9 إلى تسلسل مستهدف في الجينوم فيقص الـ DNA، ثم تُصلح الخلية الكسر بإدخال أو حذف جين.",
    safety: [
      "اعمل داخل كابينة BSL-2 معقّمة.",
      "خزّن Cas9 و gRNA عند -20°C وعدم تكرار التذويب.",
      "وثّق التسلسل المستهدف لتجنب Off-target effects.",
    ],
    steps: [
      { id: "1", title: "تصميم gRNA المستهدف", detail: "اختر تسلسل 20 nt بجوار PAM (NGG) باستخدام أدوات CRISPOR.", action: "صمّم gRNA", duration: 1300, mentor: "اختر تسلسل دليل دقيق متجنّباً المواقع المشابهة في الجينوم." },
      { id: "2", title: "تخليق gRNA معملياً", detail: "In vitro transcription من قالب DNA.", action: "خلّق gRNA", duration: 1500 },
      { id: "3", title: "تجميع مركّب Ribonucleoprotein", detail: "اخلط Cas9 + gRNA بنسبة 1:1.2 لتكوين RNP.", action: "جمّع الـ RNP", duration: 1100 },
      { id: "4", title: "إدخال المركّب للخلايا (Transfection)", detail: "باستخدام Electroporation أو Lipofectamine.", action: "حقن الخلايا", duration: 1700, mentor: "أدخل مركّب التعديل إلى الخلايا الهدف باستخدام صدمة كهربائية قصيرة." },
      { id: "5", title: "الحضانة 48 ساعة", detail: "اترك الخلايا لتنشيط آلية الإصلاح NHEJ أو HDR.", action: "احضن الخلايا", duration: 2000 },
      { id: "6", title: "التحقق بـ T7E1 Assay أو Sequencing", detail: "تأكيد حدوث القطع والتعديل.", action: "حقّق التعديل", duration: 1500 },
    ],
    finalResult: "✓ نجاح التعديل بكفاءة 72% — تم إيقاف الجين المستهدف بدون Off-targets.",
    resultVisual: "gel",
  },
  {
    id: "spectrophotometer",
    name: "NanoDrop Spectrophotometer — مطياف قياس الأحماض النووية",
    icon: "📈",
    branch: "molecular",
    level: "متوسط",
    tagline: "قياس تركيز ونقاء DNA / RNA بميكروليتر واحد",
    principle:
      "امتصاص الضوء عند 260 nm لقياس التركيز، ونسبة A260/A280 لتقييم النقاء (DNA نقي ≈ 1.8، RNA نقي ≈ 2.0).",
    safety: [
      "نظّف العدسة بمنديل خالي من الوبر بعد كل قراءة.",
      "استخدم Blank مطابق للـ Buffer.",
    ],
    steps: [
      { id: "1", title: "تهيئة الجهاز", detail: "افتح البرنامج واختر Nucleic Acid → DNA.", action: "هيّئ الجهاز", duration: 600 },
      { id: "2", title: "قراءة الـ Blank", detail: "ضع 1 µL من Buffer واضغط Blank.", action: "اقرأ الـ Blank", duration: 800 },
      { id: "3", title: "قراءة العينة", detail: "ضع 1 µL من DNA واضغط Measure.", action: "اقرأ العينة", duration: 900, mentor: "ضع قطرة دقيقة من العينة على القاعدة وأغلق الذراع." },
      { id: "4", title: "تقييم النقاء", detail: "تحقق A260/A280 و A260/A230.", action: "قيّم النقاء", duration: 700 },
    ],
    finalResult: "✓ التركيز = 145 ng/µL — A260/A280 = 1.85 → DNA نقي وعالي الجودة.",
    resultVisual: "elisa",
  },
  {
    id: "rna_extraction",
    name: "RNA / DNA Extraction Kit — استخلاص الحمض النووي",
    icon: "🧪",
    branch: "molecular",
    level: "متوسط",
    tagline: "استخلاص حمض نووي نقي من العينات الفيروسية أو البكتيرية",
    principle:
      "تكسير الخلايا (Lysis) ثم ربط الحمض النووي بسيليكا في عمود، غسل الشوائب، وإطلاق الـ DNA/RNA بـ Elution Buffer.",
    safety: [
      "اعمل في منطقة منفصلة لتجنب Cross-contamination.",
      "ارتدِ قفازات مزدوجة عند التعامل مع عينات فيروسية BSL-2.",
      "RNase حساس — استخدم مياه DEPC.",
    ],
    steps: [
      { id: "1", title: "تكسير العينة (Lysis)", detail: "200 µL عينة + 200 µL Lysis Buffer + 20 µL Proteinase K.", action: "كسّر الخلايا", duration: 1400, mentor: "أضف محلول التكسير وأنزيم البروتيناز ثم احضن قليلاً." },
      { id: "2", title: "الحضانة 56°C", detail: "10 دقائق في Heating Block.", action: "احضن 10 د", duration: 1500 },
      { id: "3", title: "إضافة الإيثانول والربط بالعمود", detail: "أضف 200 µL إيثانول وانقل لعمود السيليكا.", action: "ربط بالعمود", duration: 1100 },
      { id: "4", title: "خطوات الغسيل", detail: "غسلتين بـ Wash Buffer 1 و 2 مع طرد مركزي.", action: "اغسل العمود", duration: 1300 },
      { id: "5", title: "Elution", detail: "أضف 50 µL Elution Buffer، احضن دقيقة ثم طرد مركزي.", action: "استخلص الحمض", duration: 1100 },
    ],
    finalResult: "✓ تم استخلاص RNA فيروسي نقي — جاهز لـ RT-PCR.",
    resultVisual: "culture",
  },
  {
    id: "fluorescence",
    name: "Fluorescence Microscope — مجهر الفلورة",
    icon: "💡",
    branch: "general",
    level: "متوسط",
    tagline: "كشف الأجسام المضادة أو الجينات الموسومة بصبغات فلورية",
    principle:
      "ضوء UV يحفّز الصبغات الفلورية (FITC أخضر، Rhodamine أحمر، DAPI أزرق) فتنبعث ألوان مميزة تكشف الكائنات.",
    safety: [
      "لا تنظر مباشرة لمصدر الـ UV.",
      "استخدم الفلاتر الصحيحة (Excitation/Emission).",
    ],
    steps: [
      { id: "1", title: "تجهيز الشريحة", detail: "ثبّت العينة، اصبغها بـ Anti-body فلوري، اشطف.", action: "حضّر الشريحة", duration: 1200 },
      { id: "2", title: "تشغيل مصباح الزئبق", detail: "انتظر 5 دقائق للاستقرار.", action: "شغّل المصباح", duration: 1000 },
      { id: "3", title: "اختيار الفلتر المناسب", detail: "FITC للأخضر، TRITC للأحمر، DAPI للنواة.", action: "اختر الفلتر", duration: 700 },
      { id: "4", title: "الفحص بعدسة 40x زيت", detail: "ركّز في الظلام وصوّر الحقول.", action: "افحص وصوّر", duration: 1300, mentor: "أطفئ إضاءة الغرفة وافحص الحقول بحثاً عن الفلورة." },
    ],
    finalResult: "✓ كشف Mycobacterium tuberculosis بصبغة Auramine-Rhodamine.",
    resultVisual: "microscope",
  },
  {
    id: "stool_exam",
    name: "Stool Wet Mount — فحص البراز للطفيليات",
    icon: "🪱",
    branch: "parasitology",
    level: "مبتدئ",
    tagline: "كشف Giardia, Entamoeba, Ascaris في عينة براز",
    principle:
      "تحضير شريحة رطبة بمحلول ملحي أو لوغول لإبراز التركيب الداخلي للطفيليات وتمييز الأكياس عن الأشكال المتحركة.",
    safety: [
      "ارتدِ قفازات وكمامة — عينات معدية.",
      "تخلّص من الشرائح في Sharps container.",
    ],
    steps: [
      { id: "1", title: "تحضير العينة", detail: "خذ كمية بحجم رأس عود ثقاب من البراز.", action: "خذ العينة", duration: 700 },
      { id: "2", title: "تحضير لطاخة محلول ملحي", detail: "اخلط مع قطرة Saline على شريحة.", action: "حضّر Saline", duration: 800, mentor: "هذه اللطاخة تكشف الحركة في الأشكال النشطة." },
      { id: "3", title: "تحضير لطاخة لوغول", detail: "قطرة Iodine تُلون الأكياس بنياً.", action: "حضّر Iodine", duration: 800 },
      { id: "4", title: "تغطية بـ Coverslip", detail: "ضع غطاء بزاوية 45° لتجنب الفقاعات.", action: "غطّ الشريحة", duration: 600 },
      { id: "5", title: "فحص بـ 10x ثم 40x", detail: "ابحث عن الأكياس والـ Trophozoites.", action: "افحص الشريحة", duration: 1300 },
    ],
    finalResult: "✓ شوهدت أكياس Giardia lamblia ذات الشكل البيضاوي والنوى الأربعة.",
    resultVisual: "microscope",
  },
  {
    id: "sabouraud",
    name: "Sabouraud Dextrose Agar — زراعة الفطريات",
    icon: "🍄",
    branch: "mycology",
    level: "مبتدئ",
    tagline: "وسط انتقائي لزراعة الفطريات والخمائر",
    principle:
      "pH حمضي 5.6 + تركيز سكر عالي + كلورامفينيكول يثبط البكتيريا ويسمح بنمو الفطريات.",
    safety: [
      "احضن عند 25–30°C وليس 37°C.",
      "لا تشم الطبق — أبواغ الفطريات معدية.",
    ],
    steps: [
      { id: "1", title: "تلقيح الطبق", detail: "خطط العينة بحركة Z على السطح.", action: "لقّح الطبق", duration: 900 },
      { id: "2", title: "الحضانة 5–7 أيام", detail: "عند 28°C في الظلام.", action: "احضن أسبوع", duration: 2400 },
      { id: "3", title: "وصف المستعمرات", detail: "اللون، الملمس (قطني/مخملي)، الحواف.", action: "صف المستعمرات", duration: 1100 },
      { id: "4", title: "Lactophenol Cotton Blue Mount", detail: "حضّر شريحة وافحص الأبواغ مجهرياً.", action: "افحص الأبواغ", duration: 1200, mentor: "اصبغ جزءاً من المستعمرة بالـ Lactophenol وافحصها." },
    ],
    finalResult: "✓ نمت Candida albicans — مستعمرات كريمية + Pseudohyphae مجهرياً.",
    resultVisual: "culture",
  },
  {
    id: "plasmid",
    name: "Bacterial Transformation — التحول البكتيري بالبلازميد",
    icon: "🧬",
    branch: "genetic",
    level: "متقدم",
    tagline: "إدخال بلازميد يحمل جيناً جديداً إلى E. coli",
    principle:
      "صدمة حرارية (Heat Shock) تفتح مسامات مؤقتة في جدار البكتيريا الكفؤة (Competent Cells) ليدخل البلازميد ويُعبَّر عنه.",
    safety: [
      "اعمل قرب لهب بنزن.",
      "حافظ على الـ Competent cells في ثلج طوال الوقت.",
    ],
    steps: [
      { id: "1", title: "إذابة الخلايا الكفؤة على ثلج", detail: "DH5α في أنبوب 1.5 mL.", action: "أذب على ثلج", duration: 900 },
      { id: "2", title: "إضافة البلازميد", detail: "1–5 µL من البلازميد المنقّى.", action: "أضف البلازميد", duration: 700 },
      { id: "3", title: "حضانة على ثلج 30 د", detail: "لإلصاق البلازميد بالغشاء.", action: "احضن بارداً", duration: 1500 },
      { id: "4", title: "صدمة حرارية 42°C", detail: "بالضبط 45 ثانية ثم فوراً للثلج 2 دقيقة.", action: "صدمة 42°C", duration: 1200, warn: "تجاوز 60 ثانية يقتل الخلايا!", mentor: "وقّت الصدمة بدقة 45 ثانية فقط ثم أعد الأنبوب للثلج فوراً." },
      { id: "5", title: "إضافة LB Broth والتعافي", detail: "450 µL LB واحضن عند 37°C × 1 ساعة.", action: "احضن للتعافي", duration: 2000 },
      { id: "6", title: "الزراعة على LB + Ampicillin", detail: "فقط الخلايا المحوّلة تنمو.", action: "ازرع على Amp", duration: 1300 },
    ],
    finalResult: "✓ ظهرت مستعمرات مقاومة للأمبيسلين — التحول ناجح وتم التعبير عن الجين.",
    resultVisual: "culture",
  },
];

export const INSTRUMENT_BRANCHES: Record<string, { name: string; icon: string }> = {
  general: { name: "عام", icon: "🧰" },
  molecular: { name: "بيولوجيا جزيئية", icon: "🧬" },
  genetic: { name: "هندسة وراثية", icon: "✂️" },
  bacteriology: { name: "بكتيريا", icon: "🦠" },
  virology: { name: "فيروسات", icon: "🧫" },
  mycology: { name: "فطريات", icon: "🍄" },
  parasitology: { name: "طفيليات", icon: "🪱" },
  immunology: { name: "مناعة", icon: "🛡️" },
};
