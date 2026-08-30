"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Binne-bladsy oortjies — die patroon uit Instellings en Lidmate, op een plek.
 *
 * Volg die WAI-ARIA tabs-patroon: pyltjies beweeg tussen oortjies, en die
 * paneel is aan sy oortjie gekoppel.
 */
export type OortjieItem<T extends string> = {
  sleutel: T;
  etiket: string;
  ikoon?: LucideIcon;
  telling?: number;
  /** Beklemtoon die telling — bv. registrasies wat wag. */
  dringend?: boolean;
};

export function Oortjies<T extends string>({
  items,
  aktief,
  kies,
  etiket,
}: {
  items: OortjieItem<T>[];
  aktief: T;
  kies: (sleutel: T) => void;
  etiket: string;
}) {
  function sleutelaf(e: React.KeyboardEvent, i: number) {
    const rigting =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -i : e.key === "End" ? items.length - 1 - i : 0;
    if (rigting === 0) return;
    e.preventDefault();
    const volgende = (i + rigting + items.length) % items.length;
    kies(items[volgende].sleutel);
    document.getElementById(`oortjie-${items[volgende].sleutel}`)?.focus();
  }

  return (
    <div role="tablist" aria-label={etiket} className="border-line scrollbar-none flex items-center gap-1 overflow-x-auto overflow-y-hidden border-b pb-px">
      {items.map((o, i) => {
        const aan = o.sleutel === aktief;
        const Ikoon = o.ikoon;
        return (
          <button
            key={o.sleutel}
            id={`oortjie-${o.sleutel}`}
            role="tab"
            type="button"
            aria-selected={aan}
            aria-controls={`paneel-${o.sleutel}`}
            tabIndex={aan ? 0 : -1}
            onClick={() => kies(o.sleutel)}
            onKeyDown={(e) => sleutelaf(e, i)}
            className={cn(
              "focus-visible:outline-accent -mb-px flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-2.5 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2",
              aan
                ? "border-brand text-ink font-semibold"
                : "text-ink-muted hover:text-ink border-transparent",
            )}
          >
            {Ikoon ? <Ikoon size={15} strokeWidth={2} aria-hidden /> : null}
            {o.etiket}
            {typeof o.telling === "number" ? (
              o.dringend && o.telling > 0 ? (
                <span className="bg-accent rounded-full px-1.5 py-0.5 text-[0.68rem] font-bold text-white">
                  {o.telling}
                </span>
              ) : (
                <span className="tabular text-ink-muted">{o.telling}</span>
              )
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function OortjiePaneel<T extends string>({
  sleutel,
  aktief,
  children,
}: {
  sleutel: T;
  aktief: T;
  children: ReactNode;
}) {
  if (sleutel !== aktief) return null;
  return (
    <div
      role="tabpanel"
      id={`paneel-${sleutel}`}
      aria-labelledby={`oortjie-${sleutel}`}
      tabIndex={0}
      className="flex flex-col gap-5 outline-none"
    >
      {children}
    </div>
  );
}
