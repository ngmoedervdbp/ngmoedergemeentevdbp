import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Vormvelde. Een plek vir die rand, hoogte en fokusring. */

/*
 * `text-base` onder `sm` is nie kosmeties nie: iOS Safari zoem die hele bladsy
 * in wanneer 'n veld met 'n berekende grootte onder 16px fokus kry, en zoem
 * nie weer uit nie. Ons wortelgrootte is daar 15.5px, so `text-sm` sou 13.6px
 * gee — vandaar die uitdruklike 16px.
 */
const INSET =
  "border-line bg-surface text-ink placeholder:text-ink-muted focus-visible:outline-accent w-full rounded-lg border px-3 text-[16px] sm:text-sm focus-visible:outline-2 focus-visible:-outline-offset-1 disabled:opacity-60";

export function Veld({
  etiket,
  hulp,
  verpligtend,
  fout,
  children,
}: {
  etiket: string;
  hulp?: string;
  verpligtend?: boolean;
  fout?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-semibold">
        {etiket}
        {verpligtend ? <span className="text-glas-wyn"> *</span> : null}
      </span>
      {children}
      {fout ? (
        <span className="text-glas-wyn text-xs font-medium">{fout}</span>
      ) : hulp ? (
        <span className="text-ink-muted text-xs">{hulp}</span>
      ) : null}
    </label>
  );
}

/*
 * Raakskerm-sleutelborde. `type` alleen gee jou nie die regte sleutelbord op
 * elke toestel nie, en 'n e-posveld wat die eerste letter outomaties hoofletter
 * maak, is 'n bekende irritasie. Ons stel dit hier eenmalig in plaas van by elke
 * veld — 'n uitdruklike prop by die oproep wen steeds.
 */
const RAAK: Partial<
  Record<string, Pick<ComponentProps<"input">, "inputMode" | "autoCapitalize" | "spellCheck">>
> = {
  email: { inputMode: "email", autoCapitalize: "none", spellCheck: false },
  tel: { inputMode: "tel" },
  number: { inputMode: "numeric" },
  url: { inputMode: "url", autoCapitalize: "none", spellCheck: false },
  search: { inputMode: "search" },
};

export function Invoer({ className, type, ...res }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      {...(type ? RAAK[type] : undefined)}
      className={cn(INSET, "h-11 sm:h-10", className)}
      {...res}
    />
  );
}

export function Kies({ className, children, ...res }: ComponentProps<"select">) {
  return (
    <select className={cn(INSET, "h-11 sm:h-10", className)} {...res}>
      {children}
    </select>
  );
}

export function Teksarea({ className, ...res }: ComponentProps<"textarea">) {
  return <textarea className={cn(INSET, "min-h-24 resize-y py-2", className)} {...res} />;
}

/** Twee velde langs mekaar op groter skerms. */
export function VeldRy({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
