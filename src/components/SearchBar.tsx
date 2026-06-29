"use client";

import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  locale: Locale;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, locale, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="absolute left-3.5 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-color-tertiary)" }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t(locale, "search")}
        className="w-full rounded-[10px] border border-black/6 bg-white py-2.5 pl-10 pr-4 typo-body transition-colors placeholder:text-[var(--text-color-tertiary)] hover:border-black/12 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-[6px] p-0.5 transition-colors hover:bg-black/6"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-color-tertiary)" }}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
