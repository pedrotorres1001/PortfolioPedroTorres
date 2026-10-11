/**
 * Cartão "ARCHIVE://" com cantos quadrados, inspirado nos RECORD_LOG da referência.
 */
export function Rule() {
  return (
    <div className="rule my-3 text-xs" aria-hidden="true">
      {"// " + "-".repeat(120)}
    </div>
  );
}

export function LogLine({ k, children }) {
  return (
    <p className="text-[12px] leading-6 text-ink-2 sm:text-[13px]">
      <span className="text-ink">[ {k} ]</span> : {children}
    </p>
  );
}

export default function Frame({ node, title, children, className = "", archive = "ARCHIVE://" }) {
  return (
    <div className={`relative bg-surface/90 p-3 backdrop-blur-sm sm:p-4 ${className}`}>
      <div className="relative border border-ink/60 px-5 py-6 sm:px-7 sm:py-7">
        {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map(
          (pos) => (
            <span key={pos} className={`absolute size-[7px] bg-ink/70 ${pos}`} aria-hidden="true" />
          )
        )}
        <div className="flex items-center justify-between gap-4">
          <span className="label">{archive}</span>
          {node && <span className="label">NODE: {node}</span>}
        </div>
        {title && <h3 className="title-spaced mt-5 text-sm sm:text-base">{title}</h3>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
