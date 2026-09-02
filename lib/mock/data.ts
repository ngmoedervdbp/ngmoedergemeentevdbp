import type {
  Dokument,
  Family,
  Gebeurtenis,
  KategeseGroep,
  Lid,
  Registrasie,
  Wyk,
} from "./tipes";

/**
 * SPOTDATA — nie 'n databasis nie.
 *
 * Die wyknommers, van-name en die vorm van die data kom uit die werklike
 * Base44-skermkiekies in `docs/`. Die volume is opgeblaas (48 lede eerder as
 * 17) sodat lyste, kaarte en grafieke realisties lyk terwyl ons bou.
 *
 * Alles hier verdwyn sodra Supabase gekoppel is. Moenie logika hierop bou wat
 * nie ewe goed teen 'n werklike navraag werk nie.
 */

export const WYKE: Wyk[] = [
  { id: "w1", nommer: "1", naam: "Wyk 1", ouderling: "Anna Smith", kapasiteit: 70 },
  { id: "w8", nommer: "8", naam: "Wyk 8", ouderling: "Elize van Deventer", kapasiteit: 50 },
  { id: "w15", nommer: "15", naam: "Wyk 15", ouderling: "Bennie Bierman", kapasiteit: 50 },
  { id: "w30a", nommer: "30 A", naam: "Wyk 30 A", ouderling: null, kapasiteit: 50 },
  { id: "w33", nommer: "33", naam: "Wyk 33", ouderling: "Hans Kruger", kapasiteit: 50 },
  { id: "w35", nommer: "35", naam: "Wyk 35", ouderling: null, kapasiteit: 50 },
  { id: "w36", nommer: "36", naam: "Wyk 36", ouderling: "Piet Els", kapasiteit: 60 },
  { id: "w38a", nommer: "38 A", naam: "Wyk 38 A", ouderling: "Daleen Haasbroek", kapasiteit: 50 },
];

export const FAMILIES: Family[] = [
  { id: "f1", naam: "Ries", adres: "8 Toselli Straat", stad: "Vanderbijlpark", wyk_id: "w33" },
  { id: "f2", naam: "Haasbroek", adres: "29 Friedman Straat, Mantevrede", stad: "Vanderbijlpark", wyk_id: "w38a" },
  { id: "f3", naam: "Bierman", adres: "170 Faraday Boulevard", stad: "Vanderbijlpark", wyk_id: "w15" },
  { id: "f4", naam: "Du Toit", adres: "1 Vlamboom SE3", stad: "Vanderbijlpark", wyk_id: "w36" },
  { id: "f5", naam: "Van Loggerenberg", adres: "42 Rembrandt Straat", stad: "Vanderbijlpark", wyk_id: "w33" },
  { id: "f6", naam: "Senekal", adres: "7 Hertzog Laan", stad: "Vanderbijlpark", wyk_id: "w30a" },
  { id: "f7", naam: "Nagel", adres: "115 Kruger Straat", stad: "Vanderbijlpark", wyk_id: "w8" },
  { id: "f8", naam: "Van Deventer", adres: "3 Pasteur Boulevard", stad: "Vanderbijlpark", wyk_id: "w8" },
  { id: "f9", naam: "Kruger", adres: "56 Generaal Hertzog", stad: "Vanderbijlpark", wyk_id: "w33" },
  { id: "f10", naam: "Els", adres: "21 Barrage Weg", stad: "Vanderbijlpark", wyk_id: "w36" },
  { id: "f11", naam: "Smith", adres: "9 Klipspringer Straat", stad: "Vanderbijlpark", wyk_id: "w1" },
  { id: "f12", naam: "Botha", adres: "88 Faraday Boulevard", stad: "Vanderbijlpark", wyk_id: "w15" },
  { id: "f13", naam: "Venter", adres: "14 Protea Singel", stad: "Vanderbijlpark", wyk_id: "w35" },
  { id: "f14", naam: "Coetzee", adres: "31 Akasia Straat", stad: "Vanderbijlpark", wyk_id: "w38a" },
  { id: "f15", naam: "Pretorius", adres: "5 Olienhout Rylaan", stad: "Vanderbijlpark", wyk_id: "w1" },
  { id: "f16", naam: "Nel", adres: "77 Sering Straat", stad: "Vanderbijlpark", wyk_id: "w30a" },
  { id: "f17", naam: "Van Wyk", adres: "12 Kremetart Straat", stad: "Vanderbijlpark", wyk_id: "w15" },
  { id: "f18", naam: "Steyn", adres: "40 Wilger Laan", stad: "Vanderbijlpark", wyk_id: "w36" },
];

type Rou = [
  string, string, string, string | null, "manlik" | "vroulik",
  Lid["status"], Lid["tipe"], string | null, string | null,
  string | null, string | null, Lid["family_role"] | null, string,
];

/* id, naam, van, geboortedatum, geslag, status, tipe, selfoon, epos, wyk, family, rol, lid_sedert */
const ROU: Rou[] = [
  ["l1","Louis Koenradt","Ries","1988-07-12","manlik","aktief","belydend","0649074476","rieslouis@gmail.com","w33","f1","man","2014-07-01"],
  ["l2","Nicolaine","Ries",null,"vroulik","aktief","belydend","0793439562",null,"w33","f1","vrou","2014-07-01"],
  ["l3","Deondre","Ries","2024-02-18","manlik","aktief","doop",null,null,"w33","f1","kind","2024-02-20"],
  ["l4","Luan","Ries","2018-03-26","manlik","aktief","doop",null,null,"w33","f1","kind","2018-04-02"],
  ["l5","Arno","Haasbroek","1971-11-10","manlik","aktief","belydend","0832947365","arno.haas24@gmail.com","w38a","f2","man","2025-09-11"],
  ["l6","Daleen","Haasbroek","1971-07-22","vroulik","aktief","belydend","0845035765","daleen.haasbroek@sasol.com","w38a","f2","vrou","2025-10-05"],
  ["l7","Bennie","Bierman","1965-01-05","manlik","aktief","belydend","0760529714","benniebierman00@gmail.com","w15","f3","man","2025-11-13"],
  ["l8","Suzette","Bierman","1957-11-19","vroulik","aktief","belydend","0721081312","sbierman@live.co.za","w15","f3","vrou","2025-11-21"],
  ["l9","Wybrand","Du Toit",null,"manlik","aktief","belydend","0823357642",null,"w36","f4","man","2025-12-02"],
  ["l10","Zona","Du Toit",null,"vroulik","aktief","belydend","0832100750","mareezona@gmail.com","w36","f4","vrou","2026-01-03"],
  ["l11","Andrew","Van Loggerenberg","1970-04-22","manlik","aktief","belydend","0833386156",null,"w33","f5","man","2026-01-27"],
  ["l12","Nola","Van Loggerenberg","1959-01-30","vroulik","aktief","belydend","0833386156",null,"w35","f5","vrou","2026-01-18"],
  ["l13","Wilmarie","Senekal","1993-06-24","vroulik","aktief","belydend","0729679767",null,"w30a","f6","vrou","2026-02-04"],
  ["l14","Ronel","Nagel","1954-07-23","vroulik","onaktief","belydend","0825501627","jmpnagel@gmail.com","w8","f7","vrou","2026-02-12"],
  ["l15","Elize","van Deventer","1951-12-02","vroulik","aktief","belydend","0732225347",null,"w8","f8","vrou","2026-02-19"],
  ["l16","Anna","Smith","1937-05-11","vroulik","aktief","belydend",null,null,"w1","f11","vrou","2026-02-02"],
  ["l17","Koos","Koos",null,"manlik","onaktief","belydend",null,null,null,null,null,"2026-03-17"],
  ["l18","Hans","Kruger","1962-09-14","manlik","aktief","belydend","0824417789","hans.kruger@vodamail.co.za","w33","f9","man","2011-03-06"],
  ["l19","Marlene","Kruger","1964-05-30","vroulik","aktief","belydend","0824417790",null,"w33","f9","vrou","2011-03-06"],
  ["l20","Piet","Els","1958-02-11","manlik","aktief","belydend","0836654421","piet.els@gmail.com","w36","f10","man","2009-08-16"],
  ["l21","Marietjie","Els","1960-10-03","vroulik","aktief","belydend","0836654422",null,"w36","f10","vrou","2009-08-16"],
  ["l22","Johan","Botha","1979-04-18","manlik","aktief","belydend","0828841203","jbotha@outlook.com","w15","f12","man","2019-02-10"],
  ["l23","Carien","Botha","1981-12-07","vroulik","aktief","belydend","0828841204","carien.botha@gmail.com","w15","f12","vrou","2019-02-10"],
  ["l24","Ruan","Botha","2011-06-21","manlik","aktief","doop",null,null,"w15","f12","kind","2011-08-14"],
  ["l25","Mia","Botha","2014-09-09","vroulik","aktief","doop",null,null,"w15","f12","kind","2014-11-02"],
  ["l26","Dirk","Venter","1949-03-25","manlik","aktief","belydend","0729911456",null,"w35","f13","man","2003-05-11"],
  ["l27","Hester","Venter","1952-08-02","vroulik","aktief","belydend","0729911457",null,"w35","f13","vrou","2003-05-11"],
  ["l28","Willem","Coetzee","1986-01-17","manlik","aktief","belydend","0845572310","wcoetzee@gmail.com","w38a","f14","man","2026-04-12"],
  ["l29","Lize","Coetzee","1988-11-28","vroulik","aktief","belydend","0845572311",null,"w38a","f14","vrou","2026-04-12"],
  ["l30","Jana","Coetzee","2016-04-04","vroulik","aktief","doop",null,null,"w38a","f14","kind","2026-05-08"],
  ["l31","Kobus","Pretorius","1943-11-06","manlik","aktief","belydend","0721145098",null,"w1","f15","man","1998-02-15"],
  ["l32","Sannie","Pretorius","1946-06-19","vroulik","aktief","belydend",null,null,"w1","f15","vrou","1998-02-15"],
  ["l33","Riaan","Nel","1975-07-30","manlik","aktief","belydend","0833390012","riaan.nel@telkomsa.net","w30a","f16","man","2026-06-15"],
  ["l34","Elmarie","Nel","1977-02-14","vroulik","aktief","belydend","0833390013",null,"w30a","f16","vrou","2026-06-15"],
  ["l35","Danie","Nel","2009-10-12","manlik","aktief","doop",null,null,"w30a","f16","kind","2010-01-10"],
  ["l36","Pieter","Van Wyk","1968-05-08","manlik","aktief","belydend","0827764511","pvwyk@gmail.com","w15","f17","man","2013-04-07"],
  ["l37","Annelie","Van Wyk","1970-09-21","vroulik","aktief","belydend","0827764512",null,"w15","f17","vrou","2013-04-07"],
  ["l38","Frikkie","Steyn","1955-12-30","manlik","aktief","belydend","0731129087",null,"w36","f18","man","2007-06-17"],
  ["l39","Rina","Steyn","1957-03-16","vroulik","aktief","belydend","0731129088",null,"w36","f18","vrou","2007-06-17"],
  ["l40","Christo","Venter","1994-08-27","manlik","aktief","belydend","0716648220","christo.v@gmail.com","w35","f13","kind","2026-08-19"],
  ["l41","Susan","Pretorius","1972-01-09","vroulik","oorgeplaas","belydend","0724458190",null,"w1","f15","kind","2005-03-20"],
  ["l42","Gerhard","Smith","1934-04-02","manlik","oorlede","belydend",null,null,"w1","f11","man","1995-01-15"],
  ["l43","Marie","Nel","1930-07-11","vroulik","oorlede","belydend",null,null,"w30a","f16",null,"1994-02-20"],
  ["l44","Tinus","Coetzee","1998-06-15","manlik","onaktief","belydend","0847712009",null,"w38a","f14","kind","2026-08-03"],
  ["l45","Karel","Van Deventer","1948-09-29","manlik","aktief","belydend","0732225348",null,"w8","f8","man","2026-03-07"],
  ["l46","Liesl","Steyn","2007-02-26","vroulik","aktief","doop",null,null,"w36","f18","kind","2007-05-13"],
  ["l47","Jaco","Van Wyk","2005-11-19","manlik","aktief","belydend","0813348871",null,"w15","f17","kind","2026-07-21"],
  ["l48","Amelia","Bierman","2019-08-08","vroulik","aktief","doop",null,null,"w15","f3","kind","2019-10-06"],
];

export const LEDE: Lid[] = ROU.map(
  ([id, first_name, last_name, dob, geslag, status, tipe, selfoon, epos, wyk_id, family_id, family_role, lid_sedert]) => ({
    id,
    first_name,
    last_name,
    date_of_birth: dob,
    geslag,
    status,
    tipe,
    selfoon,
    epos,
    wyk_id,
    family_id,
    family_role,
    lid_sedert,
    aantekeninge: null,
    foto: null,
  }),
);

export const GEBEURTENISSE: Gebeurtenis[] = [
  { id: "g11", titel: "Oggenddiens", datum: "2026-08-23", tyd: "08:15", plek: "Kerkgebou", kategorie: "algemeen", beskrywing: null },
  { id: "g12", titel: "Bybelstudie", datum: "2026-08-27", tyd: "19:00", plek: "Konsistorie", kategorie: "algemeen", beskrywing: "Wekelikse Bybelstudie." },
  { id: "g13", titel: "Jeugaand", datum: "2026-08-28", tyd: "18:30", plek: "Jeuglokaal", kategorie: "jeug", beskrywing: null },
  { id: "g14", titel: "Gemeente-ete", datum: "2026-08-29", tyd: "12:00", plek: "Kerksaal", kategorie: "spesiaal", beskrywing: "Bring-en-deel middagete." },
  { id: "g15", titel: "Oggenddiens", datum: "2026-08-30", tyd: "08:15", plek: "Kerkgebou", kategorie: "algemeen", beskrywing: null },
  { id: "g16", titel: "Seniors se Koffie-oggend", datum: "2026-08-25", tyd: "10:00", plek: "Kerksaal", kategorie: "seniors", beskrywing: null },
  { id: "g1", titel: "Oggenddiens", datum: "2026-09-06", tyd: "08:15", plek: "Kerkgebou", kategorie: "algemeen", beskrywing: "Wekelikse erediens." },
  { id: "g2", titel: "Jeugkamp Vrystaat", datum: "2026-09-11", tyd: "16:00", plek: "Clarens", kategorie: "jeug", beskrywing: "Naweekkamp vir hoërskoolgroep." },
  { id: "g3", titel: "Seniors se Tee", datum: "2026-09-16", tyd: "10:00", plek: "Kerksaal", kategorie: "seniors", beskrywing: null },
  { id: "g4", titel: "Kerkraadsvergadering", datum: "2026-09-18", tyd: "18:30", plek: "Konsistorie", kategorie: "algemeen", beskrywing: null },
  { id: "g5", titel: "Basaar", datum: "2026-09-26", tyd: "08:00", plek: "Kerkterrein", kategorie: "spesiaal", beskrywing: "Jaarlikse basaar — almal welkom." },
  { id: "g7", titel: "Kategese hervat", datum: "2026-09-13", tyd: "08:00", plek: "Kategeselokale", kategorie: "jeug", beskrywing: null },
  { id: "g8", titel: "Nagmaal", datum: "2026-09-20", tyd: "09:00", plek: "Kerkgebou", kategorie: "spesiaal", beskrywing: null },
  { id: "g9", titel: "Bybelstudie", datum: "2026-09-24", tyd: "19:00", plek: "Konsistorie", kategorie: "algemeen", beskrywing: null },
  { id: "g10", titel: "Seniors Uitstappie", datum: "2026-10-02", tyd: "09:00", plek: "Vertrek by kerk", kategorie: "seniors", beskrywing: null },
];

export const KATEGESE_GROEPE: KategeseGroep[] = [
  { id: "k1", naam: "Kleuters", ouderdomsgroep: "3 – 5 jaar", onderwyser: "Lize Coetzee", lokaal: "Lokaal 1", dag: "Sondag", tyd: "08:00", lid_ids: ["l3", "l48"] },
  { id: "k2", naam: "Graad 1 – 3", ouderdomsgroep: "6 – 9 jaar", onderwyser: "Carien Botha", lokaal: "Lokaal 2", dag: "Sondag", tyd: "08:00", lid_ids: ["l4", "l30"] },
  { id: "k3", naam: "Graad 4 – 7", ouderdomsgroep: "10 – 13 jaar", onderwyser: "Elmarie Nel", lokaal: "Lokaal 3", dag: "Sondag", tyd: "08:00", lid_ids: ["l24", "l25", "l35"] },
  { id: "k4", naam: "Belydenisklas", ouderdomsgroep: "16 – 18 jaar", onderwyser: "Ds. Marius van Zyl", lokaal: "Konsistorie", dag: "Vrydag", tyd: "18:00", lid_ids: ["l46"] },
];

export const DOKUMENTE: Dokument[] = [
  { id: "d1", titel: "Lidmaatskapvorm", beskrywing: "Amptelike lidmaatskapvorm", sleutel: "lidmaatskapvorm", lêernaam: "lidmaatskapvorm-2026.pdf", grootte: "248 KB", opgelaai: "2026-02-14" },
  { id: "d2", titel: "Kerk se Grondwet", beskrywing: "Die gemeente se grondwet en reëls", sleutel: "grondwet", lêernaam: "grondwet.pdf", grootte: "1,2 MB", opgelaai: "2025-11-03" },
  { id: "d3", titel: "Bankbesonderhede", beskrywing: "Bankbesonderhede vir bydraes en tiendes", sleutel: "bankbesonderhede", lêernaam: null, grootte: null, opgelaai: null },
  { id: "d4", titel: "Welkombrief", beskrywing: "Welkombrief aan nuwe lidmate", sleutel: "welkombrief", lêernaam: "welkombrief.pdf", grootte: "96 KB", opgelaai: "2026-01-20" },
  { id: "d5", titel: "Basaar 2026 — Program", beskrywing: "Volledige program en stalletjie-uitleg", sleutel: null, lêernaam: "basaar-program.pdf", grootte: "512 KB", opgelaai: "2026-08-01" },
  { id: "d6", titel: "Kategese Jaarplan", beskrywing: "Temas en datums vir die jaar", sleutel: null, lêernaam: "kategese-jaarplan.pdf", grootte: "180 KB", opgelaai: "2026-01-11" },
];

export const REGISTRASIES: Registrasie[] = [
  {
    id: "r1",
    first_name: "Marius",
    last_name: "Joubert",
    date_of_birth: "1981-04-12",
    geslag: "manlik",
    huwelikstatus: "getroud",
    selfoon: "082 774 1190",
    epos: "mjoubert@gmail.com",
    adres: "18 Kiepersolstraat, Vanderbijlpark",
    aantekeninge: "Ons het pas ingetrek en soek 'n gemeente naby die huis.",
    status: "wagtend",
    ontvang: "2026-08-24",
  },
  {
    id: "r2",
    first_name: "Antoinette",
    last_name: "De Beer",
    date_of_birth: "1955-11-03",
    geslag: "vroulik",
    huwelikstatus: "weduwee_wewenaar",
    selfoon: "071 445 8820",
    epos: null,
    adres: "6 Rooikranslaan, Vanderbijlpark",
    aantekeninge: null,
    status: "wagtend",
    ontvang: "2026-08-26",
  },
  {
    id: "r3",
    first_name: "Kobus",
    last_name: "Nel",
    date_of_birth: null,
    geslag: "manlik",
    huwelikstatus: "ongetroud",
    selfoon: "083 220 7714",
    epos: "kobus.nel@voorbeeld.co.za",
    adres: null,
    aantekeninge: null,
    status: "goedgekeur",
    ontvang: "2026-08-19",
  },
];
