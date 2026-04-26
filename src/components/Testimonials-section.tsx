import { Card } from "@/components/ui/card";
import { Star, ChevronsRight, ChevronsLeft } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

const TESTIMONIALS = [
 
  {
    name: "محمد الحربي",
    position: "مدير العمليات",
    company: "شركة المقاولات الكبرى",
    content:
      "لقد وفرت المنصة 80% من وقتنا في إيجاد سكن مناسب لعملائنا، مع ضمان التزام كامل بالأنظمة",
    rating: 5,
    avatar: "lovable-uploads/target_audiance.svg",
  },
  {
    name: "عبدالله الرشيد",
    position: "مالك عقارات بجدة",
    company: "",
    content:
      "الميزة الأهم هي الشفافية في العقود والمدفوعات، مما وفر علينا الكثير من الجهد القانوني",
    rating: 5,
    avatar: "lovable-uploads/target_audiance.svg",  },
  {
    name: "احمد القحطاني",
    position: "مسؤول السكن المؤسسي",
    company: "مجموعة الخليج",
    content:
      "منصة موثوقة ساعدتنا في تأجير 5 عقارات بشكل مركزي، مع متابعة دقيقة لكل التفاصيل",
    rating: 5,
    avatar: "lovable-uploads/target_audiance.svg",  },
  {
    name: "أحمد السليم",
    position: "مدير الموارد البشرية",
    company: "شركة البناء الحديث",
    content:
      "لقد وفرت المنصة 80% من وقتنا في إيجاد سكن مناسب لعملائنا، مع ضمان التزام كامل بالأنظمة",
    rating: 5,
    avatar: "lovable-uploads/target_audiance.svg",  },
 
] as const;

export const TestimonialsSection: React.FC = () => {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();


  const scrollByPage = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    // scroll by one viewport width of the scroller
    const amount = el.clientWidth * (dir === "next" ? 1 : -1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="relative py-6 sm:py-10" dir="rtl">
      <div className="relative overflow-hidden bg-[#0F2A4A]">
        <img
          src="/lovable-uploads/user-comments.svg"
          alt={t('meta.title')}
          aria-hidden
          className="pointer-events-none absolute inset-0 m-auto h-full w-full object-cover opacity-20"
          loading="lazy"
        />

        <div className="relative z-10 institutional-container px-6 py-8 md:py-16 sm:px-8 md:px-10">
          <div className="m-8 mx-2 sm:mx-8 sm:mb-12 text-center text-white">
            <h2 className="mb-3 text-3xl sm:text-4xl font-bold leading-tight">
             {t('testimonials.title')}
            </h2>
            <p className="text-lg text-white/80">
            {t('testimonials.subtitle')}
            </p>
          </div>

          {/* Scroller */}
          <div className="relative">
            <div
              ref={scrollerRef}
              dir="ltr" /* make horizontal scroll logic predictable */
              className="
                flex gap-6 overflow-x-auto scroll-smooth px-1
                snap-x snap-mandatory
                [-ms-overflow-style:none] [scrollbar-width:none]
              "
              style={{ scrollPaddingInline: "12px" }}
            >
              {/* hide scrollbar (webkit) */}
              <style>
                {`.hide-scroll::-webkit-scrollbar{display:none}`}
              </style>

              {TESTIMONIALS.map((t, idx) => (
                <Card
                  key={idx}
                  className="
                    hide-scroll 
                    snap-center shrink-0
                    mx-auto flex h-[270px] w-[300px] flex-col items-center
                    rounded-2xl bg-white p-6 text-center shadow-lg shadow-black/10
                  "
                >
                  <div className="mb-4 h-16 w-16 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <p className="mb-3 text-sm text-muted-foreground line-clamp-4" dir="rtl">
                    {t.content}
                  </p>
                  <p className="font-bold text-base text-foreground" dir="rtl">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="rtl">
                    {t.position}
                  </p>
                  {t.company && (
                    <p className="text-xs text-primary" dir="rtl">
                      {t.company}
                    </p>
                  )}

                  <div className="mt-2 flex justify-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        aria-label="star"
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Arrows that scroll ONLY the scroller above */}
            
            <div className="mt-8 flex justify-center gap-3">
            <button
                type="button"
                onClick={() => scrollByPage("prev")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2E4166] shadow transition hover:bg-white"
                aria-label="التالي"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage("next")}
                
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2E4166] shadow transition hover:bg-white"
                aria-label="السابق"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
           
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
