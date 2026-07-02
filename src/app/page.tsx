import Link from "next/link";

const cards = [
  {
    href: "/garderob",
    icon: "👕",
    title: "Garderob",
    desc: "Fota och bläddra bland dina plagg",
  },
  {
    href: "/mig",
    icon: "🧍",
    title: "Mig",
    desc: "Foton av dig själv i olika vinklar",
  },
  {
    href: "/stajla",
    icon: "✨",
    title: "Stajla",
    desc: "Låt AI:n sätta ihop en outfit åt dig",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-md px-5 pt-12">
      <h1 className="text-3xl font-bold">Stilify</h1>
      <p className="mt-1 text-neutral-500">
        Din digitala garderob, stajlad av AI.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm active:scale-[0.98] transition"
          >
            <span className="text-3xl">{card.icon}</span>
            <div>
              <div className="font-semibold">{card.title}</div>
              <div className="text-sm text-neutral-500">{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
