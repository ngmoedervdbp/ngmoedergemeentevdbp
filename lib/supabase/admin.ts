import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-kliënt met die SERVICE-ROLE-sleutel.
 *
 * ⚠⚠ HIERDIE KLIËNT OMSEIL ELKE RLS-BELEID. ⚠⚠
 *
 * Dit is die enigste plek in die kode wat die service-role-sleutel aanraak, en
 * dit moet so bly. Reëls:
 *
 *   1. `server-only` bo-aan — 'n invoer in 'n Client Component word 'n
 *      bouftout, nie 'n sleutel in die blaaierbundel nie.
 *   2. Gebruik dit SLEGS vir dinge wat die Auth-admin-API verg: uitnodigings
 *      en wagwoordherstel. Vir alles anders gebruik lib/supabase/server.ts,
 *      wat as die aangetekende gebruiker werk en RLS respekteer.
 *   3. Elke oproepplek moet EERS self kontroleer dat die gebruiker 'n admin is
 *      — hier is daar geen RLS wat dit vir jou doen nie.
 *
 * Sonder die sleutel gee dit `null` terug sodat die app steeds bou en loop;
 * die oproepplek sê dan vir die gebruiker dat die funksie nie opgestel is nie.
 */
export function adminKliënt() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sleutel = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !sleutel) return null;

  return createClient(url, sleutel, {
    auth: {
      // Geen sessie om te stoor of te verfris nie — dit is 'n eenmalige
      // bediener-oproep, nie 'n gebruiker se sessie nie.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
