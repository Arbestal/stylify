const toneClasses = {
  ink: "border-ink/30 text-ink",
  rust: "border-rust text-rust",
  sage: "border-sage text-sage",
} as const;

export default function Tag({
  children,
  tone = "ink",
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-none border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
