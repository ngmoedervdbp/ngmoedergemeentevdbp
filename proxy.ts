import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Verfris die Supabase-sessie op elke versoek en beskerm die hele app
 * behalwe die publieke roetes hieronder.
 *
 * Let wel: in Next 16 heet hierdie lêer `proxy.ts` (nie `middleware.ts` nie)
 * en die uitvoer heet `proxy`. Die runtime is altyd Node.js.
 */

/** Die enigste roetes wat sonder 'n sessie bereik kan word. */
const PUBLIEKE_ROETES = [
  // Die openbare webwerf — die gemeenskap se voordeur.
  "/oor-ons",
  "/eredienste",
  "/kalender-gemeente",
  "/bedienings",
  "/kontak",
  // Skryf-alleen registrasie, plus die kerkraad se aanteken-vloei.
  "/registreer",
  "/teken-in",
  "/wagwoord-herstel",
];

function isPubliek(pathname: string) {
  // Die tuisblad is die werf se tuisblad, nie 'n admin-bladsy nie.
  if (pathname === "/") return true;

  return PUBLIEKE_ROETES.some(
    (roete) => pathname === roete || pathname.startsWith(`${roete}/`),
  );
}

let gewaarsku = false;

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    // TYDELIKE AFWYKING — sien CLAUDE.md, "Dev-only auth bypass".
    //
    // Hier het vroeër 'n `throw` gestaan wanneer die Supabase-sleutels ontbreek.
    // Dit is verwyder omdat die app nog HEELTEMAL op spotdata (lib/mock/) loop:
    // 'n ontbrekende sleutel is op hierdie stadium die normale toestand, nie 'n
    // stukkende ontplooiing nie, en die throw het die hele demo 500 laat gee.
    //
    // 'n DEMO_MODUS-vlag is probeer en weer verwyder — die veranderlike het
    // nie die funksie op Vercel bereik nie. Daar is dus GEEN demo-vlag meer
    // nie: die enigste skakelaar is of die Supabase-sleutels gestel is.
    //
    // MOET HERSTEL WORD sodra Supabase gekoppel is. Op daardie punt is 'n
    // ontbrekende sleutel wel 'n foutiewe ontplooiing en moet dit hard faal —
    // anders loop 'n werf met werklike lidmaatdata sonder verifikasie, wat 'n
    // POPIA-oortreding is. Tot dan: hou Vercel se Deployment Protection aan as
    // die skakel nie publiek mag wees nie.
    if (!gewaarsku) {
      console.warn(
        "\n   Geen Supabase-omgewingsveranderlikes nie — verifikasie is AFGESKAKEL.\n" +
          "   Die app loop op spotdata. Herstel die wag sodra auth gekoppel is.\n",
      );
      gewaarsku = true;
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Moet getUser() wees, nie getSession() nie — getSession() lees net die
  // koekie en verifieer nie die token by Supabase nie.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPubliek(pathname)) {
    const herlei = request.nextUrl.clone();
    herlei.pathname = "/teken-in";
    herlei.searchParams.set("volgende", pathname);
    return NextResponse.redirect(herlei);
  }

  if (user && pathname === "/teken-in") {
    const herlei = request.nextUrl.clone();
    herlei.pathname = "/dashboard";
    herlei.search = "";
    return NextResponse.redirect(herlei);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Alles behalwe statiese bates en beeldlêers.
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
