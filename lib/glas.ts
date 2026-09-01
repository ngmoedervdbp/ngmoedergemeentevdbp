/**
 * Die ses glastone as hex, vir plekke waar 'n CSS-klas nie werk nie —
 * SVG-attribute, grafiek-reekse, inlyn style.
 *
 * Dit MOET 'n gewone module wees, nie deel van 'n "use client"-lêer nie.
 * 'n Server Component wat 'n konstante uit 'n kliëntmodule invoer, kry 'n
 * kliëntverwysing-proxy terug en nie die werklike waardes nie — dan is elke
 * kleur stil-stil `undefined`.
 *
 * Hou in pas met `@theme` in app/globals.css.
 */
export const GLAS = {
  saffier: "#3b3a72",
  kobalt: "#2e4b7c",
  groen: "#2f5a4e",
  wyn: "#77304a",
  amber: "#8f6522",
  violet: "#4e3c69",
  terra: "#8a4a32",
  see: "#2a5c66",
  roos: "#8d3f5e",
  olyf: "#5a5c2e",
} as const;

export type GlasToon = keyof typeof GLAS;

/**
 * Die oorspronklike ses, vir grafiekreekse waar 'n vaste, bekende volgorde
 * saak maak. Die vier nuwes is vir Bediening Opsporing se tien tipes en hoort
 * nie in 'n algemene reeks nie.
 */
export const GLAS_REEKS = [
  GLAS.saffier,
  GLAS.kobalt,
  GLAS.groen,
  GLAS.wyn,
  GLAS.amber,
  GLAS.violet,
];
