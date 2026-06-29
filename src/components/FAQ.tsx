"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { getFaq } from "@/lib/faq";

interface FAQProps {
  locale: Locale;
}

export default function FAQ({ locale }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = getFaq(locale);

  return (
    <section className="border-t border-black/6 bg-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="typo-h2 mb-8 text-center" style={{ color: "var(--text-color-primary)" }}>
          {t(locale, "faqTitle")}
        </h2>
        <div className="divide-y divide-black/6 rounded-2xl border border-black/6">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-black/2"
                >
                  <span className="typo-body-strong" style={{ color: "var(--text-color-primary)" }}>
                    {item.question}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--text-color-tertiary)" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`grid transition-all duration-200 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className="typo-body px-6 pb-5 leading-relaxed"
                      style={{ color: "var(--text-color-secondary)" }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
