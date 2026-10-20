import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  MapPin,
} from "lucide-react";
import { Bento } from "@/components/publiek/bento";
import { LigVenster } from "@/components/publiek/lig-venster";
import { Geskiedenis } from "@/components/publiek/geskiedenis";
import { KruisMerk } from "@/components/publiek/kruis-merk";
import { EREDIENSTE, GEMEENTE } from "@/lib/gemeente";

export default function TuisBladsy() {
  return (
    <>
      <section className="site-shell site-hero">
        <div className="site-hero-copy">
          <p className="site-eyebrow">
            <span className="site-dot" />
            Sedert {GEMEENTE.gestig} · Vanderbijlpark
          </p>
          <h1>
            Daar is plek
            <br />
            vir{" "}
            <span className="site-you">
              jou
              <svg viewBox="0 0 210 24" fill="none" aria-hidden>
                <path d="M4 17C60 3 133 2 204 10M18 22c70-9 119-8 176-7" />
              </svg>
            </span>
            <span className="site-hero-serif">by hierdie tafel</span>
          </h1>
          <p className="site-hero-intro">
            Die moedergemeente van Vanderbijlpark, al meer as sewentig jaar op
            dieselfde hoek
          </p>
          <div className="site-hero-actions">
            <Link href="/eredienste" className="site-button">
              Wanneer ons saamkom <ArrowUpRight size={19} aria-hidden />
            </Link>
            <Link href="/oor-ons" className="site-text-link">
              Leer ons ken <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
        <LigVenster />
        <div className="site-hero-bottom">
          <a href="#saamkom" className="site-scroll-link">
            <span>
              <ArrowDown size={16} aria-hidden />
            </span>
            Ontdek ons gemeente
          </a>
          <span className="site-hero-note">
            &apos;n Gemeente. &apos;n Tuiste.{" "}
            <KruisMerk className="site-cross-note" />
          </span>
        </div>
      </section>

      <section
        id="saamkom"
        className="site-services onthul"
        aria-labelledby="saamkom-titel"
      >
        <div className="site-shell site-services-grid">
          <div className="site-services-heading">
            <p className="site-eyebrow">Saam is beter</p>
            <h2 id="saamkom-titel">
              Sien jou
              <br />
              <em>Sondag.</em>
            </h2>
            <Link href="/eredienste" className="site-text-link">
              Wanneer ons saamkom <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
          {EREDIENSTE.map((service) => (
            <div className="site-service" key={service.naam}>
              <p className="site-eyebrow">
                <span className="site-dot" />
                {service.dag}
              </p>
              <span className="site-service-time">{service.tyd}</span>
              <h3>{service.naam}</h3>
              <p>{service.beskrywing}</p>
            </div>
          ))}
          <div className="site-service-location">
            <MapPin size={22} strokeWidth={1.5} aria-hidden />
            <p>
              {GEMEENTE.adres.straat}
              <br />
              <span>{GEMEENTE.adres.dorp}</span>
            </p>
            <Link href="/kontak" className="site-text-link">
              Kry aanwysings <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <Bento />

      <section
        className="site-shell site-story"
        aria-labelledby="verhaal-titel"
      >
        <div className="site-story-heading onthul">
          <p className="site-eyebrow">
            <span className="site-dot" />
            Ons verhaal
          </p>
          <h2 id="verhaal-titel">
            Meer as sewentig jaar <em>op hierdie hoek</em>
          </h2>
          <p>
            Die gemeente is in {GEMEENTE.gestig} gestig — dieselfde jaar as die
            dorp self. Direk of indirek is elke NG gemeente in Vanderbijlpark
            hieruit gebore.
          </p>
          <Link href="/oor-ons" className="site-text-link">
            Leer ons ken <ArrowUpRight size={18} aria-hidden />
          </Link>
          <span className="site-story-mark" aria-hidden>
            1949<span>→</span>
          </span>
        </div>
        <Geskiedenis />
      </section>

      <section className="site-shell site-invite-wrap">
        <div className="site-invite onthul">
          <Asterisk
            className="site-invite-star"
            size={160}
            strokeWidth={0.8}
            aria-hidden
          />
          <div>
            <p className="site-eyebrow">
              <KruisMerk className="site-cross-inline" />
              Nuut hier?
            </p>
            <h2>
              Kom sit gerus eers agter <em>en luister</em>
            </h2>
          </div>
          <div className="site-invite-copy">
            <p>
              Niemand gaan jou vra om op te staan of jouself voor te stel nie.
              Wanneer jy gereed is om deel te word, laat ons weet — dan kom ons
              na jou toe.
            </p>
            <Link href="/registreer" className="site-button">
              Word deel van ons <ArrowUpRight size={19} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
