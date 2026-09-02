import { z } from "zod";

/**
 * Validering vir die publieke registrasievorm.
 *
 * Dit is die app se ENIGSTE publieke skryfroete en dit aanvaar PII van
 * anonieme gebruikers — behandel elke veld as vyandig. Die blaaier se
 * `required`-attribute is gerief vir 'n mens; hierdie skema is die hek.
 *
 * Word deur beide die Server Action en (later) enige API-roete gebruik, sodat
 * daar net een definisie van "geldig" is.
 */

/** Leë strings uit 'n HTML-vorm word `null`, nie "" nie. */
const opsioneleTeks = (maks: number) =>
  z
    .string()
    .trim()
    .max(maks)
    .transform((v) => (v === "" ? null : v))
    .nullable();

/**
 * SA-selfoonnommers word op baie maniere getik: 082 123 4567, 0821234567,
 * +27 82 123 4567. Ons aanvaar almal en normaliseer na syfers.
 */
const selfoon = z
  .string()
  .trim()
  .min(1, "Selfoonnommer is verpligtend.")
  .transform((v) => v.replace(/[\s()-]/g, ""))
  .refine((v) => /^(\+?27|0)\d{9}$/.test(v), {
    message: "Voer 'n geldige Suid-Afrikaanse selfoonnommer in.",
  });

export const registrasieSkema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "Voornaam is verpligtend.")
    .max(100, "Voornaam is te lank."),

  last_name: z
    .string()
    .trim()
    .min(1, "Van is verpligtend.")
    .max(100, "Van is te lank."),

  // 'n Datum in die toekoms is 'n tikfout; 130 jaar terug ook.
  date_of_birth: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine(
      (v) => {
        if (!v) return true;
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return false;
        const nou = new Date();
        const oudste = new Date();
        oudste.setFullYear(nou.getFullYear() - 130);
        return d <= nou && d >= oudste;
      },
      { message: "Kyk asseblief die geboortedatum na." },
    ),

  geslag: z
    .enum(["manlik", "vroulik"])
    .nullable()
    .catch(null),

  huwelikstatus: z
    .enum(["ongetroud", "getroud", "weduwee_wewenaar"])
    .nullable()
    .catch(null),

  selfoon,

  epos: z
    .string()
    .trim()
    .max(255)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .refine((v) => v === null || z.email().safeParse(v).success, {
      message: "Voer 'n geldige e-posadres in.",
    }),

  adres: opsioneleTeks(500),
  aantekeninge: opsioneleTeks(2000),
});

export type RegistrasieInvoer = z.infer<typeof registrasieSkema>;

/**
 * Neem 'n rou FormData en gee óf die skoon data óf veldfoute terug.
 *
 * Leë keuselyste stuur "" — die skema hanteer dit, maar ons stuur `null` waar
 * die veld glad nie ingedien is nie sodat 'n weggelate veld nie as "" tel nie.
 */
export function leesVorm(data: FormData) {
  const rou = {
    first_name: String(data.get("first_name") ?? ""),
    last_name: String(data.get("last_name") ?? ""),
    date_of_birth: String(data.get("date_of_birth") ?? ""),
    geslag: (data.get("geslag") || null) as string | null,
    huwelikstatus: (data.get("huwelikstatus") || null) as string | null,
    selfoon: String(data.get("selfoon") ?? ""),
    epos: String(data.get("epos") ?? ""),
    adres: String(data.get("adres") ?? ""),
    aantekeninge: String(data.get("aantekeninge") ?? ""),
  };

  return registrasieSkema.safeParse(rou);
}
