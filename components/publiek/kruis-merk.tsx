/** A small, rounded line cross in the public site's illustration style. */
export function KruisMerk({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      <path d="M16 4v32M5 15h22" />
    </svg>
  );
}
