"use client";

import { useState } from "react";
import type { ClothingItem } from "@/lib/db";
import PhotoFrame from "@/components/PhotoFrame";

const occasionPresets = ["Middag", "Kontoret", "Fest", "Träning", "Vardag"];
const seasonPresets = ["Vår", "Sommar", "Höst", "Vinter"];

interface Suggestion {
  title: string;
  reasoning: string;
  items: ClothingItem[];
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink/30 bg-paper text-ink-soft"
      }`}
    >
      {children}
    </button>
  );
}

export default function StajlaPage() {
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const [freeform, setFreeform] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const res = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, season, freeform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Något gick fel");
      setSuggestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setLoading(false);
    }
  }

  function togglePreset(
    value: string,
    current: string,
    setter: (v: string) => void
  ) {
    setter(current === value ? "" : value);
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rust">
        Styling-docket
      </p>
      <h1 className="mt-1 font-display text-4xl uppercase tracking-tight text-ink">
        Stajla
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Berätta vad du är ute efter, eller låt AI:n mixa fritt.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            Tillfälle
          </div>
          <div className="flex flex-wrap gap-2">
            {occasionPresets.map((preset) => (
              <Chip
                key={preset}
                active={occasion === preset}
                onClick={() => togglePreset(preset, occasion, setOccasion)}
              >
                {preset}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            Årstid
          </div>
          <div className="flex flex-wrap gap-2">
            {seasonPresets.map((preset) => (
              <Chip
                key={preset}
                active={season === preset}
                onClick={() => togglePreset(preset, season, setSeason)}
              >
                {preset}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            Övrigt (valfritt)
          </div>
          <textarea
            value={freeform}
            onChange={(e) => setFreeform(e.target.value)}
            placeholder="T.ex. 'något varmt och bekvämt' eller lämna tomt och mixa fritt"
            rows={3}
            className="w-full border border-ink/30 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-ink bg-rust px-5 py-3 font-mono text-sm uppercase tracking-widest text-paper disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Stajlar…" : "Skapa outfit"}
        </button>
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
      </form>

      {suggestion && (
        <div className="mt-8 border border-ink bg-paper-raised">
          <div className="p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-rust">
              Förslag
            </p>
            <h2 className="mt-1 font-display text-2xl uppercase tracking-wide text-ink">
              {suggestion.title}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{suggestion.reasoning}</p>
          </div>

          <div className="border-t border-dashed border-putty" />

          <div className="grid grid-cols-2 gap-x-3 gap-y-5 p-5">
            {suggestion.items.map((item, i) => (
              <PhotoFrame
                key={item.id}
                src={item.imagePath}
                alt={item.description}
                index={i + 1}
                caption={item.category}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
