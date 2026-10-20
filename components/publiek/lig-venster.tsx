"use client";

import { useState } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { EREDIENSTE, GEMEENTE } from "@/lib/gemeente";

/** An imagined window, rather than a photograph of a different congregation. */
export function LigVenster() {
  const [starlight, setStarlight] = useState(false);
  const sunday = EREDIENSTE.find((service) => service.dag === "Sondag");
  return (
    <div className="site-art" data-starlight={starlight}>
      <div className="site-art-caption">
        <span className="site-dot" /> Almal is welkom.
      </div>
      <svg
        className="site-window"
        viewBox="0 0 520 540"
        fill="none"
        aria-hidden
      >
        <defs>
          <clipPath id="welcome-arch">
            <path d="M112 438V220a148 148 0 0 1 296 0v218Z" />
          </clipPath>
          <pattern
            id="window-grain"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".55" fill="currentColor" opacity=".13" />
          </pattern>
        </defs>
        <ellipse
          className="site-orbit"
          cx="260"
          cy="286"
          rx="233"
          ry="125"
          transform="rotate(-28 260 286)"
        />
        <path
          className="site-arch-outline"
          d="M87 439V220a173 173 0 0 1 346 0v219M64 439V220a196 196 0 0 1 392 0v219"
        />
        <g clipPath="url(#welcome-arch)">
          <path
            className="site-window-sky"
            d="M112 438V220a148 148 0 0 1 296 0v218Z"
          />
          <circle className="site-window-sun" cx="301" cy="206" r="60" />
          <image
            href="/logo/ng-merk-hero.webp"
            x="140"
            y="130"
            width="240"
            height="187"
            preserveAspectRatio="xMidYMid meet"
          />
          <g className="site-window-stars">
            <path d="M146 207v18m-9-9h18M348 278v18m-9-9h18M246 225v12m-6-6h12" />
          </g>
          <path
            className="site-hill-back"
            d="M83 374C153 314 196 296 246 296S356 282 432 359V466H83Z"
          />
          <path
            className="site-hill-front"
            d="M92 438c122-153 201-163 348-87v106H92Z"
          />
          <path
            className="site-window-path"
            d="M245 438c-12-55-1-84 54-123-26 49-22 78 1 123"
          />
          <path
            d="M112 438V220a148 148 0 0 1 296 0v218Z"
            fill="url(#window-grain)"
          />
        </g>
        <path
          className="site-window-border"
          d="M112 438V220a148 148 0 0 1 296 0v218Z"
        />
        <path
          className="site-window-ground"
          d="M82 439h356m-322 15h288m-259 15h230"
        />
        <g className="site-spark">
          <path d="m422 71 4 23 20-12-12 20 23 4-23 4 12 20-20-12-4 23-4-23-20 12 12-20-23-4 23-4-12-20 20 12Z" />
        </g>
        <g className="site-art-flower" transform="translate(80 380)">
          <path d="M0-26C19-47 38-17 17-10c32 1 25 35 3 24 17 25-14 42-23 16-5 29-38 16-22-8-28 11-37-23-9-27-24-16 0-42 18-21C-22-56 9-57 0-26Z" />
          <circle r="10" />
        </g>
      </svg>
      <span className="site-art-location">
        Vanderbijlpark <span aria-hidden>↗</span>
        <br />
        <small>Sedert {GEMEENTE.gestig}</small>
      </span>
      <button
        className="site-light-switch"
        type="button"
        onClick={() => setStarlight((value) => !value)}
        aria-pressed={starlight}
        aria-label={
          starlight
            ? "Wys daglig in die venster"
            : "Wys sterrelig in die venster"
        }
      >
        {starlight ? (
          <Moon size={19} aria-hidden />
        ) : (
          <Sun size={20} aria-hidden />
        )}
      </button>
      {sunday && (
        <Link href="/eredienste" className="site-art-ticket">
          <span className="site-dot" />
          <span>
            {sunday.dag} <strong>{sunday.tyd}</strong>
          </span>
          <ArrowUpRight size={18} aria-hidden />
        </Link>
      )}
    </div>
  );
}
