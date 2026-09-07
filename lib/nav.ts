import {
  Archive,
  ClipboardList,
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Rol } from "@/lib/sessie";

export type NavItem = {
  etiket: string;
  href: string;
  ikoon: LucideIcon;
  /** Slegs sigbaar vir admin-gebruikers. */
  adminAlleen?: boolean;
  /**
   * Slegs sigbaar vir die rolle wat hier gelys is. Weglaat = almal sien dit.
   *
   * Dit versteek net die skakel. Die egte hek is RLS — sien migrasie 017.
   */
  rolle?: Rol[];
};

/**
 * Filtreer die sybalk vir 'n rol, en gee net die HREF's terug.
 *
 * Waarom nie die hele NavItem nie: `ikoon` is 'n React-komponent, en 'n
 * komponent kan nie van 'n Server Component na 'n Client Component aangestuur
 * word nie — die bou breek met "Functions cannot be passed directly to Client
 * Components". Die kliënt soek die ikoon self op uit NAV, wat 'n gewone module
 * is en dus aan albei kante beskikbaar is.
 */
export function navHrefsVir(rol: Rol | null): string[] {
  return NAV.filter((item) => {
    if (item.adminAlleen && rol !== "admin") return false;
    if (item.rolle && (!rol || !item.rolle.includes(rol))) return false;
    return true;
  }).map((item) => item.href);
}

/** Die volle items vir 'n lys HREF's, in NAV se eie volgorde. */
export function navVanHrefs(hrefs: string[]): NavItem[] {
  const stel = new Set(hrefs);
  return NAV.filter((item) => stel.has(item.href));
}

/**
 * Die sybalk. Volgorde volg Base44 s'n sodat die kerkraad nie hoef te
 * herleer nie — behalwe dat "Admin" nou 'n oortjie binne Instellings is.
 */
export const NAV: NavItem[] = [
  { etiket: "Dashboard", href: "/dashboard", ikoon: LayoutDashboard },
  { etiket: "Lidmate", href: "/lidmate", ikoon: Users },
  {
    etiket: "Bediening",
    href: "/bediening",
    ikoon: HeartHandshake,
    // Pastorale werk — die Dominee en 'n admin. Sien migrasie 021.
    rolle: ["dominee", "admin"],
  },
  { etiket: "Kalender", href: "/kalender", ikoon: Calendar },
  { etiket: "Verslae", href: "/verslae", ikoon: BarChart3 },
  { etiket: "Dokumentasie", href: "/dokumentasie", ikoon: FileText },
  { etiket: "Wyke", href: "/wyke", ikoon: MapPin },
  { etiket: "Gesinne", href: "/gesinne", ikoon: UsersRound },
  { etiket: "Registrasies", href: "/registrasies", ikoon: ClipboardList },
  { etiket: "Kategese", href: "/kategese", ikoon: BookOpen },
  { etiket: "Soek & Filter", href: "/soek", ikoon: Search },
  { etiket: "Argief", href: "/argief", ikoon: Archive },
  { etiket: "Kommunikasie", href: "/kommunikasie", ikoon: MessageSquare },
  { etiket: "Instellings", href: "/instellings", ikoon: Settings },
];
