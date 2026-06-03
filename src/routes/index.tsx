import { createFileRoute } from "@tanstack/react-router";
import { MicroLab } from "@/components/MicroLab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MicroLab — لعبة محاكاة الميكروبيولوجي" },
      { name: "description", content: "لعبة تعليمية لمحاكاة التشخيص الميكروبيولوجي تشمل البكتيريا والفيروسات والفطريات والطفيليات والمناعة." },
      { property: "og:title", content: "MicroLab — محاكاة الميكروبيولوجي" },
      { property: "og:description", content: "شخّص الحالات السريرية بفحوص مخبرية تفاعلية." },
    ],
  }),
  component: MicroLab,
});
