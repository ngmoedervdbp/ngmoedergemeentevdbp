import type { NextConfig } from "next";

/**
 * Toestelle op dieselfde netwerk wat die ontwikkelbediener mag tref.
 *
 * Next blokkeer versoeke na dev-bates vanaf enige oorsprong behalwe die een
 * waarmee die bediener begin het (`localhost`). Dit is 'n veiligheidsmaatreël:
 * sonder dit kan 'n webwerf wat jy in dieselfde blaaier oop het jou plaaslike
 * dev-bediener aftas.
 *
 * Hierdie lys geld SLEGS in ontwikkeling — `next build` en produksie ignoreer
 * dit heeltemal. Voeg net adresse by wat jy vertrou: jou eie masjien se
 * LAN-adres, of 'n foon op dieselfde wi-fi wat die app toets.
 *
 * Kry jou huidige adres met:  ipconfig getifaddr en0
 */
const DEV_OORSPRONGE = [
  "192.169.64.149", // hierdie masjien se LAN-adres
];

const nextConfig: NextConfig = {
  allowedDevOrigins: DEV_OORSPRONGE,
};

export default nextConfig;
