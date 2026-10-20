import { GESKIEDENIS } from "@/lib/gemeente";

export function Geskiedenis({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ol className="site-timeline">
      {GESKIEDENIS.map((item, index) => (
        <li key={item.jaar} className="onthul">
          <span className="site-timeline-year">{item.jaar}</span>
          <div>
            <span className="site-timeline-index" aria-hidden>
              0{index + 1} /
            </span>
            <Heading>{item.titel}</Heading>
            <p>{item.teks}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
