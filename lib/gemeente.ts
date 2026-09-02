/**
 * Die gemeente se publieke inligting.
 *
 * Alles hier verskyn op die openbare webwerf. Dit is doelbewus 'n aparte
 * module van `lib/mock/`: dié data is nie spotdata nie, dit is die egte
 * gemeente se besonderhede, en dit bly ná Supabase — dit skuif net later na
 * 'n `content`-tabel toe sodat die kerkkantoor dit self kan wysig.
 *
 * ⚠ NIKS PERSOONLIK NIE. Geen lidmaatname, geen verjaarsdae, geen adresse van
 * gesinne. Sien CLAUDE.md § Auth & access: die publieke werf lees nooit PII nie.
 *
 * BEVESTIG VOOR PUBLIKASIE — die items hieronder gemerk met [AANNAME] is nie
 * aanlyn gepubliseer nie en is redelike plekhouers. Die kerkkantoor moet dit
 * nagaan.
 */

export const GEMEENTE = {
  naam: "NG Moedergemeente Vanderbijlpark",
  kortNaam: "NG Moedergemeente",
  /** Bevestig: Wikipedia + Gemeentegeskiedenisargief. */
  gestig: 1949,
  sinode: "Goudland",
  ring: "Vanderbijlpark",
  adres: {
    straat: "H/v Faraday & Pasteur Boulevard",
    dorp: "Vanderbijlpark",
    provinsie: "Gauteng",
    poskode: "1911",
  },
  /** [AANNAME] — nie aanlyn gepubliseer nie. Kry die egte besonderhede. */
  kontak: {
    telefoon: null as string | null,
    epos: null as string | null,
    facebook:
      "https://www.facebook.com/p/NG-Moedergemeente-Vanderbijlpark-100005506905527/",
  },
} as const;

/**
 * Die oggenddiens (Sondag 08:15, in die kerkgebou) is BEVESTIG.
 *
 * Die Woensdag-Bybelstudie is nog [AANNAME] — die kerkkantoor moet die tyd en
 * of dit hoegenaamd bestaan bevestig voordat die werf oopgaan.
 */
export const EREDIENSTE = [
  {
    dag: "Sondag",
    tyd: "08:15",
    naam: "Oggenddiens",
    plek: "Kerkgebou, h/v Faraday & Pasteur Boulevard",
    beskrywing: "Ons hoofdiens, met kindertyd en nagmaal op die eerste Sondag.",
  },
  {
    dag: "Woensdag",
    tyd: "19:00",
    naam: "Bybelstudie",
    plek: null,
    beskrywing: "Gesprek rondom die Woord, vir almal wat dieper wil delf.",
  },
] as const;

/**
 * Bevestigde geskiedenis. Elke feit hier kom uit 'n bron — moenie items
 * byvoeg wat nie nageslaan is nie.
 */
export const GESKIEDENIS = [
  {
    jaar: "1949",
    titel: "Die gemeente word gestig",
    teks:
      "Die gemeente ontstaan uit die De Deur-gemeente, in dieselfde jaar as die " +
      "dorp self. Met stigting bestaan dit uit 40 wyke, met agt Sondagskole, " +
      "52 onderwysers en 533 kinders.",
  },
  {
    jaar: "1950's",
    titel: "'n Dorp wat vinnig groei",
    teks:
      "Binne agt jaar groei die bevolking tot sowat 12 000 — meer as wat een " +
      "gemeente kon bedien. Uit hierdie groei kom die dogtergemeentes wat " +
      "vandag oor Vanderbijlpark versprei is.",
  },
  {
    jaar: "1960",
    titel: "Die hoeksteen word gelê",
    teks:
      "Ds. P.J. Pretorius lê die hoeksteen van die kerkgebou op 15 Oktober 1960, " +
      "op die hoek van Faraday en Pasteur Boulevard, waar ons vandag nog " +
      "saamkom.",
  },
  {
    jaar: "2014",
    titel: "Ds. Louis Ries word bevestig",
    teks:
      "Ná 'n tydperk waarin die gemeente vakant was, word ds. Louis Koenradt " +
      "Ries op 21 Junie 2014 as leraar bevestig.",
  },
] as const;

/**
 * Bediening-areas. [AANNAME] — die name is tipies vir 'n NG gemeente, maar
 * bevestig watter hiervan werklik by dié gemeente bestaan.
 */
export const BEDIENINGS = [
  {
    naam: "Kategese",
    beskrywing:
      "Sondagskool vir kinders van graad R tot matriek, elke Sondagoggend " +
      "tydens die diens.",
  },
  {
    naam: "Jeug",
    beskrywing:
      "'n Tuiste vir hoërskoolleerders — byeenkomste, kampe en gesprek oor " +
      "die dinge wat saak maak.",
  },
  {
    naam: "Vroue- en mansbediening",
    beskrywing:
      "Groepe wat mekaar dra, saam dien en die gemeente se omgee-werk vorm.",
  },
  {
    naam: "Barmhartigheid",
    beskrywing:
      "Ons uitreik na die gemeenskap: kospakkies, besoeke en hulp waar die " +
      "nood die grootste is.",
  },
  {
    naam: "Seniors",
    beskrywing:
      "Byeenkomste, tuisbesoeke en vervoer vir ons ouer lidmate — niemand " +
      "hoef alleen te wees nie.",
  },
  {
    naam: "Musiek en sang",
    beskrywing:
      "Die koor en begeleiers wat elke erediens se sang dra.",
  },
] as const;
