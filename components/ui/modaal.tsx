"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const BREEDTES = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
} as const;

/**
 * Modaal — die standaard dialoog.
 *
 * Doen die goed wat 'n dialoog moet doen en wat maklik is om te vergeet:
 * fokus binne-in vasgevang, Escape sluit, agtergrond klik sluit, die bladsy
 * agter rol nie, en fokus keer terug na die knoppie wat dit oopgemaak het.
 */
export function Modaal({
  oop,
  sluit,
  titel,
  beskrywing,
  breedte = "md",
  voet,
  children,
}: {
  oop: boolean;
  sluit: () => void;
  titel: string;
  beskrywing?: string;
  breedte?: keyof typeof BREEDTES;
  voet?: ReactNode;
  children: ReactNode;
}) {
  const paneel = useRef<HTMLDivElement>(null);
  const vorigeFokus = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    if (!oop) return;

    vorigeFokus.current = document.activeElement as HTMLElement | null;

    // Rol die bladsy agter die modaal vas sonder dat die inhoud verspring.
    const wydte = window.innerWidth - document.documentElement.clientWidth;
    const vorigeOverflow = document.body.style.overflow;
    const vorigePadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (wydte > 0) document.body.style.paddingRight = `${wydte}px`;

    // Op 'n raakskerm laat ons die eerste veld met rus: dit ruk andersins die
    // sleutelbord oop voordat die gebruiker die titel gelees het. Die paneel
    // self kry fokus, sodat skermlesers steeds binne die dialoog begin.
    const raak = window.matchMedia("(pointer: coarse)").matches;
    const eerste = raak
      ? null
      : paneel.current?.querySelector<HTMLElement>(
          'input:not([type="hidden"]), textarea, select, button:not([data-sluit])',
        );
    (eerste ?? paneel.current)?.focus();

    function sleutel(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        sluit();
        return;
      }
      if (e.key !== "Tab" || !paneel.current) return;

      const fokusbaar = paneel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (fokusbaar.length === 0) return;
      const eerste = fokusbaar[0];
      const laaste = fokusbaar[fokusbaar.length - 1];

      if (e.shiftKey && document.activeElement === eerste) {
        e.preventDefault();
        laaste.focus();
      } else if (!e.shiftKey && document.activeElement === laaste) {
        e.preventDefault();
        eerste.focus();
      }
    }

    document.addEventListener("keydown", sleutel, true);
    return () => {
      document.removeEventListener("keydown", sleutel, true);
      document.body.style.overflow = vorigeOverflow;
      document.body.style.paddingRight = vorigePadding;
      vorigeFokus.current?.focus?.();
    };
  }, [oop, sluit]);

  if (!oop) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden bg-[#141320]/45 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) sluit();
      }}
      role="presentation"
    >
      <div
        ref={paneel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titel`}
        aria-describedby={beskrywing ? `${id}-besk` : undefined}
        tabIndex={-1}
        className={cn(
          // Op 'n foon 'n bodemblad: dit kom uit die duim se rigting, en die
          // voetknoppies bly binne bereik. Van `sm` af 'n gewone dialoog.
          "border-line bg-surface flex max-h-[92dvh] w-full flex-col rounded-t-2xl border shadow-[0_28px_70px_-20px_rgba(20,19,32,0.5)] outline-none sm:max-h-full sm:rounded-xl",
          BREEDTES[breedte],
        )}
      >
        <div
          aria-hidden
          className="flex shrink-0 justify-center pt-2 pb-0.5 sm:hidden"
        >
          <span className="bg-line h-1 w-9 rounded-full" />
        </div>

        <div className="border-line flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4">
          <div className="min-w-0">
            <h2 id={`${id}-titel`} className="font-display text-lg font-semibold text-balance sm:text-xl">
              {titel}
            </h2>
            {beskrywing ? (
              <p id={`${id}-besk`} className="text-ink-muted mt-0.5 text-sm">
                {beskrywing}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            data-sluit
            onClick={sluit}
            aria-label="Maak toe"
            className="text-ink-muted hover:bg-stage hover:text-ink focus-visible:outline-accent -mt-1 -mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 sm:-mr-2 sm:size-9"
          >
            <X size={18} strokeWidth={2} aria-hidden />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
          {children}
        </div>

        {voet ? (
          <div className="border-line bg-ground/60 veilig-onder flex shrink-0 flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:rounded-b-xl sm:px-6 sm:py-3.5 [&>*]:w-full sm:[&>*]:w-auto">
            {voet}
          </div>
        ) : null}
      </div>
    </div>
  );
}
