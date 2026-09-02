"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Teken uit.
 *
 * Server Action sodat die sessiekoekie bedienerkant uitgevee word — anders
 * dink proxy.ts jy is nog aangeteken.
 */
export async function tekenUit() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/teken-in");
}
