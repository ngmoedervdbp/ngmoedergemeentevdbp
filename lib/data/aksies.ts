"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminKliënt } from "@/lib/supabase/admin";
import { huidigeGebruiker, magBediening, magSkryf } from "@/lib/sessie";

/**
 * Skryfaksies vir die admin-app en die bedieningsopsporing.
 *
 * Elke aksie:
 *   1. bevestig daar is 'n aangetekende gebruiker (RLS sou dit ook keer, maar
 *      'n duidelike boodskap is beter as 'n stil mislukking);
 *   2. skryf;
 *   3. revalideer die bladsy sodat die nuwe ry dadelik wys.
 *
 * Die egte hek bly RLS — hierdie kontroles is vir 'n bruikbare boodskap, nie
 * vir sekuriteit nie.
 */

export type AksieUitslag = { ok: true } | { ok: false; fout: string };

const GEEN_SESSIE: AksieUitslag = {
  ok: false,
  fout: "Jou sessie het verval. Teken asseblief weer in.",
};

const GEEN_SKRYFREG: AksieUitslag = {
  ok: false,
  fout: "Jy het leesregte — vra 'n skriba of admin om dit te verander.",
};

/**
 * Sessie vir 'n SKRYFaksie.
 *
 * Elke aksie in hierdie lêer verander data, so die skryfkontrole hoort hier —
 * een plek wat nie vergeet kan word nie, eerder as twintig herhalings.
 *
 * `null`  = geen sessie
 * `false` = aangeteken maar leesregte alleen
 */
async function skryfSessie() {
  const gebruiker = await huidigeGebruiker();
  if (!gebruiker) return null;
  if (!magSkryf(gebruiker)) return false as const;
  return { supabase: await createClient(), gebruiker };
}

/** Vir aksies wat hul eie rolkontrole doen (bv. admin-werk). */
async function kliëntOfNiks() {
  const gebruiker = await huidigeGebruiker();
  if (!gebruiker) return null;
  return { supabase: await createClient(), gebruiker };
}

function fouthantering(konteks: string, error: { code?: string; message: string }) {
  console.error(`[${konteks}]`, error.code, error.message);
  return {
    ok: false as const,
    fout: "Kon dit nie stoor nie. Probeer asseblief weer.",
  };
}

/* ------------------------------------------------------------------ lidmate */

export async function stoorLidmaat(data: FormData): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    first_name: String(data.get("first_name") ?? "").trim(),
    last_name: String(data.get("last_name") ?? "").trim(),
    date_of_birth: leegNaNull(data.get("date_of_birth")),
    geslag: String(data.get("geslag") ?? "manlik"),
    status: String(data.get("status") ?? "aktief"),
    tipe: String(data.get("tipe") ?? "belydend"),
    selfoon: leegNaNull(data.get("selfoon")),
    epos: leegNaNull(data.get("epos")),
    wyk_id: leegNaNull(data.get("wyk_id")),
    family_id: leegNaNull(data.get("family_id")),
    family_role: leegNaNull(data.get("family_role")),
    aantekeninge: leegNaNull(data.get("aantekeninge")),
  };

  if (!ry.first_name || !ry.last_name) {
    return { ok: false, fout: "Voornaam en van is verpligtend." };
  }

  const { error } = id
    ? await sessie.supabase.from("lede").update(ry).eq("id", id)
    : await sessie.supabase.from("lede").insert(ry);

  if (error) return fouthantering("stoorLidmaat", error);

  revalidatePath("/lidmate");
  revalidatePath("/dashboard");
  if (id) revalidatePath(`/lidmate/${id}`);
  return { ok: true };
}

/**
 * Verander net die status — vir "Heraktiveer" in Argief en vir oorplasing.
 *
 * Ons vee NOOIT 'n lidmaat uit nie; dit is historiese rekords van 'n gemeente.
 * Sien CLAUDE.md § Domain model.
 */
export async function stelLidmaatStatus(
  id: string,
  status: string,
): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase
    .from("lede")
    .update({ status })
    .eq("id", id);

  if (error) return fouthantering("stelLidmaatStatus", error);

  revalidatePath("/lidmate");
  revalidatePath("/argief");
  revalidatePath("/dashboard");
  return { ok: true };
}

/* ------------------------------------------------------------------- gesinne */

export async function stoorGesin(data: FormData): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    naam: String(data.get("naam") ?? "").trim(),
    adres: leegNaNull(data.get("adres")),
    stad: leegNaNull(data.get("stad")),
    wyk_id: leegNaNull(data.get("wyk_id")),
  };

  if (!ry.naam) return { ok: false, fout: "Gesinnaam is verpligtend." };

  const { error } = id
    ? await sessie.supabase.from("families").update(ry).eq("id", id)
    : await sessie.supabase.from("families").insert(ry);

  if (error) return fouthantering("stoorGesin", error);

  revalidatePath("/gesinne");
  return { ok: true };
}

/* --------------------------------------------------------------------- wyke */

export async function stoorWyk(data: FormData): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    nommer: String(data.get("nommer") ?? "").trim(),
    naam: String(data.get("naam") ?? "").trim(),
    ouderling: leegNaNull(data.get("ouderling")),
    kapasiteit: Number(data.get("kapasiteit") ?? 50),
  };

  if (!ry.nommer || !ry.naam) {
    return { ok: false, fout: "Wyknommer en naam is verpligtend." };
  }

  const { error } = id
    ? await sessie.supabase.from("wyke").update(ry).eq("id", id)
    : await sessie.supabase.from("wyke").insert(ry);

  if (error) return fouthantering("stoorWyk", error);

  revalidatePath("/wyke");
  return { ok: true };
}

/* --------------------------------------------------------------- kalender */

export async function stoorGebeurtenis(data: FormData): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    titel: String(data.get("titel") ?? "").trim(),
    datum: String(data.get("datum") ?? ""),
    tyd: leegNaNull(data.get("tyd")),
    plek: leegNaNull(data.get("plek")),
    kategorie: String(data.get("kategorie") ?? "algemeen"),
    beskrywing: leegNaNull(data.get("beskrywing")),
  };

  if (!ry.titel || !ry.datum) {
    return { ok: false, fout: "Titel en datum is verpligtend." };
  }

  const { error } = id
    ? await sessie.supabase.from("events").update(ry).eq("id", id)
    : await sessie.supabase.from("events").insert(ry);

  if (error) return fouthantering("stoorGebeurtenis", error);

  revalidatePath("/kalender");
  revalidatePath("/dashboard");
  revalidatePath("/kalender-gemeente");
  return { ok: true };
}

export async function veeGebeurtenisUit(id: string): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase.from("events").delete().eq("id", id);
  if (error) return fouthantering("veeGebeurtenisUit", error);

  revalidatePath("/kalender");
  revalidatePath("/kalender-gemeente");
  return { ok: true };
}

/* --------------------------------------------------------- registrasies */

export async function keurRegistrasie(
  id: string,
  goedgekeur: boolean,
): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase
    .from("pending_registrations")
    .update({
      status: goedgekeur ? "goedgekeur" : "afgekeur",
      goedgekeur_deur: sessie.gebruiker.id,
      goedgekeur_op: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return fouthantering("keurRegistrasie", error);

  revalidatePath("/registrasies");
  return { ok: true };
}

/**
 * Keur goed EN skep die lidmaat in een stap.
 *
 * Die twee skryfwerke is nie 'n transaksie nie — Supabase se REST-laag bied
 * dit nie. As die tweede misluk, bly die registrasie 'wagtend' sodat iemand
 * dit weer kan probeer; dit is die veiliger kant om op te faal.
 */
export async function keurGoedEnSkepLidmaat(id: string): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { data: reg, error: leesFout } = await sessie.supabase
    .from("pending_registrations")
    .select("first_name, last_name, date_of_birth, geslag, selfoon, epos, adres")
    .eq("id", id)
    .single();

  if (leesFout || !reg) {
    return fouthantering("keurGoedEnSkepLidmaat/lees", leesFout ?? {
      message: "geen ry",
    });
  }

  const { data: nuweLid, error: skepFout } = await sessie.supabase
    .from("lede")
    .insert({
      first_name: reg.first_name,
      last_name: reg.last_name,
      date_of_birth: reg.date_of_birth,
      geslag: reg.geslag ?? "manlik",
      status: "aktief",
      tipe: "belydend",
      selfoon: reg.selfoon,
      epos: reg.epos,
    })
    .select("id")
    .single();

  if (skepFout) return fouthantering("keurGoedEnSkepLidmaat/skep", skepFout);

  const { error: merkFout } = await sessie.supabase
    .from("pending_registrations")
    .update({
      status: "goedgekeur",
      goedgekeur_lid_id: nuweLid.id,
      goedgekeur_deur: sessie.gebruiker.id,
      goedgekeur_op: new Date().toISOString(),
    })
    .eq("id", id);

  if (merkFout) return fouthantering("keurGoedEnSkepLidmaat/merk", merkFout);

  revalidatePath("/registrasies");
  revalidatePath("/lidmate");
  revalidatePath("/dashboard");
  return { ok: true };
}

/* ------------------------------------------------- bediening (die Dominee) */

export async function stoorAktiwiteit(data: FormData): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;

  if (!magBediening(sessie.gebruiker)) {
    return { ok: false, fout: "Jy het nie toegang tot hierdie deel nie." };
  }
  if (!magSkryf(sessie.gebruiker)) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    // RLS eis dat dominee_id die aangetekende gebruiker is; ons stel dit hier
    // sodat 'n vervalste veld in die vorm niks kan doen nie.
    dominee_id: sessie.gebruiker.id,
    titel: String(data.get("titel") ?? "").trim(),
    tipe: String(data.get("tipe") ?? "tuisbesoek"),
    lidmaat_tipe: leegNaNull(data.get("lidmaat_tipe")),
    datum: String(data.get("datum") ?? ""),
    begin_tyd: leegNaNull(data.get("begin_tyd")),
    eind_tyd: leegNaNull(data.get("eind_tyd")),
    plek_naam: leegNaNull(data.get("plek_naam")),
    adres: leegNaNull(data.get("adres")),
    aantekeninge: leegNaNull(data.get("aantekeninge")),
  };

  if (!ry.titel || !ry.datum) {
    return { ok: false, fout: "Titel en datum is verpligtend." };
  }

  const { error } = id
    ? await sessie.supabase
        .from("bediening_aktiwiteite")
        .update(ry)
        .eq("id", id)
    : await sessie.supabase.from("bediening_aktiwiteite").insert(ry);

  if (error) return fouthantering("stoorAktiwiteit", error);

  revalidatePath("/bediening");
  return { ok: true };
}

export async function veeAktiwiteitUit(id: string): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;
  if (!magBediening(sessie.gebruiker)) {
    return { ok: false, fout: "Jy het nie toegang tot hierdie deel nie." };
  }
  if (!magSkryf(sessie.gebruiker)) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase
    .from("bediening_aktiwiteite")
    .delete()
    .eq("id", id);

  if (error) return fouthantering("veeAktiwiteitUit", error);

  revalidatePath("/bediening");
  return { ok: true };
}

export async function stoorAfspraak(data: FormData): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;
  if (!magBediening(sessie.gebruiker)) {
    return { ok: false, fout: "Jy het nie toegang tot hierdie deel nie." };
  }
  if (!magSkryf(sessie.gebruiker)) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    dominee_id: sessie.gebruiker.id,
    titel: String(data.get("titel") ?? "").trim(),
    beskrywing: leegNaNull(data.get("beskrywing")),
    persoon_naam: leegNaNull(data.get("persoon_naam")),
    persoon_selfoon: leegNaNull(data.get("persoon_selfoon")),
    persoon_epos: leegNaNull(data.get("persoon_epos")),
    datum: String(data.get("datum") ?? ""),
    begin_tyd: leegNaNull(data.get("begin_tyd")),
    eind_tyd: leegNaNull(data.get("eind_tyd")),
    plek_naam: leegNaNull(data.get("plek_naam")),
    status: String(data.get("status") ?? "hangend"),
    aantekeninge: leegNaNull(data.get("aantekeninge")),
  };

  if (!ry.titel || !ry.datum) {
    return { ok: false, fout: "Titel en datum is verpligtend." };
  }

  const { error } = id
    ? await sessie.supabase.from("afsprake").update(ry).eq("id", id)
    : await sessie.supabase.from("afsprake").insert(ry);

  if (error) return fouthantering("stoorAfspraak", error);

  revalidatePath("/bediening/afsprake");
  return { ok: true };
}

export async function stelAfspraakStatus(
  id: string,
  status: string,
): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;
  if (!magBediening(sessie.gebruiker)) {
    return { ok: false, fout: "Jy het nie toegang tot hierdie deel nie." };
  }
  if (!magSkryf(sessie.gebruiker)) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase
    .from("afsprake")
    .update({ status })
    .eq("id", id);

  if (error) return fouthantering("stelAfspraakStatus", error);

  revalidatePath("/bediening/afsprake");
  return { ok: true };
}

/** 'n Leë vormveld is `null` in die databasis, nie "" nie. */
function leegNaNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

/* -------------------------------------------------------------- gebruikers */

/**
 * Verander 'n kerkraadslid se rol.
 *
 * Slegs 'n admin mag dit — beide hier en in RLS (die "admin bestuur profiele"
 * beleid in migrasie 011).
 */
export async function stelGebruikerRol(
  id: string,
  rol: string,
): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;

  if (sessie.gebruiker.rol !== "admin") {
    return { ok: false, fout: "Net 'n admin kan rolle verander." };
  }

  // Moenie jouself uit admin skop nie — dan kan niemand meer rolle bestuur nie.
  if (id === sessie.gebruiker.id && rol !== "admin") {
    return {
      ok: false,
      fout: "Jy kan nie jou eie admin-regte verwyder nie.",
    };
  }

  const { error } = await sessie.supabase
    .from("profiles")
    .update({ rol })
    .eq("id", id);

  if (error) return fouthantering("stelGebruikerRol", error);

  revalidatePath("/instellings");
  return { ok: true };
}

/**
 * Werk 'n kerkraadslid se naam by.
 *
 * Die profiel word deur die sneller in 010 geskep met net 'n e-pos; iemand
 * moet die naam invul sodat die app nie 'n e-posadres as 'n naam wys nie.
 */
export async function stoorGebruikerNaam(
  id: string,
  first_name: string,
  last_name: string,
): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;

  const { error } = await sessie.supabase
    .from("profiles")
    .update({
      first_name: first_name.trim() || null,
      last_name: last_name.trim() || null,
    })
    .eq("id", id);

  if (error) return fouthantering("stoorGebruikerNaam", error);

  revalidatePath("/instellings");
  return { ok: true };
}

/** Voeg 'n pastorale aantekening by 'n lidmaat se rekord. */
export async function stoorAantekening(
  id: string,
  aantekeninge: string,
): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase
    .from("lede")
    .update({ aantekeninge: aantekeninge.trim() || null })
    .eq("id", id);

  if (error) return fouthantering("stoorAantekening", error);

  revalidatePath(`/lidmate/${id}`);
  return { ok: true };
}

/* ---------------------------------------------------------------- kategese */

export async function stoorKategeseGroep(
  data: FormData,
): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const id = String(data.get("id") ?? "");
  const ry = {
    naam: String(data.get("naam") ?? "").trim(),
    ouderdomsgroep: leegNaNull(data.get("ouderdomsgroep")),
    onderwyser: leegNaNull(data.get("onderwyser")),
    lokaal: leegNaNull(data.get("lokaal")),
    dag: leegNaNull(data.get("dag")),
    tyd: leegNaNull(data.get("tyd")),
  };

  if (!ry.naam) return { ok: false, fout: "Groepnaam is verpligtend." };

  const { error } = id
    ? await sessie.supabase.from("kategese_groups").update(ry).eq("id", id)
    : await sessie.supabase.from("kategese_groups").insert(ry);

  if (error) return fouthantering("stoorKategeseGroep", error);

  revalidatePath("/kategese");
  return { ok: true };
}

/** Deel 'n kind by 'n kategesegroep in (of haal hom uit). */
export async function stelKategeseLid(
  kategese_group_id: string,
  lid_id: string,
  binne: boolean,
): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { error } = binne
    ? await sessie.supabase
        .from("kategese_group_lede")
        .upsert({ kategese_group_id, lid_id })
    : await sessie.supabase
        .from("kategese_group_lede")
        .delete()
        .eq("kategese_group_id", kategese_group_id)
        .eq("lid_id", lid_id);

  if (error) return fouthantering("stelKategeseLid", error);

  revalidatePath("/kategese");
  return { ok: true };
}

/** Skrap 'n wyk. Lidmate se `wyk_id` word null (on delete set null). */
export async function veeWykUit(id: string): Promise<AksieUitslag> {
  const sessie = await skryfSessie();
  if (sessie === null) return GEEN_SESSIE;
  if (sessie === false) return GEEN_SKRYFREG;

  const { error } = await sessie.supabase.from("wyke").delete().eq("id", id);
  if (error) return fouthantering("veeWykUit", error);

  revalidatePath("/wyke");
  revalidatePath("/lidmate");
  return { ok: true };
}

/* ---------------------------------------------------- uitnodigings & wagwoorde */

/**
 * Nooi 'n nuwe kerkraadslid.
 *
 * Supabase stuur die e-pos; die persoon klik die skakel en kies self 'n
 * wagwoord. Ons sien dit nooit — dit is die punt van 'n uitnodiging eerder as
 * om 'n wagwoord te skep en dit oor WhatsApp te stuur.
 *
 * Die rol word as metadata saamgestuur EN daarna op die profiel gestel: die
 * sneller in migrasie 010 skep die profiel met die verstek 'kerkraad', so ons
 * moet dit ná die uitnodiging regstel.
 */
export async function nooiGebruiker(
  epos: string,
  rol: string,
): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;

  if (sessie.gebruiker.rol !== "admin") {
    return { ok: false, fout: "Net 'n admin kan gebruikers nooi." };
  }

  const skoon = epos.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(skoon)) {
    return { ok: false, fout: "Voer 'n geldige e-posadres in." };
  }

  const admin = adminKliënt();
  if (!admin) {
    return {
      ok: false,
      fout:
        "Uitnodigings is nog nie opgestel nie — SUPABASE_SERVICE_ROLE_KEY ontbreek.",
    };
  }

  const { data, error } = await admin.auth.admin.inviteUserByEmail(skoon, {
    redirectTo: `${werfURL()}/wagwoord-nuut`,
  });

  if (error) {
    console.error("[nooiGebruiker]", error.message);
    // Hierdie een is nuttig om deur te gee: "reeds genooi" is iets wat die
    // admin kan regstel, anders as 'n interne databasisfout.
    return {
      ok: false,
      fout: error.message.toLowerCase().includes("already")
        ? "Daardie adres is reeds 'n gebruiker."
        : "Kon nie die uitnodiging stuur nie. Kyk die adres en probeer weer.",
    };
  }

  // Die sneller het intussen 'n profiel met rol 'kerkraad' geskep; stel die
  // gekose rol.
  if (data.user) {
    const { error: rolFout } = await admin
      .from("profiles")
      .update({ rol })
      .eq("id", data.user.id);
    if (rolFout) console.error("[nooiGebruiker/rol]", rolFout.message);
  }

  revalidatePath("/instellings");
  return { ok: true };
}

/**
 * Stuur 'n wagwoordherstel-skakel.
 *
 * Dieselfde vloei as "Wagwoord vergeet?" op die aanteken-bladsy, maar deur 'n
 * admin begin — vir wanneer iemand bel en sê hulle kan nie inkom nie.
 */
export async function stuurWagwoordHerstel(epos: string): Promise<AksieUitslag> {
  const sessie = await kliëntOfNiks();
  if (!sessie) return GEEN_SESSIE;

  if (sessie.gebruiker.rol !== "admin") {
    return { ok: false, fout: "Net 'n admin kan wagwoorde herstel." };
  }

  const { error } = await sessie.supabase.auth.resetPasswordForEmail(
    epos.trim().toLowerCase(),
    { redirectTo: `${werfURL()}/wagwoord-nuut` },
  );

  if (error) {
    console.error("[stuurWagwoordHerstel]", error.message);
    return { ok: false, fout: "Kon nie die skakel stuur nie. Probeer weer." };
  }

  return { ok: true };
}

/**
 * Die werf se eie URL, vir die skakel in die e-pos.
 *
 * Vercel stel `VERCEL_PROJECT_PRODUCTION_URL` (sonder skema). Plaaslik val ons
 * terug op localhost sodat 'n toets-uitnodiging na die dev-bediener wys.
 */
function werfURL() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return process.env.NEXT_PUBLIC_WERF_URL ?? "http://localhost:3000";
}
