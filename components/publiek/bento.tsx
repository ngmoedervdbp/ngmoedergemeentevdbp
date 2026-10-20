import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  HandHeart,
  Music,
  Sparkles,
  Users,
} from "lucide-react";
import { komendePubliek } from "@/lib/publieke-kalender";
import { GEMEENTE } from "@/lib/gemeente";
import { fmtKalenderDatum } from "@/lib/format";

const BEDIENING_SKAKELS = [
  { icon: BookOpen, label: "Kategese", anchor: "kategese" },
  { icon: Users, label: "Jeug", anchor: "jeug" },
  { icon: HandHeart, label: "Omgee", anchor: "barmhartigheid" },
  { icon: Music, label: "Sang", anchor: "musiek-en-sang" },
  { icon: Sparkles, label: "Seniors", anchor: "seniors" },
  { icon: CalendarDays, label: "Byeenkomste", anchor: "" },
];

export async function Bento() {
  const komende = await komendePubliek(5);
  return (
    <section
      className="site-shell site-happenings"
      aria-labelledby="gebeur-titel"
    >
      <div className="site-section-heading onthul">
        <div>
          <p className="site-eyebrow">
            <span className="site-dot" />
            Wat by ons gebeur
          </p>
          <h2 id="gebeur-titel">
            Daar is elke week
            <br />
            <em>iets aan die gang</em>
          </h2>
        </div>
        <Link href="/kalender-gemeente" className="site-text-link">
          Sien die hele kalender <ArrowUpRight size={18} aria-hidden />
        </Link>
      </div>
      <div className="site-community-grid">
        <div className="site-events onthul">
          <div className="site-panel-heading">
            <div>
              <p className="site-eyebrow">Kalender</p>
              <h3>Komende byeenkomste</h3>
            </div>
            <CalendarDays size={26} strokeWidth={1.4} aria-hidden />
          </div>
          {komende.length ? (
            <ul className="site-event-list">
              {komende.map((event) => {
                const date = fmtKalenderDatum(event.datum);
                return (
                  <li key={event.id}>
                    <time className="site-date" dateTime={event.datum}>
                      <strong>{date.dag}</strong>
                      <small>{date.maand}</small>
                    </time>
                    <div>
                      <h4>{event.titel}</h4>
                      <p>
                        {event.tyd}
                        {event.tyd && event.plek ? " · " : ""}
                        {event.plek}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="site-events-empty">
              <CalendarDays size={42} strokeWidth={1} aria-hidden />
              <h4>Nog niks op die kalender nie</h4>
              <p>
                Kyk gerus later weer, of volg ons op Facebook vir die jongste.
              </p>
              {GEMEENTE.kontak.facebook && (
                <a
                  className="site-text-link"
                  href={GEMEENTE.kontak.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Volg ons op Facebook <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
            </div>
          )}
          <Link href="/kalender-gemeente" className="site-text-link">
            Sien die hele kalender <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <div className="site-community-side">
          <div className="site-ministries-preview onthul">
            <div className="site-panel-heading">
              <div>
                <p className="site-eyebrow">Bedienings</p>
                <h3>Waar jy kan inskakel</h3>
              </div>
              <span className="site-mini-spark" aria-hidden>
                ✳
              </span>
            </div>
            <ul>
              {BEDIENING_SKAKELS.map(({ icon: Icon, label, anchor }) => (
                <li key={label}>
                  <Link
                    href={
                      anchor ? `/bedienings#${anchor}` : "/kalender-gemeente"
                    }
                  >
                    <Icon size={17} strokeWidth={1.6} aria-hidden />
                    {label}
                    <ArrowUpRight size={14} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/bedienings" className="site-text-link">
              Al ons bedienings <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <Link href="/oor-ons" className="site-years onthul">
            <div>
              <span className="site-eyebrow">Sedert {GEMEENTE.gestig}</span>
              <p>
                <strong>{new Date().getFullYear() - GEMEENTE.gestig}</strong>{" "}
                <span>
                  jaar op
                  <br />
                  hierdie hoek
                </span>
              </p>
            </div>
            <span className="site-circle-arrow">
              <ArrowUpRight size={24} aria-hidden />
            </span>
            <span className="sr-only">Ons verhaal</span>
          </Link>
        </div>
      </div>
      <div className="site-first-visit onthul">
        <span className="site-first-icon">
          <Sparkles size={24} strokeWidth={1.4} aria-hidden />
        </span>
        <div>
          <h3>Eerste keer hier?</h3>
          <p>
            Kom soos jy is, sit waar jy wil, en gaan wanneer jy wil. Niemand
            gaan jou vra om op te staan nie.
          </p>
        </div>
        <Link href="/eredienste" className="site-text-link">
          Wat om te verwag <ArrowUpRight size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
