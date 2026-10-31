import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import { Seo } from "@/seo/Seo";
import { ARTICLES, BLOG_BASE_RU, BLOG_BASE_EN } from "@/data/blog-articles";
import { SITE_URL } from "@/seo/seo-config";

export default function BlogIndexPage() {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const base = isRu ? BLOG_BASE_RU : BLOG_BASE_EN;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isRu ? "Блог ComfortLine" : "ComfortLine Blog",
    itemListElement: ARTICLES.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: isRu
        ? SITE_URL + BLOG_BASE_RU + "/" + encodeURI(a.slug)
        : SITE_URL + BLOG_BASE_EN + "/" + (a.slugEn ?? encodeURI(a.slug)),
      name: isRu ? a.title : (a.titleEn ?? a.title),
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu="Блог ComfortLine — гайды по трансферу, границе и аэропортам"
        titleEn="ComfortLine Blog — guides on transfers, border and airports"
        descRu="Гайды по трансферу из Минска: пересечение границы Беларусь–Литва, стоимость поездок, что нельзя ввозить в ЕС, выбор КПП, советы для семей с детьми."
        descEn="Guides on Minsk transfers: Belarus–Lithuania border crossings, pricing, EU customs rules, picking a border checkpoint, family travel tips."
        pathRu={BLOG_BASE_RU}
        pathEn={BLOG_BASE_EN}
        keywordsRu="блог комфортлайн, гайд по границе, трансфер советы, как пересечь границу беларусь литва, минск варшава цена"
        keywordsEn="comfortline blog, border crossing guide, transfer tips, minsk transfers"
        ogImage={`${SITE_URL}/og/blog-index-${lang}.jpg`}
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: "Блог", path: BLOG_BASE_RU },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: "Blog", path: BLOG_BASE_EN },
        ]}
        jsonLd={itemListJsonLd}
      />
      <Navbar />

      <div className="pt-28 pb-14 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">
            {isRu ? "Блог" : "Blog"}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            {isRu ? "Блог ComfortLine" : "ComfortLine Blog"}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
            {isRu
              ? "Практические гайды по трансферу, пересечению границы и аэропортам Европы. Опыт водителей ComfortLine за 8 лет работы."
              : "Practical guides on transfers, border crossings and European airports. 8 years of ComfortLine driver experience."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ARTICLES.map((a, i) => (
            <motion.a
              key={a.slug}
              href={isRu ? `${BLOG_BASE_RU}/${encodeURI(a.slug)}` : `${BLOG_BASE_EN}/${a.slugEn ?? encodeURI(a.slug)}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="block bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  {a.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {new Date(a.dateISO).toLocaleDateString(isRu ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {a.readingMin} {isRu ? "мин" : "min"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                {isRu ? a.title : (a.titleEn ?? a.title)}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {isRu ? a.description : (a.descriptionEn ?? a.description)}
              </p>
              <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold">
                {isRu ? "Читать" : "Read"} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
