import { useRoute } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, BookOpen, PhoneCall, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { Footer } from "@/components/layout/Footer";
import { useLang } from "@/context/language-context";
import NotFound from "@/pages/not-found";
import { Seo } from "@/seo/Seo";
import { GlobalBookingModal } from "@/components/sections/GlobalBookingModal";
import { BorderVehicleChecker } from "@/components/sections/BorderVehicleChecker";
import { ShoppingEnquiry } from "@/components/sections/ShoppingEnquiry";
import { BlogInlineText } from "@/components/blog-inline-text";
import { BorderQueueWidget } from "@/components/sections/BorderQueueWidget";
import {
  ARTICLES,
  BLOG_BASE_RU,
  BLOG_BASE_EN,
  findArticle,
  type Block,
} from "@/data/blog-articles";
import { SITE_URL, BUSINESS } from "@/seo/seo-config";

function renderBlock(block: Block, idx: number) {
  const inline = (text: string) => block.markdown ? <BlogInlineText text={text} /> : text;
  switch (block.type) {
    case "editorial-correction":
      return (
        <div key={idx} className="rounded-2xl border border-amber-400/60 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700/50 px-5 py-5 my-6">
          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {block.heading}
          </div>
          <div className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed space-y-2">
            {block.text.split("\n\n").map((para, i) => <p key={i}>{inline(para)}</p>)}
          </div>
        </div>
      );
    case "info-notice":
      return (
        <div key={idx} className="rounded-xl border border-border bg-muted/50 px-4 py-3 my-4 text-sm text-foreground/70 leading-relaxed italic">
          {inline(block.text)}
        </div>
      );
    case "h2":
      return (
        <h2 key={idx} id={block.id} className="text-2xl font-bold text-foreground mt-10 mb-4 scroll-mt-28">
          {inline(block.text)}
        </h2>
      );
    case "h3":
      return (
        <h3 key={idx} className="text-lg font-bold text-foreground mt-6 mb-3">
          {inline(block.text)}
        </h3>
      );
    case "p":
      return (
        <p key={idx} className="text-foreground/85 leading-relaxed mb-4">
          {inline(block.text)}
        </p>
      );
    case "ul":
      return (
        <ul key={idx} className="space-y-2 mb-5 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground/85">
              <span className="text-primary mt-1.5 shrink-0">▸</span>
              <span>{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={idx} className="space-y-2 mb-5 pl-1 list-none">
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3 text-foreground/85">
              <span className="text-primary font-bold shrink-0 min-w-[24px]">{i + 1}.</span>
              <span>{inline(it)}</span>
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div
          key={idx}
          className="rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 my-6 text-foreground/90 text-sm leading-relaxed space-y-2"
        >
          {block.text.split("\n\n").map((para, i) => <p key={i}>{inline(para)}</p>)}
        </div>
      );
    case "table":
      return (
        <div key={idx} className="overflow-x-auto my-6 rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 font-bold text-foreground">
                    {inline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-foreground/85">
                      {inline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "link":
      return (
        <a
          key={idx}
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 my-5 hover:border-primary/60 hover:bg-primary/10 transition-all group"
        >
          <span className="text-primary text-lg mt-0.5 shrink-0">↗</span>
          <span>
            <span className="block font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
              {block.label}
            </span>
            {block.description && (
              <span className="block text-xs text-muted-foreground mt-0.5">{block.description}</span>
            )}
            <span className="block text-xs text-primary/70 mt-1 break-all">{block.href}</span>
          </span>
        </a>
      );
    case "img":
      return (
        <figure key={idx} className="my-7">
          <img
            src={block.src}
            alt={block.alt}
            loading="lazy"
            className="w-full rounded-2xl border border-border object-cover max-h-[520px]"
          />
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground text-center mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "liveQueue":
      return <BorderQueueWidget key={idx} />;
    case "borderChecker":
      return <BorderVehicleChecker key={idx} />;
    case "shoppingEnquiry":
      return <ShoppingEnquiry key={idx} />;
  }
}

export default function BlogArticlePage() {
  const { lang } = useLang();
  const isRu = lang === "ru";
  const base = isRu ? BLOG_BASE_RU : BLOG_BASE_EN;

  const [, paramsRu] = useRoute(`${BLOG_BASE_RU}/:slug`);
  const [, paramsEn] = useRoute(`${BLOG_BASE_EN}/:slug`);
  const slug = (paramsRu?.slug ?? paramsEn?.slug) as string | undefined;

  const article = slug ? findArticle(slug) : undefined;
  if (!article) return <NotFound />;

  const enSlug = article.slugEn ?? encodeURI(article.slug);
  const ogImage = `${SITE_URL}/og/${article.ogSlug}-${lang}.jpg`;
  const url = isRu
    ? SITE_URL + BLOG_BASE_RU + "/" + encodeURI(article.slug)
    : SITE_URL + BLOG_BASE_EN + "/" + enSlug;

  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isRu ? article.title : (article.titleEn ?? article.title),
    description: isRu ? article.description : (article.descriptionEn ?? article.description),
    url,
    articleSection: isRu ? article.category : (article.categoryEn ?? article.category),
    isAccessibleForFree: true,
    datePublished: article.dateISO,
    dateModified: article.dateModified ?? article.dateISO,
    author: {
      "@type": "Organization",
      name: article.dateModified ? "ComfortLine Editorial Team" : BUSINESS.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      logo: { "@type": "ImageObject", url: BUSINESS.logo },
    },
    image: ogImage,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: isRu ? "ru" : "en",
    keywords: article.tags.join(", "),
  };
  if (article.citation && article.citation.length > 0) {
    articleJsonLd["citation"] = article.citation;
  }

  const relatedArticles = article.related
    .map((s) => ARTICLES.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const body = isRu ? article.body : (article.bodyEn ?? article.body);
  const hasChecker = body.some((block) => block.type === "borderChecker");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        titleRu={article.seoTitle ?? `${article.title} | Блог ComfortLine`}
        titleEn={article.seoTitleEn ?? `${article.titleEn ?? article.title} | ComfortLine Blog`}
        descRu={article.description}
        descEn={article.descriptionEn ?? article.description}
        pathRu={`${BLOG_BASE_RU}/${article.slug}`}
        pathEn={`${BLOG_BASE_EN}/${enSlug}`}
        keywordsRu={article.tags.join(", ")}
        keywordsEn={article.tags.join(", ")}
        ogImage={ogImage}
        ogType="article"
        breadcrumbsRu={[
          { name: "Главная", path: "/" },
          { name: "Блог", path: BLOG_BASE_RU },
          { name: article.title, path: `${BLOG_BASE_RU}/${article.slug}` },
        ]}
        breadcrumbsEn={[
          { name: "Home", path: "/" },
          { name: "Blog", path: BLOG_BASE_EN },
          { name: article.titleEn ?? article.title, path: `${BLOG_BASE_EN}/${enSlug}` },
        ]}
        jsonLd={articleJsonLd}
      />
      <Navbar />
      {article.disclaimerBanner && <DisclaimerBanner />}

      <article className="pt-28 pb-14">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <a href={base} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-3 w-3" /> {isRu ? "Все статьи" : "All articles"}
          </a>

          <div className="flex items-center flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              {isRu ? article.category : (article.categoryEn ?? article.category)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {new Date(article.dateISO).toLocaleDateString(isRu ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readingMin} {isRu ? "мин чтения" : "min read"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            {isRu ? article.title : (article.titleEn ?? article.title)}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary/40 pl-4 italic">
            {isRu ? article.intro : (article.introEn ?? article.intro)}
          </p>
          {hasChecker && (
            <nav aria-label={isRu ? "Содержание статьи" : "Article contents"} className="mb-8 rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold text-foreground mb-3">{isRu ? "В этой статье" : "In this guide"}</p>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {body.filter((block): block is Extract<Block, { type: "h2" }> => block.type === "h2" && Boolean(block.id)).map((block) => (
                  <li key={block.id}><a href={`#${block.id}`} className="text-primary hover:underline underline-offset-4">{block.text}</a></li>
                ))}
              </ul>
            </nav>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="prose-comfortline"
          >
            {body.map(renderBlock)}
          </motion.div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-border">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {article.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>

          {/* CTA to a money page */}
          {article.ctaRoute && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 md:p-8 mt-10 text-center">
              <PhoneCall className="h-7 w-7 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                {isRu ? "Готовы заказать?" : "Ready to book?"}
              </h2>
              <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
                {isRu
                  ? "Менеджер свяжется с вами в ближайшее время и назовёт точную стоимость."
                  : "Our manager will contact you shortly with an exact price."}
              </p>
              <a
                href={isRu ? article.ctaRoute.path : article.ctaRoute.pathEn}
                className="inline-block px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                {isRu ? article.ctaRoute.label : (article.ctaRoute.labelEn ?? article.ctaRoute.label)}
              </a>
            </div>
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {isRu ? "Читайте также" : "Read also"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map((r) => (
                  <a
                    key={r.slug}
                    href={`${base}/${isRu ? encodeURI(r.slug) : (r.slugEn ?? encodeURI(r.slug))}`}
                    className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug">
                      {isRu ? r.title : (r.titleEn ?? r.title)}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {isRu ? r.description : (r.descriptionEn ?? r.description)}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-primary text-xs font-semibold">
                      {isRu ? "Читать" : "Read"} <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <GlobalBookingModal />
      <Footer />
    </div>
  );
}
