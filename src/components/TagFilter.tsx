"use client";

import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  locale: Locale;
  showFeatured?: boolean;
  featuredActive?: boolean;
  onFeaturedToggle?: () => void;
}

export default function TagFilter({
  tags,
  activeTag,
  onTagChange,
  locale,
  showFeatured = true,
  featuredActive = false,
  onFeaturedToggle,
}: TagFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All button */}
      <button
        onClick={() => onTagChange(null)}
        className={`rounded-full px-3.5 py-1.5 typo-small transition-colors ${
          !activeTag && !featuredActive
            ? "bg-brand text-white"
            : "border border-black/6 bg-white hover:bg-black/3"
        }`}
        style={activeTag || featuredActive ? { color: "var(--text-color-secondary)" } : undefined}
      >
        {t(locale, "allTags")}
      </button>

      {/* Featured button */}
      {showFeatured && onFeaturedToggle && (
        <button
          onClick={onFeaturedToggle}
          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 typo-small transition-colors ${
            featuredActive
              ? "bg-orange2 text-orange1"
              : "border border-black/6 bg-white hover:bg-black/3"
          }`}
          style={!featuredActive ? { color: "var(--text-color-secondary)" } : undefined}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {t(locale, "featured")}
        </button>
      )}

      {/* Separator */}
      <div className="mx-1 h-5 w-px bg-black/6" />

      {/* Tag pills */}
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(activeTag === tag ? null : tag)}
          className={`rounded-full px-3 py-1.5 typo-small transition-colors ${
            activeTag === tag
              ? "bg-brand/10 text-brand"
              : "border border-black/6 bg-white hover:bg-black/3"
          }`}
          style={activeTag !== tag ? { color: "var(--text-color-secondary)" } : undefined}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
