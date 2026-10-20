"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible without JS or motion support. */
export function WerfBeweging({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = content.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches || !("IntersectionObserver" in window))
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    root.querySelectorAll(".onthul").forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.setAttribute("data-revealed", "false");
      observer.observe(element);
    });
    const revealAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      root
        .querySelectorAll('[data-revealed="false"]')
        .forEach((element) => element.setAttribute("data-revealed", "true"));
    };
    preference.addEventListener("change", revealAll);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", revealAll);
    };
  }, [pathname]);

  return (
    <div key={pathname} ref={content} className="site-page">
      {children}
    </div>
  );
}
