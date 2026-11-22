import { useEffect, useRef, useState } from "react";
import { Instagram, ExternalLink, ChevronDown } from "lucide-react";
import { useLang } from "@/context/language-context";
import { instagramPostUrls } from "@/data/instagramPosts";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

type InstagramVideo = { id: string; caption?: string; media_url: string; thumbnail_url?: string; permalink: string };

const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";
const INITIAL_VISIBLE = 9;
const LOAD_INCREMENT = 9;

function ensureEmbedScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.instgrm?.Embeds) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export function InstagramFeed() {
  const { t } = useLang();
  const i = t.instagram;
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const [videos, setVideos] = useState<InstagramVideo[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/instagram/posts", { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (Array.isArray(data?.posts)) setVideos(data.posts);
      })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setReady(true); });
    return () => controller.abort();
  }, []);

  const total = videos.length || instagramPostUrls.length;
  const shown = instagramPostUrls.slice(0, visible);
  const hasMore = visible < total;

  useEffect(() => {
    if (!ready || videos.length || shown.length === 0) return;
    let cancelled = false;
    ensureEmbedScript().then(() => {
      if (cancelled) return;
      window.instgrm?.Embeds.process();
    });
    return () => {
      cancelled = true;
    };
  }, [ready, videos.length, shown.length]);

  if (total === 0) return null;

  return (
    <section
      id="instagram"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-primary font-semibold tracking-wider uppercase text-sm mb-3 flex items-center justify-center gap-2">
            <Instagram className="h-4 w-4" />
            {i.label}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {i.heading}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {i.subheading}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
        >
          {videos.length ? videos.slice(0, visible).map(video => (
            <article key={video.id} className="w-full max-w-[400px] overflow-hidden rounded-xl border border-border bg-card">
              <video src={video.media_url} poster={video.thumbnail_url} controls playsInline preload="none"
                aria-label={video.caption || i.label} className="aspect-[9/16] w-full bg-black object-contain" />
              <div className="p-4">
                {video.caption && <p className="mb-2 line-clamp-2 text-sm">{video.caption}</p>}
                <a href={video.permalink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">{i.viewOnInstagram}</a>
              </div>
            </article>
          )) : shown.map((url) => (
            <blockquote
              key={url}
              className="instagram-media w-full max-w-[400px]"
              data-instgrm-permalink={url}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "12px",
                boxShadow:
                  "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: 0,
                padding: 0,
                width: "100%",
                minHeight: 320,
              }}
            >
              {/* Fallback shown when Instagram's embed.js fails to render
                  (deleted post, region block, ad-blocker, slow load).
                  embed.js replaces this content on success. */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  width: "100%",
                  height: 320,
                  padding: 24,
                  color: "#262626",
                  textDecoration: "none",
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
                aria-label={`${i.label}: ${url}`}
              >
                <Instagram
                  style={{ width: 32, height: 32, color: "#E1306C" }}
                  aria-hidden="true"
                />
                <span>{i.viewOnInstagram}</span>
                <span style={{ fontSize: 12, color: "#8e8e8e" }}>
                  {url.replace("https://www.instagram.com", "")}
                </span>
              </a>
            </blockquote>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          {hasMore && (
            <button
              type="button"
              onClick={() =>
                setVisible((v) => Math.min(v + LOAD_INCREMENT, total))
              }
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              {i.loadMore}
              <ChevronDown className="h-4 w-4" />
              <span className="opacity-70">
                ({Math.min(LOAD_INCREMENT, total - visible)} / {total - visible})
              </span>
            </button>
          )}
          <a
            href={i.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
          >
            <Instagram className="h-4 w-4" />
            {i.cta}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
