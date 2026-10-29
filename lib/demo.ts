/**
 * Is dit die toets-ontplooiing vir die kerkraad?
 *
 * `NEXT_PUBLIC_DEMO=1` word SLEGS op die demo se Vercel-projek gestel, wat na
 * sy eie Supabase-projek wys. Daar het elke toetser 'n geïsoleerde speelruimte
 * — sien supabase/demo/LEES-MY.md.
 *
 * Die vlag skei niks self nie; die isolasie is RLS in supabase/demo/. Hierdie
 * vlag skakel net die koppelvlak daarvoor aan: die banier, "Speel as", die
 * herstelknoppie, en `noindex` sodat Google nie die demo as 'n tweede
 * kerkwerf indekseer nie.
 *
 * 'n Gewone module (geen "use client") sodat Server Components dit kan invoer.
 * `NEXT_PUBLIC_` word tydens die bou ingebak — verander jy dit, ontplooi weer.
 */
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";
