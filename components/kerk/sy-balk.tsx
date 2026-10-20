"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import { navVanHrefs } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { KruisMerk } from "@/components/publiek/kruis-merk";

const GROUPS = [
  {
    label: "Werkruimte",
    hrefs: ["/dashboard", "/lidmate", "/bediening", "/kalender"],
  },
  {
    label: "Gemeente",
    hrefs: [
      "/verslae",
      "/dokumentasie",
      "/wyke",
      "/gesinne",
      "/registrasies",
      "/kategese",
    ],
  },
  {
    label: "Bestuur",
    hrefs: ["/soek", "/argief", "/kommunikasie", "/instellings"],
  },
];

export function SyBalk({
  navHrefs,
  oop,
  sluit,
}: {
  navHrefs: string[];
  oop: boolean;
  sluit: () => void;
}) {
  const pathname = usePathname();
  const drawer = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    sluit();
  }, [pathname, sluit]);

  useEffect(() => {
    if (!oop) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("a, button")?.focus();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) sluit();
    };
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        sluit();
        return;
      }
      if (event.key !== "Tab" || !drawer.current) return;
      const targets = drawer.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", keydown, true);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", keydown, true);
      desktop.removeEventListener("change", closeOnDesktop);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [oop, sluit]);

  return (
    <>
      <nav
        aria-label="Hoofnavigasie"
        className="admin-sidebar veilig-links hidden h-full w-64 shrink-0 flex-col overflow-hidden lg:flex"
      >
        <Merk />
        <Skakels navHrefs={navHrefs} pathname={pathname} />
        <SidebarFooter />
      </nav>
      <div
        className={cn(
          "admin-drawer fixed inset-0 z-50 lg:hidden",
          !oop && "pointer-events-none",
        )}
        aria-hidden={oop ? undefined : true}
        inert={!oop}
      >
        <div
          onClick={sluit}
          role="presentation"
          className={cn(
            "admin-drawer-scrim absolute inset-0 transition-opacity duration-200",
            oop ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          ref={drawer}
          role="dialog"
          aria-modal={oop ? true : undefined}
          aria-label="Hoofnavigasie"
          className={cn(
            "admin-sidebar veilig-links absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col overflow-hidden transition-transform duration-300 ease-out",
            oop ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="relative">
            <Merk />
            <button
              type="button"
              onClick={sluit}
              aria-label="Maak navigasie toe"
              className="admin-drawer-close"
            >
              <X size={20} aria-hidden />
            </button>
          </div>
          <Skakels navHrefs={navHrefs} pathname={pathname} />
          <SidebarFooter />
        </div>
      </div>
    </>
  );
}

function Merk() {
  return (
    <Link href="/dashboard" className="admin-brand">
      <Image
        src="/logo/ng-merk-256.png"
        alt=""
        width={44}
        height={44}
        priority
      />
      <span>
        <strong>NG Moedergemeente</strong>
        <small>Lidmaatbestuur</small>
      </span>
    </Link>
  );
}

function Skakels({
  navHrefs,
  pathname,
}: {
  navHrefs: string[];
  pathname: string;
}) {
  // The server-provided allowlist still decides which links are rendered.
  const nav = useMemo(() => navVanHrefs(navHrefs), [navHrefs]);
  return (
    <div className="admin-nav-groups min-h-0 flex-1 overflow-y-auto">
      {GROUPS.map((group) => {
        const links = nav.filter((item) => group.hrefs.includes(item.href));
        if (!links.length) return null;
        return (
          <div key={group.label} className="admin-nav-group">
            <p>{group.label}</p>
            <ul>
              {links.map(({ etiket, href, ikoon: Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className="admin-nav-link"
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 1.9 : 1.5}
                        aria-hidden
                      />
                      <span>{etiket}</span>
                      {active && <span className="admin-nav-dot" aria-hidden />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="admin-sidebar-footer veilig-onder">
      <Link href="/" target="_blank" rel="noopener noreferrer">
        Terug na webwerf <ArrowUpRight size={16} aria-hidden />
      </Link>
      <span>
        <KruisMerk /> NG Moedergemeente · Vanderbijlpark
      </span>
    </div>
  );
}
