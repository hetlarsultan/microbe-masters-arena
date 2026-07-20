import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  imageDataUrl: z.string().startsWith("data:image/"),
  hint: z.string().max(500).optional(),
});

export type SpecimenAnalysis = {
  specimen: string;
  category: string;
  findings: string[];
  likelyPathogens: { name: string; arabic: string; probability: string }[];
  diagnosis: string;
  recommendedTests: string[];
  confidence: number; // 0..100
  notes: string;
  raw?: string;
};

const SYSTEM = `أنت أخصائي ميكروبيولوجي طبي خبير. عند إعطائك صورة عينة مخبرية
(صبغة جرام، مستعمرات على وسط زراعي، تحليل بول أو دم، لوحة ELISA، جل الرحلان،
منحنى PCR، مسحة دموية، فحص طفيليات، مزرعة فطرية، أو أي عينة أخرى) عليك:
1) التعرف على نوع العينة والتقنية.
2) وصف المشاهدات المجهرية أو المخبرية.
3) اقتراح المسببات المرضية المحتملة بأسمائها العلمية والعربية مع احتمال كل منها.
4) إعطاء تشخيص مبدئي وفحوص تأكيدية مقترحة.
أعِد النتيجة حصراً بصيغة JSON صالحة بالمخطط المحدد، دون أي نص خارج JSON،
وباللغة العربية للحقول الوصفية.`;

const SCHEMA_HINT = `{
  "specimen": "نوع العينة",
  "category": "بكتيريا|فيروس|فطر|طفيلي|مناعة|جيني|كيمياء حيوية|دم|غير معروف",
  "findings": ["مشاهدة 1", "مشاهدة 2"],
  "likelyPathogens": [{"name":"Latin","arabic":"عربي","probability":"مرتفع|متوسط|منخفض"}],
  "diagnosis": "التشخيص المبدئي",
  "recommendedTests": ["فحص تأكيدي 1"],
  "confidence": 0-100,
  "notes": "ملاحظات إضافية أو تحفظات"
}`;

export const analyzeSpecimen = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<SpecimenAnalysis> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const userText =
      `حلّل العينة في الصورة وأعِد JSON فقط بالمخطط:\n${SCHEMA_HINT}` +
      (data.hint ? `\nسياق إضافي من المستخدم: ${data.hint}` : "");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.5",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("تم تجاوز حد الاستخدام مؤقتاً، حاول بعد قليل.");
      if (res.status === 402) throw new Error("انتهت أرصدة الذكاء الاصطناعي في مساحة العمل.");
      throw new Error(`AI Gateway error ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "";
    let parsed: Partial<SpecimenAnalysis> = {};
    try {
      const cleaned = content.replace(/^```json\s*|\s*```$/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return {
        specimen: "غير محدد",
        category: "غير معروف",
        findings: [],
        likelyPathogens: [],
        diagnosis: "تعذّر تفسير استجابة النموذج",
        recommendedTests: [],
        confidence: 0,
        notes: "لم يُرجع النموذج JSON صالحاً.",
        raw: content,
      };
    }

    return {
      specimen: parsed.specimen ?? "غير محدد",
      category: parsed.category ?? "غير معروف",
      findings: parsed.findings ?? [],
      likelyPathogens: parsed.likelyPathogens ?? [],
      diagnosis: parsed.diagnosis ?? "—",
      recommendedTests: parsed.recommendedTests ?? [],
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      notes: parsed.notes ?? "",
    };
  });
