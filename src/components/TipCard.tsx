"use client";

import type { Prompt } from "@/types/prompt";
import type { Locale } from "@/lib/i18n";
import { getLocalized } from "@/lib/prompt-utils";
import { t } from "@/lib/i18n";
import CopyButton from "./CopyButton";

interface TipCardProps {
  tip: Prompt;
  locale: Locale;
  onClick: () => void;
}

const ACCENT_COLORS = [
  { bg: "from-amber-50 to-orange-50", icon: "text-amber-500", border: "border-amber-200/60" },
  { bg: "from-sky-50 to-blue-50", icon: "text-sky-500", border: "border-sky-200/60" },
  { bg: "from-emerald-50 to-green-50", icon: "text-emerald-500", border: "border-emerald-200/60" },
  { bg: "from-violet-50 to-purple-50", icon: "text-violet-500", border: "border-violet-200/60" },
  { bg: "from-rose-50 to-pink-50", icon: "text-rose-500", border: "border-rose-200/60" },
  { bg: "from-cyan-50 to-teal-50", icon: "text-cyan-500", border: "border-cyan-200/60" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export default function TipCard({ tip, locale, onClick }: TipCardProps) {
  const title = getLocalized(tip, "title", locale);
  const content = getLocalized(tip, "content", locale);

  const accent = ACCENT_COLORS[hashString(tip.id) % ACCENT_COLORS.length];

  return (
    <div
      onClick={onClick}
      className={`group flex h-full cursor-pointer flex-col rounded-[20px] border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${accent.border}`}
    >
      {/* Accent header */}
      <div className={`flex items-start gap-3 rounded-t-[20px] bg-linear-to-br ${accent.bg} p-5 pb-4`}>
        <div className={`mt-0.5 shrink-0 ${accent.icon}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <h3
          className="typo-h3 line-clamp-2 leading-snug"
          style={{ color: "var(--text-color-primary)" }}
        >
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 pt-3">
        <p
          className="typo-small mb-4 line-clamp-4 flex-1 leading-relaxed"
          style={{ color: "var(--text-color-secondary)" }}
        >
          {content}
        </p>

        {/* Tags */}
        {tip.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tip.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/6 px-2.5 py-1 typo-ex-small"
                style={{ color: "var(--text-color-secondary)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/6 pt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10">
              <span className="typo-ex-small font-semibold text-brand">
                {tip.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="typo-small" style={{ color: "var(--text-color-tertiary)" }}>
              {tip.author.name}
            </span>
          </div>

          <CopyButton
            text={content}
            label={t(locale, "copyContent")}
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
