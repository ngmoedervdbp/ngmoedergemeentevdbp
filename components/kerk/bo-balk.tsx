"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { navVanHrefs } from "@/lib/nav";
import { tekenUit } from "@/app/(dash)/uitteken-aksie";
import { fmtDatum } from "@/lib/format";
import { volleNaam, voorletters } from "@/lib/data/afleidings";
import type { Lid } from "@/lib/tipes/gemeente";
import { cn } from "@/lib/utils";
import { Modaal } from "@/components/ui/modaal";

/**
 * Boonste balk: vinnige soek (Cmd-K), kennisgewings, gebruiker.
 *
 * Die palet soek oor lidmate én bladsye — dit is die "Soek & Filter"-bladsy se
 * navigasie-helfte, sodat daardie bladsy net die gevorderde filters hoef te dra.
 */
export function BoBalk({
  navHrefs,
  gebruiker,
  rolEtiket,
  lede: alleLede,
  openNav,
}: {
  /**
   * Reeds vir die rol gefiltreer. Die palet MOET dieselfde lys gebruik as die
   * sybalk — met die volle NAV sou 'n soektog na "bediening" die skakel wys
   * aan iemand wat dit nie mag sien nie.
   */
  navHrefs: string[];
  gebruiker: string;
  rolEtiket: string;
  /** Vir die soekpalet — uit die uitleg, nie 'n module-vlak skikking nie. */
  lede: Lid[];
  openNav: () => void;
}) {
  const nav = useMemo(() => navVanHrefs(navHrefs), [navHrefs]);
  const [oop, setOop] = useState(false);
  const [vraag, setVraag] = useState("");
  const sluitSoek = useCallback(() => setOop(false), []);
  const invoer = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pageTitle =
    nav.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.etiket ?? "Lidmaatbestuur";

  // Die palet is 'n soekding — hier is die sleutelbord die punt, anders as by
  // 'n vorm-modaal. Deur die ref te fokus eerder as `autoFocus` werk dit ook
  // wanneer die paneel eers ná die eerste raam gemonteer word.
  useEffect(() => {
    if (oop) invoer.current?.focus();
  }, [oop]);

  useEffect(() => {
    function sleutel(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOop((v) => !v);
      }
      if (e.key === "Escape") setOop(false);
    }
    window.addEventListener("keydown", sleutel);
    return () => window.removeEventListener("keydown", sleutel);
  }, []);

  const skoon = vraag.trim().toLowerCase();
  const bladsye = skoon
    ? nav.filter((n) => n.etiket.toLowerCase().includes(skoon)).slice(0, 4)
    : [];
  const lede = skoon
    ? alleLede
        .filter((l) => volleNaam(l).toLowerCase().includes(skoon))
        .slice(0, 6)
    : [];

  function gaan(href: string) {
    setOop(false);
    setVraag("");
    router.push(href);
  }

  return (
    <>
      <header className="admin-topbar border-line bg-surface veilig-bo z-20 flex h-16 shrink-0 items-center gap-2 border-b px-3 backdrop-blur-xl backdrop-saturate-150 sm:gap-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={openNav}
          aria-label="Wys navigasie"
          className="text-ink-muted hover:bg-stage hover:text-ink focus-visible:outline-accent -ml-1 flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 lg:hidden"
        >
          <Menu size={21} strokeWidth={1.9} aria-hidden />
        </button>

        <p className="admin-breadcrumb">
          <span>Lidmaatbestuur</span>
          <span aria-hidden>/</span>
          <strong>{pageTitle}</strong>
        </p>

        {/* Op 'n foon is daar nie plek vir 'n soekbalk nie — net die ikoon. */}
        <button
          type="button"
          onClick={() => setOop(true)}
          aria-label="Soek lidmate of bladsye"
          className="text-ink-muted hover:bg-stage hover:text-ink focus-visible:outline-accent flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 sm:hidden"
        >
          <Search size={19} strokeWidth={2} aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => setOop(true)}
          className="admin-search-trigger border-line text-ink-muted hover:border-ink-muted/40 hover:text-ink focus-visible:outline-accent hidden h-9 w-full max-w-md items-center gap-2.5 rounded-lg border px-3 text-sm transition-colors focus-visible:outline-2 sm:flex"
        >
          <Search size={15} strokeWidth={2} aria-hidden />
          <span className="truncate">Soek lidmate of bladsye…</span>
          <kbd className="border-line text-ink-muted ml-auto hidden shrink-0 rounded border px-1.5 py-0.5 font-sans text-[0.68rem] font-semibold md:block">
            ⌘K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Kennisgewings"
            className="text-ink-muted hover:bg-stage hover:text-ink focus-visible:outline-accent relative flex size-11 min-w-[44px] items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
          >
            <Bell size={18} strokeWidth={1.9} aria-hidden />
            <span className="bg-accent absolute top-2.5 right-3 size-1.5 rounded-full" />
          </button>

          <div className="border-line flex items-center gap-2.5 sm:ml-1 sm:border-l sm:pl-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm leading-tight font-semibold">
                {gebruiker}
              </span>
              <span className="text-ink-muted block text-xs">{rolEtiket}</span>
            </span>
            <form action={tekenUit}>
              <button
                type="submit"
                title="Teken uit"
                aria-label="Teken uit"
                className="text-ink-muted hover:bg-stage hover:text-ink focus-visible:outline-accent flex size-11 min-w-[44px] items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
              >
                <LogOut size={17} strokeWidth={1.9} aria-hidden />
              </button>
            </form>

            <span
              aria-hidden
              className="admin-user-avatar boog-vorm bg-was-saffier text-glas-saffier ring-line flex size-9 items-center justify-center text-xs font-semibold ring-1"
            >
              {gebruiker
                .split(" ")
                .map((d) => d.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <Modaal oop={oop} sluit={sluitSoek} titel="Vinnige soek">
        <div className="border-line flex shrink-0 items-center gap-2.5 border-b px-4">
          <Search size={16} className="text-ink-muted" aria-hidden />
          <input
            ref={invoer}
            type="search"
            aria-label="Soek lidmate of bladsye"
            inputMode="search"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={vraag}
            onChange={(e) => setVraag(e.target.value)}
            placeholder="Soek lidmate of bladsye…"
            className="placeholder:text-ink-muted h-13 w-full bg-transparent py-4 text-[16px] outline-none sm:text-base"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 sm:max-h-80 sm:flex-none">
          {!skoon ? (
            <p className="text-ink-muted px-3 py-6 text-center text-sm">
              Begin tik om te soek.
            </p>
          ) : bladsye.length === 0 && lede.length === 0 ? (
            <p className="text-ink-muted px-3 py-6 text-center text-sm">
              Niks gevind vir “{vraag}” nie.
            </p>
          ) : (
            <>
              {bladsye.length > 0 ? (
                <Afdeling titel="Bladsye">
                  {bladsye.map(({ etiket, href, ikoon: Ikoon }) => (
                    <Ry key={href} onClick={() => gaan(href)}>
                      <span className="boog-vorm bg-stage text-ink-muted flex size-7 items-center justify-center">
                        <Ikoon size={14} aria-hidden />
                      </span>
                      {etiket}
                    </Ry>
                  ))}
                </Afdeling>
              ) : null}

              {lede.length > 0 ? (
                <Afdeling titel="Lidmate">
                  {lede.map((l) => (
                    <Ry key={l.id} onClick={() => gaan(`/lidmate/${l.id}`)}>
                      <span className="boog-vorm bg-was-saffier text-glas-saffier flex size-7 items-center justify-center text-[0.68rem] font-semibold">
                        {voorletters(l)}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-left">
                        {volleNaam(l)}
                      </span>
                      <span className="text-ink-muted hidden shrink-0 text-xs sm:block">
                        Lid sedert {fmtDatum(l.lid_sedert)}
                      </span>
                    </Ry>
                  ))}
                </Afdeling>
              ) : null}
            </>
          )}
        </div>
      </Modaal>
    </>
  );
}

function Afdeling({
  titel,
  children,
}: {
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <p className="text-ink-muted px-3 pt-2 pb-1 text-[0.68rem] font-semibold tracking-[0.12em] uppercase">
        {titel}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function Ry({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "hover:bg-stage focus-visible:outline-accent flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2",
      )}
    >
      {children}
    </button>
  );
}
