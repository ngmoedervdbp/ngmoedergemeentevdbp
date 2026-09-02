/**
 * Wie is aangeteken, en wat mag hulle sien.
 *
 * Dit is 'n gewone module (geen "use client") sodat Server Components dit kan
 * invoer — sien CLAUDE.md oor konstantes uit kliëntmodules.
 *
 * Supabase Auth is nog nie gekoppel nie, so `huidigeGebruiker()` gee spotdata
 * terug. Die handtekening is reeds async en Supabase-vormig: sodra auth leef,
 * word net die binnekant vervang en elke oproepplek bly staan.
 */

import { createClient } from "@/lib/supabase/server";

export type Rol = "admin" | "dominee" | "skriba" | "ouderling" | "kerkraad";

export type Gebruiker = {
  id: string;
  naam: string;
  epos: string;
  rol: Rol;
  /** Slegs vir 'n wyksouderling — nog nie afgedwing nie. */
  wyk_id: string | null;
};

function heltSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Vir die demo sonder databasis. Verwyder saam met lib/mock/.
 */
const SPOTGEBRUIKER: Gebruiker = {
  id: "u1",
  naam: "Tiaan Botha",
  epos: "dev2@startechgroup.co.za",
  rol: "dominee",
  wyk_id: null,
};

/** Wat elke rol in die koppelvlak sien. */
export const ROL_ETIKET: Record<Rol, string> = {
  admin: "Administrateur",
  dominee: "Dominee",
  skriba: "Skriba",
  ouderling: "Ouderling",
  kerkraad: "Kerkraad",
};

/**
 * Bediening Opsporing is die Dominee se eie werkskerm — pastorale
 * aantekeninge, besoeke, liggings. 'n Admin kry dit ook, want iemand moet die
 * stelsel kan bestuur, maar niemand anders nie.
 *
 * Dit is die UI-kant van die reël. Die egte hek is RLS in migrasie 017: selfs
 * as iemand die URL raai, gee die databasis niks terug nie.
 */
export function magBediening(gebruiker: Gebruiker | null) {
  return gebruiker?.rol === "dominee" || gebruiker?.rol === "admin";
}

export function magAdmin(gebruiker: Gebruiker | null) {
  return gebruiker?.rol === "admin";
}

/**
 * Wie is nou aangeteken.
 *
 * Sonder Supabase-sleutels val dit terug op 'n spotgebruiker sodat die demo
 * sonder databasis werk. Sodra die sleutels daar is, kom die rol uit
 * `profiles` en die spotdata word nooit weer aangeraak nie.
 *
 * `getUser()` en NIE `getSession()` nie: getSession lees net die koekie en
 * verifieer die token nie by Supabase nie — 'n vervalste koekie sou deurglip.
 */
export async function huidigeGebruiker(): Promise<Gebruiker | null> {
  if (!heltSupabase()) return SPOTGEBRUIKER;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, epos, rol, wyk_id")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    // Die auth-gebruiker bestaan maar sy profiel nie — dit beteken die
    // sneller in migrasie 010 het nie geloop nie. Laat hom nie sonder rol
    // rondloop nie; behandel dit as nie-aangeteken.
    console.error(
      "[sessie] geen profiel vir auth-gebruiker nie:",
      user.id,
      error?.message,
    );
    return null;
  }

  const naam = [data.first_name, data.last_name].filter(Boolean).join(" ");

  return {
    id: data.id,
    naam: naam || (data.epos ?? "Kerkraadslid"),
    epos: data.epos ?? user.email ?? "",
    rol: data.rol,
    wyk_id: data.wyk_id,
  };
}
