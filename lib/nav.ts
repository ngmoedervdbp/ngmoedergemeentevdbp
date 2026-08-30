import {
  Archive,
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Search,
  Settings,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  etiket: string;
  href: string;
  ikoon: LucideIcon;
  /** Slegs sigbaar vir admin-gebruikers. */
  adminAlleen?: boolean;
};

/**
 * Die sybalk. Volgorde volg Base44 s'n sodat die kerkraad nie hoef te
 * herleer nie — behalwe dat "Admin" nou 'n oortjie binne Instellings is.
 */
export const NAV: NavItem[] = [
  { etiket: "Dashboard", href: "/dashboard", ikoon: LayoutDashboard },
  { etiket: "Lidmate", href: "/lidmate", ikoon: Users },
  { etiket: "Kalender", href: "/kalender", ikoon: Calendar },
  { etiket: "Verslae", href: "/verslae", ikoon: BarChart3 },
  { etiket: "Dokumentasie", href: "/dokumentasie", ikoon: FileText },
  { etiket: "Wyke", href: "/wyke", ikoon: MapPin },
  { etiket: "Gesinne", href: "/gesinne", ikoon: UsersRound },
  { etiket: "Kategese", href: "/kategese", ikoon: BookOpen },
  { etiket: "Soek & Filter", href: "/soek", ikoon: Search },
  { etiket: "Argief", href: "/argief", ikoon: Archive },
  { etiket: "Kommunikasie", href: "/kommunikasie", ikoon: MessageSquare },
  { etiket: "Instellings", href: "/instellings", ikoon: Settings },
];
