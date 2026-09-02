"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { GEMEENTE } from "@/lib/gemeente";
import { cn } from "@/lib/utils";

const SKAKELS = [
  { etiket: "Tuis", href: "/" },
  { etiket: "Oor ons", href: "/oor-ons" },
  { etiket: "Eredienste", href: "/eredienste" },
  { etiket: "Kalender", href: "/kalender-gemeente" },
  { etiket: "Bedienings", href: "/bedienings" },
  { etiket: "Kontak", href: "/kontak" },
] as const;

/**
 * Die publieke kop.
 *
 * Onder `md` word die spyskaart 'n paneel wat oopvou — nie 'n volblad-laai
 * nie. Die werf het vyf skakels; 'n volskerm-oorlegsel daarvoor is oordrewe.
 */
export function PubliekKop() {
  const pathname = usePathname();
  const [oop, setOop] = useState(false);
  const [gerol, setGerol] = useState(false);
  const balk = useRef<HTMLElement>(null);

  /**
   * Die balk word digter sodra jy rol.
   *
   * Ons skryf die attribuut REGSTREEKS op die element eerder as om state per
   * rolgebeurtenis te stel — 'n setState op elke scroll is 'n herrender op elke
   * raam. Die state hou net die huidige waarde vas sodat React se boom in pas
   * bly; die DOM-skryf is wat die styl verander.
   */
  useEffect(() => {
    let vorige: boolean | null = null;
    let wag = false;

    function meet() {
      wag = false;
      const nou = window.scrollY > 8;
      if (nou === vorige) return;
      vorige = nou;
      balk.current?.setAttribute("data-gerol", nou ? "ja" : "nee");
      setGerol(nou);
    }

    function opRol() {
      if (wag) return;
      wag = true;
      requestAnimationFrame(meet);
    }

    meet();
    window.addEventListener("scroll", opRol, { passive: true });
    return () => window.removeEventListener("scroll", opRol);
  }, []);

  return (
    <header
      ref={balk}
      data-gerol={gerol || oop ? "ja" : "nee"}
      className={cn(
        "ryp-glas veilig-bo sticky top-0 z-30 border-b border-transparent backdrop-blur-xl backdrop-saturate-150",
        // 'n Oop spyskaart moet ondeursigtig wees — anders wys die held
        // daardeur en dit lyk stukkend.
        oop && "bg-surface! shadow-[0_12px_32px_-16px_rgba(34,31,38,0.35)]",
      )}
    >
      <div className="veilig-kant mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="focus-visible:outline-accent -ml-1 flex min-h-[44px] min-w-[44px] items-center gap-2.5 rounded-lg px-1 focus-visible:outline-2"
        >
          {/* Die gemeente se eie logo. Die lansetboog bly die dekoratiewe
              motief (held-arkade, borrels, leë toestande) — die logo
              identifiseer, die boog versier. */}
          {/* Slegs die embleem — die logo se eie skrifnaam is by 36px 'n
              onleesbare vlek, en dit herhaal in elk geval die teks langsaan. */}
          <Image
            src="/logo/ng-merk-256.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-9 w-auto shrink-0 object-contain"
          />
          <span className="flex min-w-0 flex-col leading-none">
            <span className="font-display truncate text-base font-semibold">
              {GEMEENTE.kortNaam}
            </span>
            <span className="text-ink-muted mt-0.5 hidden text-[0.7rem] tracking-[0.14em] uppercase sm:block">
              Vanderbijlpark
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {SKAKELS.map((s) => {
            const aktief =
              s.href === "/" ? pathname === "/" : pathname.startsWith(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                aria-current={aktief ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-semibold transition-colors",
                  aktief
                    ? "nav-pil text-brand"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                <span className="relative">{s.etiket}</span>
              </Link>
            );
          })}
        </nav>

        {/* Die vernaamste oproep tot aksie — dieselfde plek waar 'n webwerf
            gewoonlik "Teken in" sit, want dit is die ding wat 'n besoeker
            eintlik moet doen. */}
        <Link
          href="/registreer"
          className="bg-brand focus-visible:outline-accent ml-auto hidden min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-white shadow-[0_2px_14px_-6px_rgba(59,58,114,0.7)] transition-colors hover:bg-[#33326a] focus-visible:outline-2 focus-visible:outline-offset-2 md:inline-flex"
        >
          Word deel van ons
        </Link>

        <button
          type="button"
          onClick={() => setOop((v) => !v)}
          aria-expanded={oop}
          aria-controls="publiek-spyskaart"
          aria-label={oop ? "Sluit spyskaart" : "Wys spyskaart"}
          className="text-ink-muted hover:bg-stage hover:text-ink focus-visible:outline-accent ml-auto flex size-11 min-w-[44px] items-center justify-center rounded-lg transition-colors focus-visible:outline-2 md:hidden"
        >
          {oop ? <X size={21} aria-hidden /> : <Menu size={21} aria-hidden />}
        </button>
      </div>

      {oop ? (
        <nav
          id="publiek-spyskaart"
          className="veilig-kant px-4 pb-3 sm:px-6 md:hidden"
        >
          <div className="skei-lyn mb-1" aria-hidden />
          <ul className="flex flex-col py-1">
            {SKAKELS.map((s) => {
              const aktief =
                s.href === "/" ? pathname === "/" : pathname.startsWith(s.href);
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    onClick={() => setOop(false)}
                    aria-current={aktief ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-semibold transition-colors",
                      aktief
                        ? "nav-pil text-brand"
                        : "text-ink-muted hover:bg-stage hover:text-ink",
                    )}
                  >
                    <span className="relative">{s.etiket}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/registreer"
            onClick={() => setOop(false)}
            className="bg-brand focus-visible:outline-accent mt-2 flex min-h-[44px] items-center justify-center rounded-full px-4 text-sm font-semibold text-white transition-colors hover:bg-[#33326a] focus-visible:outline-2"
          >
            Word deel van ons
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
