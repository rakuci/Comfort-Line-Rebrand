import { useState, useEffect, useCallback, useRef } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/language-context";

const PER_PAGE = 3;

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-60%" : "60%",
    opacity: 0,
  }),
};

export function Reviews() {
  const { t, lang } = useLang();
  const items = t.reviews.items;
  const totalPages = Math.ceil(items.length / PER_PAGE);

  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (next: number, direction: number) => {
      setDir(direction);
      setPage(next);
    },
    []
  );

  const prev = useCallback(() => {
    goTo((page - 1 + totalPages) % totalPages, -1);
  }, [page, totalPages, goTo]);

  const next = useCallback(() => {
    goTo((page + 1) % totalPages, 1);
  }, [page, totalPages, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDir(1);
      setPage(p => (p + 1) % totalPages);
    }, 5000);
  }, [totalPages]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [page, resetTimer]);

  const visible = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="reviews" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 w-[600px] h-[600px] bg-primary/4 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3">
            {t.reviews.label}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            {t.reviews.heading}
          </h3>
          <a href="https://www.instagram.com/transfer_comfortline/reels/" target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-primary underline underline-offset-4">
            {lang === "ru" ? "Видеоотзывы пассажиров в Instagram Reels" : "Watch passenger testimonials on Instagram Reels"}
          </a>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visible.map((review, index) => (
                  <div
                    key={`${page}-${index}`}
                    className="bg-card border border-border p-7 rounded-2xl relative flex flex-col"
                  >
                    <Quote className="absolute top-5 right-5 h-9 w-9 text-primary/10 rotate-180" />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>

                    <p className="text-card-foreground/90 italic leading-relaxed text-sm flex-1 mb-6">
                      "{review.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center font-bold text-base text-primary uppercase shrink-0">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm leading-tight">{review.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{review.city}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={() => { prev(); resetTimer(); }}
            aria-label="Previous"
            className="absolute -left-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-foreground hover:text-primary hover:border-primary/40 transition-colors shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => { next(); resetTimer(); }}
            aria-label="Next"
            className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border text-foreground hover:text-primary hover:border-primary/40 transition-colors shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots + mobile arrows */}
        <div className="flex items-center justify-center gap-4 mt-10">
          {/* Mobile prev */}
          <button
            onClick={() => { prev(); resetTimer(); }}
            aria-label="Previous"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border text-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i, i > page ? 1 : -1); resetTimer(); }}
                aria-label={`Page ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === page
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>

          {/* Mobile next */}
          <button
            onClick={() => { next(); resetTimer(); }}
            aria-label="Next"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border text-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Review counter */}
        <p className="text-center text-xs text-muted-foreground/50 mt-3">
          {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, items.length)} / {items.length}
        </p>
      </div>
    </section>
  );
}
