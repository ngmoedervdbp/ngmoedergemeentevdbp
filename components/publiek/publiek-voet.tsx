import Link from "next/link";
import { Globe, LockKeyhole, MapPin } from "lucide-react";
import Image from "next/image";
import { GEMEENTE } from "@/lib/gemeente";

/**
 * Die voetstuk — en die enigste plek waar die kerkraad se stelsel genoem word.
 *
 * Waarom hier en nie in die hoofnavigasie nie: die werf is vir die gemeenskap,
 * en 'n "Teken in"-knop bo-aan laat dit lyk of jy 'n rekening nodig het om die
 * kerk se bladsy te lees. Maar 'n roete wat net iemand ken wat die URL onthou,
 * is 'n ondersteuningsprobleem vir 'n kerkraad van vyftien mense.
 *
 * 'n Voetstuk-skakel is die middeweg: dit is waar mense dit soek, en dit staan
 * uit die pad van elke ander besoeker.
 *
 * Let wel: dit is NIE sekuriteit nie. Die hek is proxy.ts en RLS. Om die
 * skakel weg te steek voeg niks by nie behalwe rustigheid.
 */
export function PubliekVoet() {
  const jaar = new Date().getFullYear();

  return (
    <footer className="border-line bg-surface mt-16 border-t">
      <div className="veilig-kant mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo/ng-logo-256.png"
                alt={GEMEENTE.naam}
                width={112}
                height={112}
                className="h-auto w-28 object-contain"
              />
            </div>
            <p className="text-ink-muted text-sm text-pretty">
              &apos;n Gemeente in die hart van Vanderbijlpark sedert{" "}
              {GEMEENTE.gestig}. Almal is welkom.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold tracking-[0.14em] uppercase">
              Kom kuier
            </h2>
            <p className="text-ink-muted flex items-start gap-2 text-sm">
              <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                {GEMEENTE.adres.straat}
                <br />
                {GEMEENTE.adres.dorp}, {GEMEENTE.adres.poskode}
              </span>
            </p>
            {GEMEENTE.kontak.facebook ? (
              <a
                href={GEMEENTE.kontak.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-ink inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold"
              >
                <Globe size={15} aria-hidden />
                Volg ons op Facebook
              </a>
            ) : null}
          </div>

          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-semibold tracking-[0.14em] uppercase">
              Skakels
            </h2>
            <ul className="flex flex-col">
              {[
                { etiket: "Eredienste", href: "/eredienste" },
                { etiket: "Oor ons", href: "/oor-ons" },
                { etiket: "Word deel van ons", href: "/registreer" },
                { etiket: "Kontak", href: "/kontak" },
              ].map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-ink-muted hover:text-ink inline-flex min-h-[44px] min-w-[44px] items-center text-sm"
                  >
                    {s.etiket}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-line mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-muted text-xs">
            © {jaar} {GEMEENTE.naam}. Sinode {GEMEENTE.sinode}.
          </p>

          {/* Vir die kerkraad. Rustig, maar vindbaar. */}
          <Link
            href="/teken-in"
            className="text-ink-muted hover:text-ink inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold"
          >
            <LockKeyhole size={13} aria-hidden />
            Kerkraad
          </Link>
        </div>
      </div>
    </footer>
  );
}
