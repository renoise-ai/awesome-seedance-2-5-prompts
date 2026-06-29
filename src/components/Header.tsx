"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LOCALES, LOCALE_LABELS, t } from "@/lib/i18n";

interface HeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  promptCount: number;
  countLabel?: string;
}

export default function Header({ locale, onLocaleChange, promptCount, countLabel }: HeaderProps) {
  const [langOpen, setLangOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/6 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="typo-body-strong" style={{ color: "var(--text-color-primary)" }}>
            Seedance Prompts
          </span>
          <span className="typo-ex-small rounded-full bg-brand/10 px-2 py-0.5 text-brand">
            {promptCount} {countLabel ?? t(locale, "promptCount")}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-[10px] border border-black/6 px-3 py-1.5 typo-small transition-colors hover:bg-black/3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {LOCALE_LABELS[locale]}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 min-w-[160px] rounded-[20px] border border-black/6 bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onLocaleChange(loc);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-[12px] px-3 py-2 typo-body transition-colors hover:bg-black/3 ${
                        locale === loc ? "bg-brand/5 text-brand" : ""
                      }`}
                    >
                      {LOCALE_LABELS[loc]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/renoise-ai/awesome-seedance-2-5-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors hover:bg-black/3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
