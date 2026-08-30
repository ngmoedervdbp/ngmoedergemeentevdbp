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
const PUBLIEKE_ROETES = ["/registreer", "/teken-in", "/wagwoord-herstel"];

function isPubliek(pathname: string) {
  return PUBLIEKE_ROETES.some(
    (roete) => pathname === roete || pathname.startsWith(`${roete}/`),
  );
}

let gewaarsku = false;

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    // 'n Ontbrekende sleutel is normaalweg 'n foutiewe ontplooiing, nie 'n rede
    // om die app onbeskermd te laat loop nie — behalwe wanneer ons doelbewus 'n
    // demo op spotdata wys.
    //
    // Dit moet 'n EKSPLISIETE keuse wees. Ons het probeer om dit af te lei uit
    // VERCEL_ENV (voorskou = demo), maar die demo loop op die produksie-
    // ontplooiing self, so daardie afleiding is verkeerd. 'n Uitdruklike vlag
    // sê presies wat bedoel word en werk ongeag waar dit ontplooi word.
    if (process.env.DEMO_MODUS !== "true") {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY moet gestel wees. " +
          "Stel DEMO_MODUS=true om sonder Supabase op spotdata te loop.",
      );
    }
    // Demo-modus: laat die skil deur sodat die kerkraad die spotdata kan sien.
    //
    // LET WEL: hierdie tak laat die app SONDER verifikasie loop en is publiek
    // bereikbaar. Dit is net veilig solank die app op spotdata staan. Sodra
    // werklike lidmaatdata inkom, moet DEMO_MODUS af wees — anders is dit 'n
    // POPIA-oortreding. Verwyder die tak sodra auth gekoppel is.
    if (!gewaarsku) {
      console.warn(
        "\n   Geen Supabase-omgewingsveranderlikes nie — verifikasie is AFGESKAKEL.\n" +
          "   Kopieer .env.local.example na .env.local om dit aan te skakel.\n",
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
