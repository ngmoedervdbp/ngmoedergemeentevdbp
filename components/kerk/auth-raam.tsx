import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KruisMerk } from "@/components/publiek/kruis-merk";
import { WerkruimteKuns } from "@/components/kerk/werkruimte-kuns";

export function AuthRaam({
  titel,
  beskrywing,
  kennisgewing,
  children,
}: {
  titel: string;
  beskrywing: string;
  kennisgewing?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-auth-frame veilig-bo veilig-onder">
      <aside className="admin-auth-visual" aria-label="NG Moedergemeente">
        <Link href="/" className="admin-brand">
          <Image
            src="/logo/ng-merk-256.png"
            alt=""
            width={44}
            height={44}
            priority
          />
          <span>
            <strong>NG Moedergemeente</strong>
            <small>Vanderbijlpark</small>
          </span>
        </Link>
        <WerkruimteKuns className="admin-auth-art" />
        <p>
          Daar is plek vir jou
          <br />
          by hierdie tafel.
        </p>
      </aside>
      <main className="admin-auth-content">
        <div className="admin-auth-card">
          <p className="admin-eyebrow">
            <KruisMerk />
            Lidmaatbestuur
          </p>
          <h1>{titel}</h1>
          <p className="admin-auth-intro">{beskrywing}</p>
          {children}
        </div>
        {kennisgewing && <p className="admin-auth-notice">{kennisgewing}</p>}
        <Link href="/" className="admin-auth-back">
          <ArrowLeft size={15} aria-hidden />
          Terug na webwerf
        </Link>
      </main>
    </div>
  );
}
