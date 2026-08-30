"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import { CircleCheck, Info, X } from "lucide-react";

/**
 * Meldings — kort bevestigings ná 'n aksie.
 *
 * Elke aksie in hierdie app is nog demo: daar is geen databasis nie. Die
 * melding sê dit reguit, sodat niemand dink 'n rekord is werklik gestoor nie.
 */
type Soort = "sukses" | "info";
type Item = { id: number; teks: string; soort: Soort };

const Konteks = createContext<{ wys: (teks: string, soort?: Soort) => void }>({
  wys: () => {},
});

export function useMelding() {
  return useContext(Konteks);
}

export function MeldingVerskaffer({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);

  const wys = useCallback((teks: string, soort: Soort = "sukses") => {
    const id = Date.now() + Math.random();
    setItems((v) => [...v, { id, teks, soort }]);
    setTimeout(() => setItems((v) => v.filter((i) => i.id !== id)), 4500);
  }, []);

  const waarde = useMemo(() => ({ wys }), [wys]);

  return (
    <Konteks.Provider value={waarde}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="veilig-onder veilig-kant pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col gap-2 p-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-full sm:max-w-sm sm:p-0"
      >
        {items.map((i) => (
          <Strook key={i.id} item={i} sluit={() => setItems((v) => v.filter((x) => x.id !== i.id))} />
        ))}
      </div>
    </Konteks.Provider>
  );
}

function Strook({ item, sluit }: { item: Item; sluit: () => void }) {
  const [in_, setIn] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setIn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const Ikoon = item.soort === "sukses" ? CircleCheck : Info;

  return (
    <div
      className={`border-line bg-surface pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-[0_16px_40px_-16px_rgba(20,19,32,0.4)] transition-all duration-200 ${
        in_ ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <span
        className={`boog-vorm ring-line mt-0.5 flex size-7 shrink-0 items-center justify-center ring-1 ${
          item.soort === "sukses" ? "bg-was-groen text-glas-groen" : "bg-was-kobalt text-glas-kobalt"
        }`}
      >
        <Ikoon size={14} strokeWidth={2} aria-hidden />
      </span>
      <p className="min-w-0 flex-1 text-sm">{item.teks}</p>
      <button
        type="button"
        onClick={sluit}
        aria-label="Maak toe"
        className="text-ink-muted hover:text-ink -mt-1.5 -mr-2 flex size-9 shrink-0 items-center justify-center rounded"
      >
        <X size={14} aria-hidden />
      </button>
    </div>
  );
}

/** Standaard bewoording sodat elke skerm dieselfde eerlike storie vertel. */
export const DEMO = (wat: string) => `${wat} — demo, daar is nog geen databasis nie.`;
