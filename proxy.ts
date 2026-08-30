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
    // In produksie is 'n ontbrekende sleutel 'n foutiewe ontplooiing, nie 'n
    // rede om die app onbeskermd te laat loop nie.
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY moet gestel wees.",
      );
    }
    // Plaaslik, voor Supabase gekoppel is, laat die skil deur sodat daar iets
    // is om te sien. Verwyder hierdie tak nooit sonder die produksie-wag hierbo nie.
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
