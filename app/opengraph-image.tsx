import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GEMEENTE } from "@/lib/gemeente";
import { GLAS } from "@/lib/glas";

export const alt = "NG Moedergemeente Vanderbijlpark — 'n kerktuiste in die Vaal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logo/ng-merk-256.png"));
  return new ImageResponse(
    <div style={{
      display: "flex",
      width: "100%",
      height: "100%",
      padding: 72,
      background: GLAS.groen,
      color: "white",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 28 }}>
        {/* ImageResponse embeds this local asset; it makes no network request. */}
        <img
          src={`data:image/png;base64,${logo.toString("base64")}`}
          width={80}
          height={80}
          alt=""
        />
        {GEMEENTE.naam}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3 }}>
          Daar is plek vir jou.
        </div>
        <div style={{ fontSize: 36 }}>
          Jou kerktuiste in Vanderbijlpark en die Vaal.
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 27, justifyContent: "space-between" }}>
        <span>Sedert {GEMEENTE.gestig}</span>
        <span>Almal is welkom.</span>
      </div>
    </div>,
    size,
  );
}
