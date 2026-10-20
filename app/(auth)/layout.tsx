import type { ReactNode } from "react";
import { werkruimteFont } from "@/lib/werkruimte-font";
import "@/components/kerk/admin.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${werkruimteFont.variable} admin-app admin-auth`}>
      {children}
    </div>
  );
}
