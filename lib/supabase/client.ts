import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase-kliënt vir Client Components.
 *
 * Moet NOOIT in 'n Server Component ingevoer word nie — gebruik
 * `lib/supabase/server.ts` daar.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
