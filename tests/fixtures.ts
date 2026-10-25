import type { Lid, Wyk } from "../lib/tipes/gemeente";
import type { BedieningAktiwiteit } from "../lib/tipes/bediening";
import { reportDate } from "../lib/reports/model";

export const wards: Wyk[] = [
  { id: "ward-1", naam: "Wyk 1", nommer: "1", ouderling: "Toets Ouderling", kapasiteit: 50 },
  { id: "ward-2", naam: "Wyk 30 A", nommer: "30 A", ouderling: null, kapasiteit: 50 },
];

export function member(index = 0): Lid {
  return {
    id: `member-${String(index).padStart(5, "0")}`, first_name: index === 0 ? "Zoë" : `Toetslid ${index}`,
    last_name: "Du Plessis", date_of_birth: index % 3 === 0 ? null : "2000-01-15",
    geslag: index % 2 ? "manlik" : "vroulik", status: "aktief", tipe: "belydend",
    selfoon: "+27821234567", epos: "toets@example.test", wyk_id: index % 2 ? "ward-1" : null,
    family_id: null, family_role: null, lid_sedert: "2025-01-01", aantekeninge: "PRIVATE_NOTES_MUST_NOT_BE_EXPORTED", foto: null,
  };
}

export function activity(datum = reportDate(), index = 0): BedieningAktiwiteit {
  return { id: `activity-${index}`, titel: `Toetsbesoek ${index}`, tipe: "tuisbesoek", datum, begin_tyd: "09:00:00", eind_tyd: "10:30:00", plek_naam: "Toetslokaal", ure: 1.5, lidmaat_tipe: "bestaande", lid_id: null, adres: null, aantekeninge: "PRIVATE_PASTORAL_NOTES" };
}
