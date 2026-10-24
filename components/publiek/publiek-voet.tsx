import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, LockKeyhole, MapPin } from "lucide-react";
import { GEMEENTE } from "@/lib/gemeente";
import { KruisMerk } from "@/components/publiek/kruis-merk";

export function PubliekVoet() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="site-footer-top">
          <p>
            Almal is <em>welkom.</em>
            <span aria-hidden>
              <KruisMerk className="site-footer-cross" />
            </span>
          </p>
          <Link href="/registreer" className="site-text-link">
            Word deel van ons <ArrowUpRight size={20} aria-hidden />
          </Link>
        </div>
        <div className="site-footer-grid">
          <div>
            <Link href="/" className="site-brand">
              <Image
                src="/logo/ng-merk-256.png"
                alt=""
                width={44}
                height={44}
              />
              <span>
                <strong>{GEMEENTE.kortNaam}</strong>
                <small>Vanderbijlpark</small>
              </span>
            </Link>
            <p>
              &apos;n NG gemeente in Vanderbijlpark, in die Vaaldriehoek, sedert{" "}
              {GEMEENTE.gestig}. Almal is welkom.
            </p>
          </div>
          <div>
            <h2>Kom kuier</h2>
            <p className="site-footer-address">
              <MapPin size={17} aria-hidden />
              <span>
                {GEMEENTE.adres.straat}
                <br />
                {GEMEENTE.adres.dorp}, {GEMEENTE.adres.poskode}
              </span>
            </p>
            {GEMEENTE.kontak.facebook && (
              <a
                href={GEMEENTE.kontak.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="site-text-link"
              >
                Volg ons op Facebook <ArrowUpRight size={15} aria-hidden />
              </a>
            )}
          </div>
          <nav aria-label="Voetnavigasie">
            <h2>Skakels</h2>
            {[
              { label: "Eredienste", href: "/eredienste" },
              { label: "Nuut hier?", href: "/nuut-hier" },
              { label: "Bybelstudie", href: "/bybelstudie" },
              { label: "Vrae en antwoorde", href: "/vrae" },
              { label: "Oor ons", href: "/oor-ons" },
              { label: "Gemeentekalender", href: "/kalender-gemeente" },
              { label: "Bedienings", href: "/bedienings" },
              { label: "Word deel van ons", href: "/registreer" },
              { label: "Kontak", href: "/kontak" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
                <ArrowUpRight size={14} aria-hidden />
              </Link>
            ))}
          </nav>
        </div>
        <div className="site-footer-bottom">
          <p>
            © {new Date().getFullYear()} {GEMEENTE.naam}. Sinode{" "}
            {GEMEENTE.sinode}.
          </p>
          <Link href="/teken-in">
            <LockKeyhole size={13} aria-hidden />
            Kerkraad
          </Link>
        </div>
      </div>
    </footer>
  );
}
