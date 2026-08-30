import { Archive, CircleCheck, CircleMinus, Repeat } from "lucide-react";
import { Kenteken } from "@/components/ui/basis";
import type { Status } from "@/lib/mock";

const KAART = {
  aktief: { etiket: "Aktief", toon: "aktief", ikoon: CircleCheck },
  onaktief: { etiket: "Onaktief", toon: "onaktief", ikoon: CircleMinus },
  oorgeplaas: { etiket: "Oorgeplaas", toon: "oorgeplaas", ikoon: Repeat },
  oorlede: { etiket: "Oorlede", toon: "oorlede", ikoon: Archive },
} as const;

export function StatusKenteken({ status }: { status: Status }) {
  const { etiket, toon, ikoon } = KAART[status];
  return (
    <Kenteken toon={toon} ikoon={ikoon}>
      {etiket}
    </Kenteken>
  );
}
