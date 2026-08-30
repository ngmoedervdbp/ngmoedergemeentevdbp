import { GLAS, GLAS_REEKS } from "@/lib/glas";

/**
 * Grafieke as gewone SVG — geen grafiekbiblioteek nie.
 *
 * recharts se <ResponsiveContainer> meet die DOM voor dit teken, en gee niks
 * terug tot die meting slaag nie. Wanneer daardie meting misluk — zoom, 'n
 * houer wat eers later 'n hoogte kry, 'n uitbreiding wat inmeng — kry jy 'n
 * leë blok sonder 'n fout. Hierdie weergawes teken teen 'n vaste viewBox en
 * skaal met CSS, so daar is niks om te meet nie en niks om te misluk nie.
 *
 * Bonus: dit is Server Components. Geen JS gaan blaaier toe vir 'n grafiek nie.
 */

const AS_KLEUR = "#6b6570";
const LYN = "#e1dcd2";

type Reeks = { naam: string; waarde: number };

/** Netjiese boonste asmerk — 4 word 4, 13 word 15, 42 word 45. */
function asTop(maks: number) {
  if (maks <= 4) return Math.max(1, maks);
  const stap = maks <= 10 ? 2 : maks <= 40 ? 5 : 10;
  return Math.ceil(maks / stap) * stap;
}

function merke(top: number, aantal = 4) {
  const stap = top / aantal;
  return Array.from({ length: aantal + 1 }, (_, i) => Math.round(stap * i));
}

/* ---------------------------------------------------------------
   Area — lidmaatgroei oor tyd
   --------------------------------------------------------------- */

export function GroeiGrafiek({ data }: { data: Reeks[] }) {
  const B = 640, H = 240;
  const L = 42, R = 14, T = 16, O = 40;
  const pb = B - L - R;
  const ph = H - T - O;

  const top = asTop(Math.max(...data.map((d) => d.waarde), 1));
  const x = (i: number) =>
    L + (data.length > 1 ? (pb * i) / (data.length - 1) : pb / 2);
  const y = (w: number) => T + ph - (w / top) * ph;

  const punte = data.map((d, i) => ({ x: x(i), y: y(d.waarde), ...d }));

  // Gladde kubieke kurwe deur die punte.
  const lyn = punte
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const v = punte[i - 1];
      const mx = (v.x + p.x) / 2;
      return `C ${mx} ${v.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(" ");

  const area = `${lyn} L ${punte[punte.length - 1].x} ${T + ph} L ${punte[0].x} ${T + ph} Z`;

  return (
    <svg viewBox={`0 0 ${B} ${H}`} className="h-auto w-full" role="img"
      aria-label={`Nuwe lidmate per maand: ${data.map((d) => `${d.naam} ${d.waarde}`).join(", ")}`}>
      <defs>
        <linearGradient id="groeiVul" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GLAS.saffier} stopOpacity="0.26" />
          <stop offset="100%" stopColor={GLAS.saffier} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {merke(top).map((m) => (
        <g key={m}>
          <line x1={L} x2={B - R} y1={y(m)} y2={y(m)} stroke={LYN}
            strokeWidth="1" strokeDasharray={m === 0 ? undefined : "3 4"} />
          <text x={L - 9} y={y(m)} textAnchor="end" dominantBaseline="middle"
            fontSize="12" fill={AS_KLEUR}>{m}</text>
        </g>
      ))}

      <path d={area} fill="url(#groeiVul)" />
      <path d={lyn} fill="none" stroke={GLAS.saffier} strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" />

      {punte.map((p, i) => (
        <g key={p.naam}>
          <circle cx={p.x} cy={p.y} r="3.4" fill="#fff"
            stroke={GLAS.saffier} strokeWidth="2">
            <title>{`${p.naam}: ${p.waarde}`}</title>
          </circle>
          {/*
            Die viewBox is 640 breed, maar die paneel is op 'n foon omtrent 340px
            — elke etiket kry dan sowat die helfte van sy grootte. Twaalf maande
            langs mekaar loop dan inmekaar, so ons wys net elke tweede een daar
            en almal van `sm` af. Die volledige reeks bly in die aria-label.
          */}
          <text
            x={p.x}
            y={H - 14}
            textAnchor="middle"
            fontSize="12"
            fill={AS_KLEUR}
            className={
              i % 2 === 1 && data.length > 6 ? "hidden sm:inline" : undefined
            }
          >
            {p.naam}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------
   Vertikale stawe — ouderdomsgroepe
   --------------------------------------------------------------- */

export function StaafGrafiek({
  data,
  kleur = GLAS.kobalt,
}: {
  data: Reeks[];
  kleur?: string;
}) {
  const B = 640, H = 260;
  const L = 42, R = 14, T = 16, O = 46;
  const pb = B - L - R;
  const ph = H - T - O;

  const top = asTop(Math.max(...data.map((d) => d.waarde), 1));
  const gleuf = pb / data.length;
  const breedte = Math.min(52, gleuf * 0.56);
  const y = (w: number) => T + ph - (w / top) * ph;

  return (
    <svg viewBox={`0 0 ${B} ${H}`} className="h-auto w-full" role="img"
      aria-label={data.map((d) => `${d.naam}: ${d.waarde}`).join(", ")}>
      {merke(top).map((m) => (
        <g key={m}>
          <line x1={L} x2={B - R} y1={y(m)} y2={y(m)} stroke={LYN}
            strokeWidth="1" strokeDasharray={m === 0 ? undefined : "3 4"} />
          <text x={L - 9} y={y(m)} textAnchor="end" dominantBaseline="middle"
            fontSize="12" fill={AS_KLEUR}>{m}</text>
        </g>
      ))}

      {data.map((d, i) => {
        const cx = L + gleuf * i + gleuf / 2;
        const hoogte = Math.max(0, T + ph - y(d.waarde));
        return (
          <g key={d.naam}>
            {d.waarde > 0 ? (
              <rect x={cx - breedte / 2} y={y(d.waarde)} width={breedte}
                height={hoogte} rx="5" fill={kleur}>
                <title>{`${d.naam}: ${d.waarde}`}</title>
              </rect>
            ) : null}
            {d.waarde > 0 ? (
              <text x={cx} y={y(d.waarde) - 7} textAnchor="middle" fontSize="12.5"
                fontWeight="600" fill={kleur}>{d.waarde}</text>
            ) : null}
            <text x={cx} y={H - 16} textAnchor="middle" fontSize="12" fill={AS_KLEUR}>
              {d.naam}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------------
   Horisontale stawe — lidmate per wyk
   --------------------------------------------------------------- */

export function HorisontaleStaaf({ data }: { data: Reeks[] }) {
  const B = 640;
  const L = 76, R = 46, T = 10;
  const ry = 30;
  const H = T + data.length * ry + 12;
  const pb = B - L - R;

  const top = Math.max(...data.map((d) => d.waarde), 1);
  const dik = 15;

  return (
    <svg viewBox={`0 0 ${B} ${H}`} className="h-auto w-full" role="img"
      aria-label={data.map((d) => `${d.naam}: ${d.waarde}`).join(", ")}>
      {data.map((d, i) => {
        const cy = T + i * ry + ry / 2;
        const breedte = (d.waarde / top) * pb;
        const kleur = GLAS_REEKS[i % GLAS_REEKS.length];
        return (
          <g key={d.naam}>
            <text x={L - 12} y={cy} textAnchor="end" dominantBaseline="middle"
              fontSize="12.5" fill={AS_KLEUR}>{d.naam}</text>
            <rect x={L} y={cy - dik / 2} width={pb} height={dik} rx="4" fill="#f1efea" />
            {d.waarde > 0 ? (
              <rect x={L} y={cy - dik / 2} width={Math.max(4, breedte)} height={dik}
                rx="4" fill={kleur}>
                <title>{`${d.naam}: ${d.waarde}`}</title>
              </rect>
            ) : null}
            <text x={L + Math.max(4, breedte) + 10} y={cy} dominantBaseline="middle"
              fontSize="12.5" fontWeight="600" fill={AS_KLEUR}>{d.waarde}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------------
   Ring — geslagsverspreiding
   --------------------------------------------------------------- */

export function RingGrafiek({
  data,
  kleure,
  hoogte = 210,
}: {
  data: Reeks[];
  kleure: string[];
  hoogte?: number;
}) {
  const totaal = data.reduce((s, d) => s + d.waarde, 0);
  const R = 42;
  const omtrek = 2 * Math.PI * R;
  const GAPING = 1.5;

  const segmente = data.reduce<
    { naam: string; waarde: number; kleur: string; dash: string; offset: number; persentasie: number }[]
  >((opgehoop, d, i) => {
    const deel = totaal > 0 ? d.waarde / totaal : 0;
    const lengte = Math.max(0, deel * omtrek - GAPING);
    const verloop = opgehoop.reduce(
      (som, _, j) => som + (totaal > 0 ? data[j].waarde / totaal : 0) * omtrek,
      0,
    );
    return [
      ...opgehoop,
      {
        naam: d.naam,
        waarde: d.waarde,
        kleur: kleure[i % kleure.length],
        dash: `${lengte} ${omtrek - lengte}`,
        offset: -verloop,
        persentasie: totaal > 0 ? Math.round(deel * 100) : 0,
      },
    ];
  }, []);

  return (
    <div style={{ height: hoogte }} className="flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full max-h-full" role="img"
        aria-label={data.map((d) => `${d.naam}: ${d.waarde}`).join(", ")}>
        <circle cx="50" cy="50" r={R} fill="none" stroke="#eae6dd" strokeWidth="14" />
        {segmente.map((seg) => (
          <circle key={seg.naam} cx="50" cy="50" r={R} fill="none" stroke={seg.kleur}
            strokeWidth="14" strokeDasharray={seg.dash} strokeDashoffset={seg.offset}
            transform="rotate(-90 50 50)">
            <title>{`${seg.naam}: ${seg.waarde} (${seg.persentasie}%)`}</title>
          </circle>
        ))}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
          className="fill-ink font-display" style={{ fontSize: 19, fontWeight: 600 }}>
          {totaal}
        </text>
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------- */

export function Legende({
  items,
}: {
  items: { naam: string; waarde: number; kleur: string }[];
}) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {items.map((i) => (
        <li key={i.naam} className="flex items-center gap-2 text-sm">
          <span aria-hidden className="size-2.5 rounded-[3px]"
            style={{ background: i.kleur }} />
          <span className="text-ink-muted">{i.naam}</span>
          <span className="tabular font-semibold">{i.waarde}</span>
        </li>
      ))}
    </ul>
  );
}
