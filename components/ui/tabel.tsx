"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Rolhouer vir 'n breë tabel.
 *
 * 'n Kaal `overflow-x-auto` rol wel op 'n foon, maar niks sê vir die gebruiker
 * dat daar meer regs is nie — die kolom word eenvoudig by die rand afgesny en
 * lyk soos die einde. Hierdie houer verdof die rand waar daar nog inhoud is en
 * noem dit een keer in woorde, en verdwyn heeltemal sodra die tabel pas.
 *
 * Die tabel bly 'n tabel: skermlesers en kopieer-plak werk soos altyd, en op
 * 'n rekenaar verander niks.
 */
export function Tabelrol({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rol = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState(false);
  const [regs, setRegs] = useState(false);

  const meet = useCallback(() => {
    const el = rol.current;
    if (!el) return;
    const oor = el.scrollWidth - el.clientWidth;
    setLinks(el.scrollLeft > 4);
    setRegs(oor > 4 && el.scrollLeft < oor - 4);
  }, []);

  useEffect(() => {
    const el = rol.current;
    if (!el) return;
    meet();
    const waarnemer = new ResizeObserver(meet);
    waarnemer.observe(el);
    // Die tabel se eie breedte verander wanneer inhoud filter.
    if (el.firstElementChild) waarnemer.observe(el.firstElementChild);
    return () => waarnemer.disconnect();
  }, [meet]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={rol}
        onScroll={meet}
        className="rol-x overflow-x-auto overflow-y-hidden"
      >
        {children}
      </div>

      {/* Randverdowwing — suiwer visueel, buite die skermleser se pad. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[rgba(34,31,38,0.09)] to-transparent transition-opacity duration-150",
          links ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[rgba(34,31,38,0.09)] to-transparent transition-opacity duration-150",
          regs ? "opacity-100" : "opacity-0",
        )}
      />

      {regs || links ? (
        <p className="text-ink-muted border-line border-t px-4 py-1.5 text-xs sm:hidden">
          Rol sywaarts vir meer kolomme
        </p>
      ) : null}
    </div>
  );
}
