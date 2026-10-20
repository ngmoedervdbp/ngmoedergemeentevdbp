import { KruisMerk } from "@/components/publiek/kruis-merk";

export function PubliekKop({
  oortitel,
  titel,
  leiding,
}: {
  oortitel?: string;
  titel: string;
  leiding?: string;
}) {
  return (
    <section className="site-page-heading site-shell">
      <div className="site-heading-top">
        {oortitel && (
          <p className="site-eyebrow">
            <span className="site-dot" />
            {oortitel}
          </p>
        )}
        <KruisMerk className="site-heading-cross" />
      </div>
      <h1>{titel}</h1>
      {leiding && <p className="site-page-intro">{leiding}</p>}
    </section>
  );
}
