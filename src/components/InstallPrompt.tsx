"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "stilify-install-dismissed-at";
const DISMISS_DAYS = 14;

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  const ua = navigator.userAgent;
  const isIPhoneOrIPad = /iPad|iPhone|iPod/.test(ua);
  const isIPadOS13Plus = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isIPhoneOrIPad || isIPadOS13Plus;
}

function recentlyDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  const days = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return days < DISMISS_DAYS;
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    if (isIOS()) {
      setIos(true);
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-50 mx-auto max-w-md px-5">
      <div className="frame-tick relative border border-ink bg-paper-raised p-4 shadow-lg">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Stäng"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center font-mono text-ink-soft"
        >
          ×
        </button>

        <p className="pr-6 font-mono text-[10px] uppercase tracking-widest text-rust">
          Installera appen
        </p>
        <p className="mt-1 font-display text-xl uppercase tracking-wide text-ink">
          Lägg till Stilify på hemskärmen
        </p>

        {ios ? (
          <p className="mt-2 text-sm text-ink-soft">
            Tryck på Dela-ikonen{" "}
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="inline-block h-4 w-4 -translate-y-px align-middle"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V4" />
              <path d="M7 9l5-5 5 5" />
              <rect x="5" y="12" width="14" height="8" rx="1.5" />
            </svg>{" "}
            i Safari och välj <strong>Lägg till på hemskärmen</strong>.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink-soft">
              Snabbare åtkomst till kameran, som en riktig app.
            </p>
            <button
              type="button"
              onClick={handleInstall}
              className="mt-3 w-full border border-ink bg-rust px-5 py-2.5 font-mono text-sm uppercase tracking-widest text-paper"
            >
              Installera
            </button>
          </>
        )}
      </div>
    </div>
  );
}
