import { GLAS } from "@/lib/glas";
import { cn } from "@/lib/utils";

/**
 * Die vensterwand — die held se agtergrond.
 *
 * Nie 'n ry identiese boë nie (dít lyk soos 'n patroonstaal), maar 'n
 * kerkmuur: 'n hoë middelvenster met laer vensters weerskante, presies soos
 * 'n regte lanset-arkade gebou is. Die hoogteverskil ís die argitektuur.
 *
 * Drie vlakke van diepte:
 *   1. die verste vensters, baie dof en effens klein
 *   2. die hoofarkade
 *   3. lig wat deur die glas op die vloer val — die skuins strale
 *
 * Alles is plein SVG teen 'n vaste viewBox. Geen biblioteek, niks om te meet,
 * niks om te faal nie — sien CLAUDE.md.
 */

/**
 * 'n Lanset van willekeurige hoogte, geteken vanaf sy voet.
 *
 * Die verhouding maak die vorm: die reguit kante moet die meerderheid van die
 * hoogte wees en die kruin 'n kort spits bo-op. Gee die boog te veel van die
 * hoogte en jy kry 'n amandel, nie 'n kerkvenster nie.
 */
function lanset(x: number, breedte: number, hoogte: number, bo = 0) {
  const onder = bo + hoogte;
  const mid = x + breedte / 2;

  // Hierdie drie getalle is die hele vorm. Hulle is uitgetoets deur die
  // silhoeët alleen te teken en te kyk — nie afgelei nie:
  //
  //   skouer 0.36, kruin 0.04, kontrole 0.043  ->  koepel (die logo se getalle
  //                                                werk net op logo-skaal)
  //   skouer 0.34, kruin 0.00, kontrole 0.10   ->  ware lanset (reg)
  //
  // Die sleutel is die GAPING tussen kruin en kontrolepunt. Sit hulle op
  // mekaar en die kruin rond af; skei hulle en die twee kurwes ontmoet in 'n
  // punt met vol skouers.
  const skouer = bo + hoogte * 0.34;
  const kruin = bo;
  const kontroleY = bo + hoogte * 0.1;

  return [
    `M${x} ${onder}`,
    `L${x} ${skouer}`,
    `Q${x} ${kontroleY} ${mid} ${kruin}`,
    `Q${x + breedte} ${kontroleY} ${x + breedte} ${skouer}`,
    `L${x + breedte} ${onder}`,
    "Z",
  ].join(" ");
}

type Venster = {
  x: number;
  breedte: number;
  hoogte: number;
  toon: string;
  /** Hoe diep in die toneel — kleiner = verder weg. */
  vlak: 1 | 2;
};

/**
 * Die arkade. Hoogtes styg na die middel toe en val weer — die profiel van 'n
 * kerk se gewel. Tone volg 'n regte glasry: koel aan die kante, warm in die
 * middel waar die lig deurval.
 */
const VENSTERS: Venster[] = [
  { x: 0, breedte: 54, hoogte: 104, toon: GLAS.kobalt, vlak: 1 },
  { x: 62, breedte: 58, hoogte: 130, toon: GLAS.see, vlak: 2 },
  { x: 128, breedte: 62, hoogte: 158, toon: GLAS.saffier, vlak: 2 },
  { x: 198, breedte: 68, hoogte: 190, toon: GLAS.amber, vlak: 2 },
  { x: 274, breedte: 62, hoogte: 158, toon: GLAS.wyn, vlak: 2 },
  { x: 344, breedte: 58, hoogte: 130, toon: GLAS.violet, vlak: 2 },
  { x: 410, breedte: 54, hoogte: 104, toon: GLAS.groen, vlak: 1 },
];

export function Vensterwand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden",
        className,
      )}
    >
      <svg
        viewBox="0 0 464 210"
        // `meet`, NIE `slice` NIE. Met slice word die viewBox oorvol geskaal
        // en die boë 1.77× wyer as hoog gerek — elke spits word 'n koepel.
        // Gemeet, nie geraai nie.
        preserveAspectRatio="xMidYMax meet"
        className="glas-glans h-auto w-full min-w-[900px]"
        fill="none"
      >
        <defs>
          {/* Elke venster verdof na onder toe — glas is helderder waar die lig
              inkom, en verloor krag na die vloer toe. */}
          {VENSTERS.map((v, i) => (
            <linearGradient
              key={i}
              id={`glas-${i}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={v.toon} stopOpacity="0.46" />
              <stop offset="55%" stopColor={v.toon} stopOpacity="0.24" />
              <stop offset="100%" stopColor={v.toon} stopOpacity="0.08" />
            </linearGradient>
          ))}

          {/* Die hele wand verdwyn na onder toe in die bladsy in. */}
          <linearGradient id="wand-verdwyn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="62%" stopColor="white" stopOpacity="0.75" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="wand-masker">
            <rect width="464" height="210" fill="url(#wand-verdwyn)" />
          </mask>
        </defs>

        <g mask="url(#wand-masker)">
          {VENSTERS.map((v, i) => {
            // Almal staan op dieselfde vloer (y=300); 'n hoër venster begin
            // net hoër op. Dit is wat 'n arkade van 'n ry losstaande vorms
            // onderskei.
            const d = lanset(v.x, v.breedte, v.hoogte, 210 - v.hoogte);
            // Verder weg = dowwer en dunner lood. Dit is die hele truuk agter
            // die dieptegevoel.
            const krag = v.vlak === 1 ? 0.5 : 1;

            return (
              <g
                key={i}
                className="boog-oop"
                style={{
                  animationDelay: `${0.1 + i * 0.075}s`,
                  opacity: krag,
                }}
              >
                <path d={d} fill={`url(#glas-${i})`} />
                <g
                  stroke={v.toon}
                  strokeOpacity={v.vlak === 1 ? 0.2 : 0.32}
                  strokeWidth={v.vlak === 1 ? 1 : 1.4}
                  strokeLinecap="round"
                >
                  <path d={d} />
                  {/* Die tracery: die stam en dwarsbalk vorm die kruis. */}
                  <path
                    d={`M${v.x + v.breedte / 2} ${210 - v.hoogte * 0.82} L${v.x + v.breedte / 2} 210`}
                  />
                  <path
                    d={`M${v.x + v.breedte * 0.22} ${210 - v.hoogte * 0.6} L${v.x + v.breedte * 0.78} ${210 - v.hoogte * 0.6}`}
                  />
                </g>
              </g>
            );
          })}

          {/* Ligstrale wat skuins deur die vensters val. Dit is wat die toneel
              van 'n tekening in 'n ruimte verander. */}
          <g className="lig-in vertraag-5">
            {VENSTERS.filter((v) => v.vlak === 2).map((v, i) => (
              <path
                key={i}
                d={`M${v.x} ${210 - v.hoogte * 0.55} L${v.x + v.breedte} ${210 - v.hoogte * 0.55} L${v.x + v.breedte + 42} 210 L${v.x + 42} 210 Z`}
                fill={v.toon}
                fillOpacity="0.05"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
