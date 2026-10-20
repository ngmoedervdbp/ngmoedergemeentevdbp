/** A quiet echo of the public site's window, drawn without image assets. */
export function WerkruimteKuns({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path
        className="admin-art-orbit"
        d="M29 211V104a91 91 0 0 1 182 0v107M44 211V104a76 76 0 0 1 152 0v107"
      />
      <path
        className="admin-art-window"
        d="M61 211V104a59 59 0 0 1 118 0v107Z"
      />
      <circle className="admin-art-sun" cx="149" cy="121" r="22" />
      <path className="admin-art-hill" d="M61 183c45-48 77-36 118-5v33H61Z" />
      <path
        className="admin-art-path"
        d="M114 211c-5-22 3-34 22-47-10 19-8 34 2 47"
      />
      <path
        className="admin-art-cross"
        d="M99 95v45m-13-31h26M120 45v166M61 157h118"
      />
      <path className="admin-art-orbit" d="M43 220h154M62 227h116" />
    </svg>
  );
}
