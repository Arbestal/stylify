"use client";

export default function PhotoFrame({
  src,
  alt,
  index,
  caption,
  onDelete,
  animate,
  heightClassName = "h-40",
}: {
  src: string;
  alt: string;
  index: number;
  caption?: string;
  onDelete?: () => void;
  animate?: boolean;
  heightClassName?: string;
}) {
  return (
    <div className="relative">
      <div
        className={`frame-tick relative overflow-hidden border border-ink/70 bg-film p-1 ${
          animate ? "animate-develop" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`${heightClassName} w-full object-cover`}
        />
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Ta bort"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-rust text-paper text-xs font-bold leading-none shadow-sm"
          >
            ×
          </button>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        <span>N&deg; {String(index).padStart(3, "0")}</span>
        {caption && <span className="max-w-[65%] truncate text-right">{caption}</span>}
      </div>
    </div>
  );
}
