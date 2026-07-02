import Link from "next/link";

const cards = [
  {
    href: "/garderob",
    title: "Garderob",
    desc: "Fota och bläddra bland dina plagg",
  },
  {
    href: "/mig",
    title: "Mig",
    desc: "Foton av dig själv i olika vinklar",
  },
  {
    href: "/stajla",
    title: "Stajla",
    desc: "Låt AI:n sätta ihop en outfit åt dig",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-md px-5 pt-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rust">
        Personlig stylist · Garderobskatalog
      </p>
      <h1 className="mt-2 font-display text-6xl uppercase leading-[0.85] tracking-tight text-ink">
        Stilify
      </h1>
      <p className="mt-4 max-w-xs text-ink-soft">
        Fota det du äger. Låt AI:n stajla det du ska ha på dig.
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative flex items-center gap-4 border border-ink bg-paper-raised p-4 pl-7 transition-transform active:scale-[0.98]"
          >
            <span className="absolute left-[10px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-ink/40 bg-paper" />
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[10px] uppercase tracking-widest text-rust">
                0{i + 1}
              </div>
              <div className="font-display text-2xl uppercase tracking-wide text-ink">
                {card.title}
              </div>
              <div className="text-sm text-ink-soft">{card.desc}</div>
            </div>
            <span className="shrink-0 font-mono text-ink-soft transition-transform group-active:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
