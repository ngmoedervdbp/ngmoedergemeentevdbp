import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase-kliënt vir Server Components, Server Actions en Route Handlers.
 *
 * Moet per versoek geskep word — moenie dit in 'n module-vlak veranderlike
 * stoor nie. `cookies()` is async vanaf Next 16.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components mag nie koekies skryf nie. proxy.ts verfris
            // die sessie, so dit is veilig om te ignoreer.
          }
        },
      },
    },
  );
}
