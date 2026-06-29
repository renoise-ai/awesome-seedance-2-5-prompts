"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "youware_redirect_shown";
const RENOISE_URL = "https://renoise.ai/showcase";

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel: string;
  toastMessage?: string;
  toastMessageShort?: string;
  openingLabel?: string;
  toastCta?: string;
  className?: string;
  size?: "sm" | "md";
}

interface ToastProps {
  message: string;
  visible: boolean;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

function Toast({ message, visible, ctaLabel, onCtaClick }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed top-0 left-0 right-0 z-9999 flex justify-center pointer-events-none transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
    >
      <div
        className="pointer-events-auto mt-3 mx-4 flex items-center gap-2.5 rounded-2xl px-5 py-3 shadow-lg backdrop-blur-sm"
        style={{
          background: "rgba(0, 0, 0, 0.85)",
          color: "#fff",
          maxWidth: "520px",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <circle cx="12" cy="12" r="10" fill="#34C759" />
          <polyline points="8 12 11 15 16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="typo-small-strong leading-snug">{message}</span>
        {ctaLabel && onCtaClick && (
          <button
            onClick={onCtaClick}
            className="ml-1 shrink-0 rounded-lg px-3 py-1 typo-small-strong transition-colors"
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}

function hasRedirectedThisSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markRedirected(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch { /* noop */ }
}

export default function CopyButton({
  text,
  label,
  copiedLabel,
  toastMessage,
  toastMessageShort,
  openingLabel,
  toastCta,
  className = "",
  size = "md",
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "opening">("idle");
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    setIsFirstTime(!hasRedirectedThisSession());
  }, []);

  const openRenoise = useCallback(() => {
    window.open(RENOISE_URL, "_blank", "noopener,noreferrer");
  }, []);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== "idle") return;

    await navigator.clipboard.writeText(text);
    setState("copied");

    if (isFirstTime) {
      markRedirected();
      setIsFirstTime(false);
      setTimeout(() => {
        setState("opening");
        setTimeout(() => {
          openRenoise();
          setTimeout(() => setState("idle"), 3000);
        }, 400);
      }, 800);
    } else {
      setTimeout(() => setState("idle"), 3000);
    }
  };

  const isActive = state !== "idle";
  const showToast = isActive;
  const currentToastMessage = isFirstTime
    ? (state === "opening" ? (openingLabel || "Opening Renoise…") : (toastMessage || ""))
    : (toastMessageShort || toastMessage || "");

  const buttonLabel = state === "opening" ? (openingLabel || "Opening Renoise…") :
    state === "copied" ? copiedLabel : label;

  const sizeClasses = size === "sm" ? "px-3 py-1.5 typo-small-strong" : "px-4 py-2 typo-body-strong";

  return (
    <>
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 rounded-full transition-all ${
          isActive
            ? "bg-success/10 text-success"
            : "bg-brand text-white hover:bg-brand/90"
        } ${sizeClasses} ${className}`}
      >
        {isActive ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
        {buttonLabel}
      </button>
      {currentToastMessage && (
        <Toast
          message={currentToastMessage}
          visible={showToast}
          ctaLabel={!isFirstTime && isActive ? toastCta : undefined}
          onCtaClick={!isFirstTime && isActive ? openRenoise : undefined}
        />
      )}
    </>
  );
}
