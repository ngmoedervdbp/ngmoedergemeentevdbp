import {
  BookOpen,
  Church,
  HandHeart,
  Heart,
  Music,
  Sparkles,
  Sun,
  Users,
  type LucideIcon,
} from "lucide-react";
import { GLAS } from "@/lib/glas";
import { cn } from "@/lib/utils";

/**
 * Sweefborrels — glasteëls wat om die held dryf.
 *
 * Die patroon (soos die logistiek-voorbeeld): teëls verstrooi oor die hele
 * held, op verskillende dieptes en groottes, wat saggies dryf. Nie 'n netjiese
 * ry nie — verstrooi voel lewendig, 'n ry voel soos 'n nutsbalk.
 *
 * Drie reëls hou dit van rommelrig af:
 *   1. Niks in die middelste kolom nie — die opskrif moet skoon bly.
 *   2. Verder weg = kleiner, dowwer, stadiger. Dit is die hele dieptegevoel.
 *   3. Elke teël dryf op sy eie tydsberekening (sien .dryf-1..6).
 *
 * `aria-hidden` deurgaans: dit is atmosfeer, nie inligting nie.
 */

type Borrel = {
  ikoon: LucideIcon;
  toon: string;
  /** Posisie in % van die houer. */
  links: number;
  bo: number;
  /** 1 = ver agter (klein, dof), 3 = naaste (groot, helderder). */
  diepte: 1 | 2 | 3;
  dryf: 1 | 2 | 3 | 4 | 5 | 6;
  /** Versteek onder `lg` — hou 'n foon se held rustig. */
  slegsGroot?: boolean;
};

/**
 * Links en regs van die opskrif, met 'n paar laer af wat by die knoppies
 * verbydryf. Die middel (38%–62%) bly leeg.
 */
const BORRELS: Borrel[] = [
  // Bo die opskrif, ver links en regs.
  { ikoon: Church, toon: GLAS.saffier, links: 4, bo: 16, diepte: 2, dryf: 1 },
  { ikoon: Sparkles, toon: GLAS.see, links: 90, bo: 10, diepte: 1, dryf: 5, slegsGroot: true },
  { ikoon: Users, toon: GLAS.groen, links: 72, bo: 18, diepte: 1, dryf: 2, slegsGroot: true },

  // Regs van die teks — die kolom is hoogstens 58% breed.
  { ikoon: Sun, toon: GLAS.amber, links: 83, bo: 44, diepte: 3, dryf: 4 },
  { ikoon: BookOpen, toon: GLAS.kobalt, links: 68, bo: 62, diepte: 1, dryf: 3, slegsGroot: true },
  { ikoon: Music, toon: GLAS.violet, links: 93, bo: 76, diepte: 2, dryf: 6, slegsGroot: true },

  // Onder die knoppies, weg van die linkerkolom.
  { ikoon: HandHeart, toon: GLAS.roos, links: 78, bo: 90, diepte: 2, dryf: 3 },
  { ikoon: Heart, toon: GLAS.wyn, links: 3, bo: 74, diepte: 1, dryf: 5, slegsGroot: true },
];

const DIEPTE = {
  1: { boks: "size-11 sm:size-12", ikoon: 17, deurskyn: 0.5, waas: "blur-[0.4px]" },
  2: { boks: "size-14 sm:size-16", ikoon: 22, deurskyn: 0.72, waas: "" },
  3: { boks: "size-16 sm:size-[4.5rem]", ikoon: 27, deurskyn: 0.9, waas: "" },
} as const;

export function Sweefborrels({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {BORRELS.map((b, i) => {
        const d = DIEPTE[b.diepte];
        const Ikoon = b.ikoon;

        return (
          <span
            key={i}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2",
              b.slegsGroot && "hidden lg:block",
            )}
            style={{ left: `${b.links}%`, top: `${b.bo}%` }}
          >
            <span
              className={cn(
                "dryf boog-vorm flex items-center justify-center border",
                `dryf-${b.dryf}`,
                d.boks,
                d.waas,
              )}
              style={{
                // Glasagtig: 'n vlak wasing van die toon, 'n rand in dieselfde
                // toon, en 'n sagte gloed onder. Nie 'n soliede blokkie nie.
                backgroundColor: `color-mix(in oklab, ${b.toon} 12%, white 88%)`,
                borderColor: `color-mix(in oklab, ${b.toon} 24%, transparent)`,
                boxShadow: `0 10px 30px -12px color-mix(in oklab, ${b.toon} 45%, transparent)`,
                opacity: d.deurskyn,
              }}
            >
              <Ikoon
                size={d.ikoon}
                strokeWidth={1.6}
                style={{ color: b.toon }}
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
