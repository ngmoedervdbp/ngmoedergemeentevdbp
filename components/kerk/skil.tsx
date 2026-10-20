"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { SyBalk } from "@/components/kerk/sy-balk";
import { BoBalk } from "@/components/kerk/bo-balk";
import type { Lid } from "@/lib/tipes/gemeente";

/**
 * Die skil hou die enigste stukkie toestand wat die raam nodig het: is die
 * navigasielaai oop?
 *
 * Dit woon hier eerder as in die uitleg sodat `app/(dash)/layout.tsx` 'n
 * bedienerkomponent kan bly en die bladsye self niks van die laai hoef te weet
 * nie.
 */
export function Skil({
  navHrefs,
  lede,
  gebruiker,
  rolEtiket,
  children,
}: {
  navHrefs: string[];
  lede: Lid[];
  gebruiker: string;
  rolEtiket: string;
  children: ReactNode;
}) {
  const [navOop, setNavOop] = useState(false);
  const sluitNav = useCallback(() => setNavOop(false), []);
  const pathname = usePathname();
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    main.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="admin-shell flex h-dvh overflow-hidden">
      <a href="#admin-inhoud" className="admin-skip">
        Spring na inhoud
      </a>
      <SyBalk navHrefs={navHrefs} oop={navOop} sluit={sluitNav} />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <BoBalk
          navHrefs={navHrefs}
          lede={lede}
          gebruiker={gebruiker}
          rolEtiket={rolEtiket}
          openNav={() => setNavOop(true)}
        />
        <main
          ref={main}
          id="admin-inhoud"
          tabIndex={-1}
          className="admin-main veilig-kant flex-1 overflow-y-auto"
        >
          <div
            key={pathname}
            className="admin-page veilig-onder mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pt-5 pb-12 sm:px-6 sm:gap-6 lg:px-8 lg:pt-7 lg:pb-14"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
