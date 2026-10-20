"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { GEMEENTE } from "@/lib/gemeente";

const SKAKELS = [
  { etiket: "Tuis", href: "/" },
  { etiket: "Oor ons", href: "/oor-ons" },
  { etiket: "Eredienste", href: "/eredienste" },
  { etiket: "Kalender", href: "/kalender-gemeente" },
  { etiket: "Bedienings", href: "/bedienings" },
  { etiket: "Kontak", href: "/kontak" },
] as const;

export function PubliekKop() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const open = menuPath === pathname;
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        toggle.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        setMenuPath(null);
    };
    const desktop = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuPath(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header
      ref={header}
      className="site-header veilig-bo backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="site-shell site-nav">
        <Link href="/" className="site-brand" onClick={() => setMenuPath(null)}>
          <Image
            src="/logo/ng-merk-256.png"
            alt=""
            width={44}
            height={44}
            priority
          />
          <span>
            <strong>{GEMEENTE.kortNaam}</strong>
            <small>Vanderbijlpark</small>
          </span>
        </Link>
        <nav aria-label="Hoofnavigasie" className="site-desktop-nav">
          {SKAKELS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.etiket}
            </Link>
          ))}
        </nav>
        <Link href="/registreer" className="site-button site-nav-cta">
          Word deel van ons <ArrowUpRight size={17} aria-hidden />
        </Link>
        <button
          ref={toggle}
          type="button"
          className="site-menu-toggle"
          onClick={() => setMenuPath(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="publiek-spyskaart"
          aria-label={open ? "Sluit spyskaart" : "Wys spyskaart"}
        >
          <span>{open ? "Sluit" : "Kieslys"}</span>
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </div>
      {open && (
        <nav
          id="publiek-spyskaart"
          aria-label="Mobiele navigasie"
          className="site-mobile-nav"
        >
          <div className="site-shell">
            {SKAKELS.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuPath(null)}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <span className="site-menu-index" aria-hidden>
                  0{index + 1}
                </span>
                {link.etiket}
                <ArrowUpRight size={20} aria-hidden />
              </Link>
            ))}
            <Link
              href="/registreer"
              className="site-button"
              onClick={() => setMenuPath(null)}
            >
              Word deel van ons <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
