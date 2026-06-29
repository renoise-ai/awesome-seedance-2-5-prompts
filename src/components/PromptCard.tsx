"use client";

import type { Prompt } from "@/types/prompt";
import type { Locale } from "@/lib/i18n";
import { getLocalized } from "@/lib/prompt-utils";
import { t } from "@/lib/i18n";
import CopyButton from "./CopyButton";

interface PromptCardProps {
  prompt: Prompt;
  locale: Locale;
  onClick: () => void;
  disableVideo?: boolean;
}

export default function PromptCard({ prompt, locale, onClick, disableVideo }: PromptCardProps) {
  const title = getLocalized(prompt, "title", locale);
  const description = getLocalized(prompt, "description", locale);
  const content = getLocalized(prompt, "content", locale);

  const hasVideo = !!prompt.videoUrl && !disableVideo;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-[30px] border border-black/6 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-[30px] bg-grey3">
        {hasVideo ? (
          <video
            src={prompt.videoUrl}
            poster={prompt.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : prompt.thumbnail ? (
          <img
            src={prompt.thumbnail}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-end bg-linear-to-b from-slate-50 to-slate-100 p-5">
            <p className="line-clamp-4 typo-small leading-relaxed" style={{ color: "var(--text-color-secondary)" }}>
              {content}
            </p>
          </div>
        )}

        {prompt.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-orange2 px-2.5 py-1 typo-ex-small font-semibold text-orange1">
            {t(locale, "featured")}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3
          className="typo-h3 mb-2 line-clamp-2"
          style={{ color: "var(--text-color-primary)" }}
        >
          {title}
        </h3>
        <p
          className="typo-small mb-4 line-clamp-2"
          style={{ color: "var(--text-color-secondary)" }}
        >
          {description}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {prompt.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/6 px-2.5 py-1 typo-ex-small"
              style={{ color: "var(--text-color-secondary)" }}
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 4 && (
            <span className="rounded-full bg-grey3 px-2.5 py-1 typo-ex-small" style={{ color: "var(--text-color-tertiary)" }}>
              +{prompt.tags.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10">
              <span className="typo-ex-small font-semibold text-brand">
                {prompt.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="typo-small" style={{ color: "var(--text-color-tertiary)" }}>
              {prompt.author.name}
            </span>
          </div>

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
      </div>
    </div>
  );
}
