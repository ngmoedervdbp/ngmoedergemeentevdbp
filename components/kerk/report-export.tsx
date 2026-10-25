"use client";

import { useState, type ComponentProps } from "react";
import { Download } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { useMelding } from "@/components/ui/melding";
import type { ReportFormat, ReportKind, ReportPeriod } from "@/lib/reports/model";

export type ExportOptions = { verslag?: ReportKind; formaat?: ReportFormat; tydperk?: ReportPeriod; omvang?: "aktief" | "almal" };

export function useReportExport() {
  const [busy, setBusy] = useState(false);
  const { wys } = useMelding();
  async function download(options: ExportOptions = {}) {
    if (busy) return false;
    // Open synchronously so a print view survives browser popup blockers.
    const printWindow = options.formaat === "print" ? window.open("", "_blank") : null;
    if (options.formaat === "print" && !printWindow) {
      wys("Laat opspringvensters toe om die drukweergawe oop te maak.", "info");
      return false;
    }
    if (printWindow) {
      printWindow.opener = null;
      printWindow.document.title = "Verslag word voorberei";
      printWindow.document.body.textContent = "Verslag word voorberei…";
    }
    setBusy(true);
    try {
      const params = new URLSearchParams({ verslag: options.verslag ?? "lidmate", formaat: options.formaat ?? "pdf", ...(options.tydperk ? { tydperk: options.tydperk } : {}), ...(options.omvang ? { omvang: options.omvang } : {}) });
      const response = await fetch(`/api/verslae?${params}`, { cache: "no-store", redirect: "error" });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.fout ?? "Die verslag kon nie afgelaai word nie. Probeer weer.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (printWindow) {
        printWindow.location.replace(url);
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? `verslag.${options.formaat ?? "pdf"}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      window.setTimeout(() => URL.revokeObjectURL(url), printWindow ? 300_000 : 60_000);
      return true;
    } catch (error) {
      printWindow?.close();
      wys(error instanceof Error ? error.message : "Die verslag kon nie afgelaai word nie.", "fout");
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { busy, download };
}

export function ReportExportButton({ options, children, ...props }: Omit<ComponentProps<typeof Knop>, "onClick"> & { options?: ExportOptions }) {
  const { busy, download } = useReportExport();
  return <Knop grootte="sm" ikoon={Download} {...props} disabled={busy || props.disabled} aria-busy={busy} onClick={() => void download(options)}>{busy ? "Berei voor…" : children}</Knop>;
}
