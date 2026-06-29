"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Prompt } from "@/types/prompt";
import type { Locale } from "@/lib/i18n";
import { t, detectLocale, persistLocale } from "@/lib/i18n";
import { getLocalized, getAllTags } from "@/lib/prompt-utils";
import Header from "@/components/Header";
import TagFilter from "@/components/TagFilter";
import PromptCard from "@/components/PromptCard";
import TipCard from "@/components/TipCard";
import CopyButton from "@/components/CopyButton";
import VideoPlayer from "@/components/VideoPlayer";
import FAQ from "@/components/FAQ";

type Section = "prompts" | "tips";

interface GalleryClientProps {
  prompts: Prompt[];
  tips: Prompt[];
}

export default function GalleryClient({ prompts, tips }: GalleryClientProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const [section, setSection] = useState<Section>("prompts");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    const detected = detectLocale();
    setLocale(detected);
    persistLocale(detected);
  }, []);

  const handleLocaleChange = useCallback((loc: Locale) => {
    setLocale(loc);
    persistLocale(loc);
  }, []);

  const items = section === "prompts" ? prompts : tips;
  const isTips = section === "tips";
  const tags = useMemo(() => getAllTags(items), [items]);

  const filtered = useMemo(() => {
    const result = items.filter((p) => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      return true;
    });
    if (isTips) {
      result.sort((a, b) => {
        const aHasVisual = a.thumbnail || a.videoUrl ? 1 : 0;
        const bHasVisual = b.thumbnail || b.videoUrl ? 1 : 0;
        return bHasVisual - aHasVisual;
      });
    }
    return result;
  }, [items, activeTag, isTips]);

  function switchSection(s: Section) {
    setSection(s);
    setActiveTag(null);
  }

  const totalCount = prompts.length + tips.length;

  const uniqueAuthors = useMemo(() => {
    const all = [...prompts, ...tips];
    return new Set(all.map((p) => p.author.name)).size;
  }, [prompts, tips]);

  return (
    <div className="min-h-screen">
      <Header locale={locale} onLocaleChange={handleLocaleChange} promptCount={prompts.length} countLabel={t(locale, "promptCount")} />

      {/* Hero: compact with CTA */}
      <section className="border-b border-black/6 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left: title + subtitle */}
          <div className="text-center md:text-left">
            <h1 className="typo-h1 mb-2" style={{ color: "var(--text-color-primary)" }}>
              {t(locale, "title")}
            </h1>
            <p className="typo-body max-w-lg" style={{ color: "var(--text-color-secondary)" }}>
              {t(locale, "subtitle")}
            </p>
            {/* Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 typo-small" style={{ color: "var(--text-color-tertiary)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M3 9h18" /></svg>
                <strong className="font-semibold" style={{ color: "var(--text-color-primary)" }}>{prompts.length}</strong> {t(locale, "statsPrompts")}
              </span>
              <span className="inline-flex items-center gap-1.5 typo-small" style={{ color: "var(--text-color-tertiary)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                <strong className="font-semibold" style={{ color: "var(--text-color-primary)" }}>{tips.length}</strong> {t(locale, "statsTips")}
              </span>
              <span className="inline-flex items-center gap-1.5 typo-small" style={{ color: "var(--text-color-tertiary)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                <strong className="font-semibold" style={{ color: "var(--text-color-primary)" }}>{uniqueAuthors}</strong> {t(locale, "statsContributors")}
              </span>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex shrink-0 flex-col items-center gap-2.5 sm:flex-row">
            <a
              href="https://renoise.ai/showcase"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 typo-body-strong text-white shadow-md shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/25"
            >
              {t(locale, "ctaBuild")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://github.com/renoise-ai/awesome-seedance-2-5-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 typo-body transition-all hover:border-black/20 hover:shadow-sm"
              style={{ color: "var(--text-color-secondary)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Sticky filter bar with tabs */}
      <div className="sticky top-14 z-20 border-b border-black/6 bg-fill-secondary/80 px-6 py-2.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          {/* Section tabs */}
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-black/4 p-0.5">
            <button
              onClick={() => switchSection("prompts")}
              className={`rounded-full px-4 py-1.5 typo-small transition-all ${
                section === "prompts" ? "bg-white shadow-sm" : "hover:bg-white/50"
              }`}
              style={{ color: section === "prompts" ? "var(--text-color-primary)" : "var(--text-color-secondary)" }}
            >
              {t(locale, "tabPrompts")}
              <span className="ml-1.5 typo-ex-small rounded-full bg-brand/10 px-1.5 py-0.5 text-brand">{prompts.length}</span>
            </button>
            <button
              onClick={() => switchSection("tips")}
              className={`rounded-full px-4 py-1.5 typo-small transition-all ${
                section === "tips" ? "bg-white shadow-sm" : "hover:bg-white/50"
              }`}
              style={{ color: section === "tips" ? "var(--text-color-primary)" : "var(--text-color-secondary)" }}
            >
              {t(locale, "tabTips")}
              <span className="ml-1.5 typo-ex-small rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-700">{tips.length}</span>
            </button>
          </div>

          {tags.length > 0 && (
            <>
              <div className="h-5 w-px bg-black/10" />
              <div className="flex-1 overflow-x-auto">
                <TagFilter
                  tags={tags}
                  activeTag={activeTag}
                  onTagChange={setActiveTag}
                  locale={locale}
                  showFeatured={false}
                  featuredActive={false}
                  onFeaturedToggle={() => {}}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, idx) => (
                <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(idx, 8) * 50}ms`, animationFillMode: "both" }}>
                  {isTips && !item.thumbnail && !item.videoUrl ? (
                    <TipCard
                      tip={item}
                      locale={locale}
                      onClick={() => setSelectedPrompt(item)}
                    />
                  ) : (
                    <PromptCard
                      prompt={item}
                      locale={locale}
                      onClick={() => setSelectedPrompt(item)}
                      disableVideo={isTips}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-grey2 p-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-color-secondary)" }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3 className="typo-h2 mb-2" style={{ color: "var(--text-color-primary)" }}>
                {t(locale, isTips ? "noTipsResults" : "noResults")}
              </h3>
              <p className="typo-body" style={{ color: "var(--text-color-secondary)" }}>
                {t(locale, isTips ? "noTipsResultsHint" : "noResultsHint")}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FAQ */}
      <FAQ locale={locale} />

      {/* Footer with light Renoise mention */}
      <footer className="border-t border-black/6 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="typo-small" style={{ color: "var(--text-color-tertiary)" }}>
            {t(locale, "footerCurated").replace("{total}", String(totalCount)).replace("{authors}", String(uniqueAuthors))}
          </p>
          <a
            href="https://renoise.ai/showcase"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand/8 px-4 py-1.5 typo-small text-brand transition-colors hover:bg-brand/15"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Powered by Renoise
          </a>
        </div>
      </footer>

      {/* Detail Drawer */}
      {selectedPrompt && (
        <PromptDrawer
          prompt={selectedPrompt}
          locale={locale}
          isTip={isTips}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
}

/* ===== Prompt Detail Drawer ===== */

interface PromptDrawerProps {
  prompt: Prompt;
  locale: Locale;
  isTip: boolean;
  onClose: () => void;
}

function PromptDrawer({ prompt, locale, isTip, onClose }: PromptDrawerProps) {
  const [activeTab, setActiveTab] = useState<"prompt" | "tips">("prompt");

  const title = getLocalized(prompt, "title", locale);
  const content = getLocalized(prompt, "content", locale);
  const description = getLocalized(prompt, "description", locale);
  const tips = getLocalized(prompt, "tips", locale);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/6 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
              <span className="typo-small-strong text-brand">
                {prompt.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                {prompt.author.link ? (
                  <a href={prompt.author.link} target="_blank" rel="noopener noreferrer" className="typo-body-strong text-brand hover:underline">
                    {prompt.author.name}
                  </a>
                ) : (
                  <span className="typo-body-strong" style={{ color: "var(--text-color-primary)" }}>{prompt.author.name}</span>
                )}
                {prompt.sourceLink && (
                  <a
                    href={prompt.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-black/8 px-2 py-0.5 typo-ex-small transition-colors hover:bg-black/4"
                    style={{ color: "var(--text-color-tertiary)" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                    {t(locale, "source")}
                  </a>
                )}
              </div>
              {prompt.sourcePublishedAt && (
                <p className="typo-ex-small" style={{ color: "var(--text-color-tertiary)" }}>{prompt.sourcePublishedAt}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-color-secondary)" }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5">
            {title && title !== content && (
              <h2 className="typo-h2 mb-2" style={{ color: "var(--text-color-primary)" }}>{title}</h2>
            )}

            {description && description !== content && description !== title && (
              <p className="typo-small mb-4 leading-relaxed" style={{ color: "var(--text-color-secondary)" }}>{description}</p>
            )}

            {tips && !isTip && (
              <div className="mb-4 flex items-center gap-1 rounded-[12px] bg-grey2 p-1">
                <button
                  onClick={() => setActiveTab("prompt")}
                  className={`rounded-[10px] px-4 py-2 typo-small transition-all ${activeTab === "prompt" ? "bg-white shadow-sm" : ""}`}
                  style={{ color: activeTab === "prompt" ? "var(--text-color-primary)" : "var(--text-color-secondary)" }}
                >
                  {t(locale, "prompt")}
                </button>
                <button
                  onClick={() => setActiveTab("tips")}
                  className={`rounded-[10px] px-4 py-2 typo-small transition-all ${activeTab === "tips" ? "bg-white shadow-sm" : ""}`}
                  style={{ color: activeTab === "tips" ? "var(--text-color-primary)" : "var(--text-color-secondary)" }}
                >
                  {t(locale, "tips")}
                </button>
              </div>
            )}

            {activeTab === "prompt" || isTip ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="typo-small-strong" style={{ color: "var(--text-color-secondary)" }}>
                    {isTip ? t(locale, "tips") : t(locale, "prompt")}
                  </h3>
                  <CopyButton
                    text={content}
                    label={t(locale, "copyPrompt")}
                    copiedLabel={t(locale, "copied")}
                    toastMessage={t(locale, "copiedToast")}
                    toastMessageShort={t(locale, "copiedToastShort")}
                    openingLabel={t(locale, "copiedOpening")}
                    toastCta={t(locale, "toastCta")}
                    size="sm"
                  />
                </div>
                <div
                  className="rounded-[16px] bg-fill-secondary p-4 typo-small leading-relaxed whitespace-pre-wrap"
                  style={{ color: "var(--text-color-primary)", fontFamily: "var(--font-mono)" }}
                >
                  {content}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="typo-small-strong mb-2" style={{ color: "var(--text-color-secondary)" }}>{t(locale, "tips")}</h3>
                <p className="typo-small leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-color-secondary)" }}>{tips}</p>
              </div>
            )}
          </div>

          {prompt.videoUrl && (
            <div className="px-6 pb-2">
              <h3 className="typo-small-strong mb-2" style={{ color: "var(--text-color-secondary)" }}>
                {t(locale, "preview")}
              </h3>
              <VideoPlayer src={prompt.videoUrl} poster={prompt.thumbnail} className="aspect-video w-full rounded-[16px]" />
            </div>
          )}

          <div className="px-6 py-4">
            {prompt.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/6 px-2.5 py-1 typo-ex-small" style={{ color: "var(--text-color-secondary)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
