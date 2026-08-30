import type { ReactNode } from "react";

export function BladsyKop({
  titel,
  beskrywing,
  aksies,
}: {
  titel: string;
  beskrywing?: string;
  aksies?: ReactNode;
}) {
  return (
    <header className="border-line flex flex-col gap-3 border-b pb-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4 sm:pb-5">
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="font-display text-[1.9rem] leading-[1.1] font-semibold tracking-[-0.015em] text-balance sm:text-[2.2rem] lg:text-[2.6rem] lg:leading-[1.05]">
          {titel}
        </h1>
        {beskrywing ? (
          <p className="text-ink-muted text-sm text-pretty sm:text-base">
            {beskrywing}
          </p>
        ) : null}
      </div>
      {aksies ? (
        <div className="flex flex-wrap gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
          {aksies}
        </div>
      ) : null}
    </header>
  );
}
