import { publicPageMetadata } from "@/lib/seo";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  HandHeart,
  HeartHandshake,
  Music,
  Sprout,
  Users,
} from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { BEDIENINGS } from "@/lib/gemeente";

export const metadata = publicPageMetadata("/bedienings");

const MINISTRY_ICONS = [
  BookOpen,
  Sprout,
  Users,
  HandHeart,
  HeartHandshake,
  Music,
];
const MINISTRY_IDS = [
  "kategese",
  "jeug",
  "vroue-en-mansbediening",
  "barmhartigheid",
  "seniors",
  "musiek-en-sang",
];

export default function BedieningsBladsy() {
  return (
    <>
      <PublicPageStructuredData path="/bedienings" />
      <PubliekKop
        oortitel="Bedienings"
        titel="Kategese, jeug en bedienings"
        leiding="'n Gemeente is nie 'n gebou nie — dit is die mense en die werk wat hulle saam doen. Hier is 'n paar plekke waar jy welkom is."
      />
      <section className="site-content">
        <ul className="site-ministry-list">
          {BEDIENINGS.map((ministry, index) => {
            const Icon = MINISTRY_ICONS[index % MINISTRY_ICONS.length];
            return (
              <li
                id={MINISTRY_IDS[index]}
                key={ministry.naam}
                className="site-ministry onthul"
              >
                <span className="site-ministry-number" aria-hidden>
                  0{index + 1} /
                </span>
                <span className="site-ministry-icon">
                  <Icon size={24} strokeWidth={1.4} aria-hidden />
                </span>
                <div>
                  <h2>{ministry.naam}</h2>
                  <p>{ministry.beskrywing}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="site-info-panel onthul mt-10">
          <h2>Wil jy help, of hulp kry?</h2>
          <p className="mt-3">
            Albei is welkom, en albei begin met dieselfde gesprek. Laat weet ons
            en iemand kom terug na jou toe.
          </p>
          <Link href="/kontak" className="site-text-link mt-4">
            Kontak ons <ArrowUpRight size={18} aria-hidden />
          </Link>
          <Link href="/vrae#kinders-en-jeug" className="site-text-link mt-4 sm:ml-6">
            Vrae oor Sondagskool en jeug <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
