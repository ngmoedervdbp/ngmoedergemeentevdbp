import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-kliënt vir Client Components.
 *
 * Moet NOOIT in 'n Server Component ingevoer word nie — gebruik
 * `lib/supabase/server.ts` daar.
 *
 * `detectSessionInUrl: false` is daar vir EEN bladsy: /wagwoord-nuut.
 *
 * @supabase/ssr forseer `flowType: "pkce"` (hardgekodeer, nie oorskryfbaar
 * nie), en auth-js gooi doelbewus 'n fout wanneer 'n PKCE-kliënt 'n implisiete
 * terugroep sien:
 *
 *     case "implicit":
 *       if (this.flowType === "pkce") throw new AuthPKCEGrantCodeExchangeError(
 *         "Not a valid PKCE flow url.");
 *
 * 'n Uitnodiging-e-pos lewer presies dít — `#access_token=…`. Die kliënt weier
 * die token dus, en erger: hy vee die fragment uit die URL terwyl ons kode dit
 * probeer lees. Skakel die URL-hantering af en doen dit self.
 */
export function createClient(opsies?: { detectSessionInUrl?: boolean }) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    opsies?.detectSessionInUrl === false
      ? { auth: { detectSessionInUrl: false } }
      : undefined,
  );
}
