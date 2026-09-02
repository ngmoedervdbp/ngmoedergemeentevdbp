"use client";

import { useCallback, useState, type ReactNode } from "react";
import { SyBalk } from "@/components/kerk/sy-balk";
import { BoBalk } from "@/components/kerk/bo-balk";


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
  gebruiker,
  rolEtiket,
  children,
}: {
  navHrefs: string[];
  gebruiker: string;
  rolEtiket: string;
  children: ReactNode;
}) {
  const [navOop, setNavOop] = useState(false);
  const sluitNav = useCallback(() => setNavOop(false), []);

  return (
    <div className="flex h-dvh overflow-hidden">
      <SyBalk navHrefs={navHrefs} oop={navOop} sluit={sluitNav} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <BoBalk
          navHrefs={navHrefs}
          gebruiker={gebruiker}
          rolEtiket={rolEtiket}
          openNav={() => setNavOop(true)}
        />
        <main className="veilig-kant flex-1 overflow-y-auto">
          <div className="veilig-onder mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pt-5 pb-12 sm:px-6 sm:gap-6 lg:px-8 lg:pt-7 lg:pb-14">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
