"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navVanHrefs } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { GlasBoog } from "@/components/kerk/glas-boog";

/**
 * Die loodraam.
 *
 * Twee gedaantes, een lys: op `lg` en op is dit 'n staande kolom langs die
 * inhoud; daaronder is dit 'n laai wat oor die bladsy skuif. Die skakels self
 * verskil nie — net die houer — sodat daar nie twee navigasies is om te
 * onderhou nie.
 */
export function SyBalk({
  navHrefs,
  oop,
  sluit,
}: {
  /** Reeds vir die huidige rol gefiltreer — sien app/(dash)/layout.tsx. */
  navHrefs: string[];
  /** Slegs van toepassing op die laai-gedaante onder `lg`. */
  oop: boolean;
  sluit: () => void;
}) {
  const pathname = usePathname();
  const laai = useRef<HTMLDivElement>(null);
  const vorigeFokus = useRef<HTMLElement | null>(null);

  // Sluit die laai sodra die roete verander — anders bly dit oop bo-op die
  // nuwe bladsy nadat jy 'n skakel gedruk het.
  useEffect(() => {
    sluit();
    // `sluit` is stabiel (useCallback by die ouer); die roete is die sein.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Fokusvang, Escape en rolslot — dieselfde kontrak as Modaal, want 'n oop
  // laai is 'n modale oorlegsel.
  useEffect(() => {
    if (!oop) return;

    vorigeFokus.current = document.activeElement as HTMLElement | null;
    const vorigeOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    laai.current?.querySelector<HTMLElement>("a, button")?.focus();

    function sleutel(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        sluit();
        return;
      }
      if (e.key !== "Tab" || !laai.current) return;
      const fokusbaar = laai.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
      vorigeFokus.current?.focus?.();
    };
  }, [oop, sluit]);

  return (
    <>
      {/* Staande kolom — rekenaar en groot tablet. */}
      <nav
        aria-label="Hoofnavigasie"
        className="bg-lood veilig-links hidden h-full w-64 shrink-0 flex-col overflow-hidden lg:flex"
      >
        <Merk />
        <Skakels navHrefs={navHrefs} pathname={pathname} />
      </nav>

      {/* Laai — selfoon en klein tablet. */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          oop ? "" : "pointer-events-none",
        )}
        aria-hidden={oop ? undefined : true}
      >
        <div
          onClick={sluit}
          role="presentation"
          className={cn(
            "absolute inset-0 bg-[#141320]/50 backdrop-blur-sm transition-opacity duration-200",
            oop ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          ref={laai}
          role="dialog"
          aria-modal={oop ? true : undefined}
          aria-label="Hoofnavigasie"
          className={cn(
            "bg-lood veilig-links absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-transform duration-200 ease-out",
            oop ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="relative">
            <Merk />
            <button
              type="button"
              onClick={sluit}
              aria-label="Maak navigasie toe"
              className="absolute top-1/2 right-2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-[#aaa4b6] transition-colors hover:bg-[var(--color-lood-op)] hover:text-[#e6e2eb] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-400"
            >
              <X size={20} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <Skakels navHrefs={navHrefs} pathname={pathname} />
        </div>
      </div>
    </>
  );
}

function Merk() {
  return (
    <Link
      href="/dashboard"
      className="border-lood-lyn flex items-center gap-3.5 border-b py-5 pl-5 pr-14 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-400 lg:pr-5"
    >
      <GlasBoog width={30} className="shrink-0 text-[#e9e4ef]" />
      <span className="min-w-0">
        <span className="font-display block truncate text-base leading-tight font-semibold text-[#f2efe9]">
          NG Moedergemeente
        </span>
        <span className="block text-xs tracking-[0.14em] text-[#8b8499] uppercase">
          Lidmaatbestuur
        </span>
      </span>
    </Link>
  );
}

function Skakels({ navHrefs, pathname }: { navHrefs: string[]; pathname: string }) {
  const nav = useMemo(() => navVanHrefs(navHrefs), [navHrefs]);
  return (
    <ul className="veilig-onder flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
      {nav.map(({ etiket, href, ikoon: Ikoon }) => {
        const aktief = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={aktief ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-md py-2.5 pr-3 pl-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-400",
                // Raakvloer in px, nie rem nie: `min-h-11` is 2.75rem, en teen
                // die 15.5px wortelgrootte op 'n foon gee dit 42.6px — net-net
                // onder die 44px wat ons wil hê.
                "min-h-[44px]",
                aktief
                  ? "bg-lood-op font-semibold text-[#f2efe9]"
                  : "text-[#aaa4b6] hover:bg-lood-op/60 hover:text-[#e6e2eb]",
              )}
            >
              {aktief ? (
                <span
                  aria-hidden
                  className="absolute top-1.5 bottom-1.5 left-0 w-[2.5px] rounded-full bg-amber-500/90"
                />
              ) : null}
              <Ikoon
                size={17}
                strokeWidth={aktief ? 2.1 : 1.7}
                aria-hidden
                className={cn("shrink-0", aktief ? "text-amber-400/90" : "")}
              />
              {etiket}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
