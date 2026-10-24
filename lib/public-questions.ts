import { EREDIENSTE, GEMEENTE } from "@/lib/gemeente";

/** Public visitor guidance only. These are suggested questions, not search-volume data. */
export const PUBLIC_QUESTION_GROUPS = [
  {
    id: "eerste-besoek",
    title: "Jou eerste Sondag",
    questions: [
      {
        id: "dienstye",
        question: "Hoe laat begin die kerk op Sondag?",
        answer: `Ons oggenddiens begin Sondae om ${EREDIENSTE[0].tyd} by NG Moedergemeente Vanderbijlpark. Kyk voor jou besoek na die jongste aankondigings op ons Facebook-blad, veral tydens vakansies of spesiale geleenthede.`,
        href: "/eredienste",
        linkLabel: "Sien die eredienstye",
      },
      {
        id: "afrikaans",
        question: "Waar kry ek 'n Afrikaanse NG kerk in Vanderbijlpark?",
        answer: `NG Moedergemeente is 'n Afrikaanse NG gemeente by ${GEMEENTE.adres.straat}, ${GEMEENTE.adres.dorp}. Ons is deel van die Ring van Vanderbijlpark en Sinode Goudland. Jy is welkom om 'n erediens te besoek voordat jy besluit om in te skakel.`,
        href: "/kontak",
        linkLabel: "Kry die adres en kaart",
      },
      {
        id: "alleen",
        question: "Kan ek alleen kerk toe kom as ek niemand ken nie?",
        answer: "Ja. Jy hoef nie saam met 'n lidmaat te kom of vooraf te registreer nie. Kom gerus in en vra iemand by die deur om jou te wys waar om te sit. Jy hoef nie die eerste Sondag te besluit of jy wil aansluit nie.",
        href: "/nuut-hier",
        linkLabel: "Beplan jou eerste besoek",
      },
      {
        id: "klere",
        question: "Wat trek ek aan en wat bring ek saam kerk toe?",
        answer: "Kom soos jy is en dra iets waarin jy gemaklik voel. Jy hoef niks spesiaals te koop of voor te berei om die erediens te besoek nie. As jy graag jou eie Bybel gebruik, kan jy dit saambring.",
        href: "/nuut-hier#op-sondag",
        linkLabel: "Lees wat om te verwag",
      },
      {
        id: "vaal",
        question: "Kan ek kom kuier as ek elders in die Vaal woon?",
        answer: "Ja. Jy hoef nie in 'n bepaalde woonbuurt te woon om 'n erediens te besoek nie. Ons kerkgebou is in Vanderbijlpark in die Vaaldriehoek. Gebruik die kaart op die kontakblad om jou roete vanaf jou eie vertrekpunt te beplan.",
        href: "/kontak",
        linkLabel: "Beplan jou roete na die kerk",
      },
    ],
  },
  {
    id: "bybel-en-geloof",
    title: "Bybelstudie en saam glo",
    questions: [
      {
        id: "bybelstudie-tyd",
        question: "Wanneer is daar Bybelstudie in Vanderbijlpark?",
        answer: `Ons Bybelstudie is Donderdae om ${EREDIENSTE[1].tyd}. Die byeenkoms is 'n gesprek rondom die Woord. Bevestig die ontmoetingsplek en enige verandering aan die week se reëlings met die kerkkantoor voordat jy die eerste keer kom.`,
        href: "/bybelstudie",
        linkLabel: "Lees oor ons Bybelstudie",
      },
      {
        id: "bybelstudie-beginners",
        question: "Kan ek Bybelstudie bywoon as ek 'n beginner is?",
        answer: "Ons beskryf die Bybelstudie as 'n gesprek vir almal wat dieper wil delf. Jy hoef nie reeds al die antwoorde te hê nie. Vra die kerkkantoor hoe om by die huidige gesprek aan te sluit en of daar 'n Bybelgedeelte is wat jy vooraf kan lees.",
        href: "/bybelstudie#begin",
        linkLabel: "Begin met Bybelstudie",
      },
      {
        id: "nagmaal",
        question: "Wanneer is dit nagmaal by die gemeente?",
        answer: "Die gewone diensprogram sluit nagmaal op die eerste Sondag in. Bevestig die betrokke Sondag se reëlings in die gemeente se jongste aankondigings. As jy oor deelname wonder, bespreek dit vooraf met die kerkkantoor of leraar.",
        href: "/eredienste",
        linkLabel: "Sien die diensprogram",
      },
    ],
  },
  {
    id: "kinders-en-jeug",
    title: "Kinders, Sondagskool en jeug",
    questions: [
      {
        id: "kinders-saam",
        question: "Kan my kinders saam kerk toe kom?",
        answer: "Ja. Kinders is welkom in die oggenddiens en daar is kindertyd tydens die diens. Jy kan dus as gesin 'n Sondag kom kuier sonder om eers lidmaatskap te reël. Vra by die deur as jy onseker is oor waar julle kan sit.",
        href: "/nuut-hier#kinders",
        linkLabel: "Lees oor 'n besoek met kinders",
      },
      {
        id: "sondagskool",
        question: "Hoe vind ek uit oor Sondagskool of kategese?",
        answer: "Vra die kerkkantoor oor die huidige kategesegroepe, ouderdomsindeling en inskrywing. Bevestig ook waar en wanneer die kinders bymekaarkom, en wat tydens skoolvakansies gebeur. Dit help om jou kind se ouderdom of skoolgraad te noem wanneer julle die reëlings bespreek.",
        href: "/bedienings#kategese",
        linkLabel: "Verken kategese en bedienings",
      },
      {
        id: "jeug",
        question: "Met wie praat ek oor jeugaktiwiteite vir my tiener?",
        answer: "Kontak die kerkkantoor oor jeuginskakeling en die huidige program. Vra watter ouderdomme ingesluit word, wie die kontakpersoon is en of 'n byeenkoms reeds op die gemeentekalender verskyn. Bevestig die volgende byeenkoms se tyd en plek voordat jou tiener aansluit.",
        href: "/bedienings#jeug",
        linkLabel: "Vind uit oor jeuginskakeling",
      },
    ],
  },
  {
    id: "lidmaatskap",
    title: "'n Nuwe kerktuiste",
    questions: [
      {
        id: "aansluit",
        question: "Hoe word ek 'n lidmaat van NG Moedergemeente?",
        answer: "Vul die openbare registrasievorm in om jou besonderhede by die kerkkantoor te laat. Die kantoor hersien die inskrywing en tree met jou in verbinding. Die vorm skep nie 'n aanlyn lidmaatrekening nie, en jy hoef nie vir goedkeuring te wag voordat jy 'n erediens besoek nie.",
        href: "/registreer",
        linkLabel: "Laat jou besonderhede",
      },
      {
        id: "attestaat",
        question: "Ek het verhuis. Hoe skuif ek my attestaat of lidmaatskap?",
        answer: "Laat die kerkkantoor weet dat jy van 'n ander gemeente af kom en vra hoe hulle die oordrag hanteer. Hou die vorige gemeente se naam en kontakbesonderhede gereed vir daardie gesprek. Die kantoor moet bevestig watter dokumente of verdere inligting hulle benodig.",
        href: "/kontak",
        linkLabel: "Kontak oor lidmaatskapoordrag",
      },
      {
        id: "terug-kerk",
        question: "Ek was lanklaas in die kerk. Kan ek weer begin kom?",
        answer: "Ja. Jy kan eenvoudig 'n erediens kom bywoon. Jy hoef nie eers 'n verduideliking te gee of jou registrasie af te handel nie. As jy graag oor terugkeer of inskakeling wil praat, kan jy die kerkkantoor kontak wanneer jy gereed voel.",
        href: "/nuut-hier",
        linkLabel: "Kom kuier op jou eie pas",
      },
      {
        id: "help",
        question: "Hoe kan ek by die gemeente help of betrokke raak?",
        answer: "Lees deur die bedienings en gesels met die kerkkantoor oor waar jy graag wil inskakel. Noem jou belangstellings, vaardighede en wanneer jy beskikbaar is. Die kantoor kan die huidige behoeftes en die regte kontakpersoon met jou bespreek.",
        href: "/bedienings",
        linkLabel: "Verken maniere om in te skakel",
      },
    ],
  },
  {
    id: "lewensmomente",
    title: "Doop, troues en moeilike tye",
    questions: [
      {
        id: "doop",
        question: "Met wie praat ek as ek my kind wil laat doop?",
        answer: "Kontak die kerkkantoor om oor doop en doopvoorbereiding te gesels. Vra oor die gesprek met die leraar, moontlike datums en watter besonderhede nodig is. Die kantoor kan die huidige vereistes en beskikbare doopdatums met jou bespreek voordat julle reëlings vasmaak.",
        href: "/kontak",
        linkLabel: "Vra die kerkkantoor oor doop",
      },
      {
        id: "troue",
        question: "Hoe doen ek navraag oor 'n kerktroue of huweliksvoorbereiding?",
        answer: "Vra die kerkkantoor of hulle met julle versoek kan help en watter reëlings geld. Noem die beoogde datum en vra afsonderlik oor die leraar, kerkgebou, voorbereiding en enige koste. Laat die kantoor beskikbaarheid en tariewe bevestig voordat julle verdere besprekings maak.",
        href: "/kontak",
        linkLabel: "Doen navraag oor 'n troue",
      },
      {
        id: "rou",
        question: "Hoe kontak ek die kerk oor rou of 'n begrafnis?",
        answer: "Gebruik die kontakblad om die kerkkantoor te nader en vra met wie jy oor die familie se versoek kan praat. Bespreek die gewenste datum, die leraar en die diensreëlings direk met die kantoor. Vra wie die familie se kontakpersoon sal wees en laat beskikbaarheid en enige koste bevestig voordat reëlings vasgemaak word.",
        href: "/kontak",
        linkLabel: "Kry die gemeente se kontakroete",
      },
      {
        id: "dominee",
        question: "Kan ek vra om met 'n dominee te praat of vir gebed vra?",
        answer: "Jy kan die kerkkantoor nader om te vra oor 'n gesprek, gebedsversoek of pastorale besoek. Reël die gepaste kontakpersoon en beskikbare tyd direk met hulle. Hou persoonlike besonderhede vir die direkte gesprek eerder as om dit in 'n openbare Facebook-kommentaar te plaas.",
        href: "/kontak",
        linkLabel: "Doen navraag oor 'n gesprek",
      },
    ],
  },
  {
    id: "nuus-en-aanlyn",
    title: "Nuus, preke en die kalender",
    questions: [
      {
        id: "preke",
        question: "Waar kry ek preke, 'n aanlyn erediens of die jongste kerknuus?",
        answer: "Ons Facebook-blad is die gepubliseerde kanaal vir nuus, foto's en veranderinge aan dienstye. Kyk daar vir enige gedeelde boodskappe of opnames. Hierdie webwerf bied tans nie 'n bevestigde preekargief of vaste regstreekse uitsaaidiens nie.",
        href: GEMEENTE.kontak.facebook,
        linkLabel: "Besoek die gemeente se Facebook-blad",
      },
      {
        id: "kalender",
        question: "Waar sien ek kerkbyeenkomste en spesiale geleenthede?",
        answer: "Die gemeentekalender wys die komende openbare byeenkomste wat op die webwerf beskikbaar is. Kyk na die datum, tyd en plek by die betrokke inskrywing en bevestig enige laaste veranderinge op Facebook. As 'n geleentheid nog nie gelys is nie, vra die kerkkantoor daaroor.",
        href: "/kalender-gemeente",
        linkLabel: "Maak die gemeentekalender oop",
      },
    ],
  },
] as const;
