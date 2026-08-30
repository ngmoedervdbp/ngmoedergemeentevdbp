import { GlasBoog } from "@/components/kerk/glas-boog";

/**
 * Tydelike plekhouer vir bladsye wat nog gebou moet word.
 * Verwyder sodra 'n bladsy werklike inhoud kry.
 */
export function NogTeBou({ bladsy }: { bladsy: string }) {
  return (
    <div className="border-line bg-surface flex flex-col items-center justify-center gap-4 rounded-xl border px-6 py-20 text-center">
      <GlasBoog width={42} className="text-ink-muted" strokeWidth={2} />
      <p className="font-display text-2xl font-semibold">
        {bladsy} is nog nie gebou nie
      </p>
      <p className="text-ink-muted max-w-md text-sm text-balance">
        Die roete en navigasie werk reeds. Die inhoud kom sodra die
        Supabase-skema vir hierdie afdeling gereed is.
      </p>
    </div>
  );
}
