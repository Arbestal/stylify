"use client";

import { useState } from "react";
import type { ClothingItem } from "@/lib/db";

const occasionPresets = ["Middag", "Kontoret", "Fest", "Träning", "Vardag"];
const seasonPresets = ["Vår", "Sommar", "Höst", "Vinter"];

interface Suggestion {
  title: string;
  reasoning: string;
  items: ClothingItem[];
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
      <h1 className="text-2xl font-bold">Stajla</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Berätta vad du är ute efter, eller låt AI:n mixa fritt.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Tillfälle
          </div>
          <div className="flex flex-wrap gap-2">
            {occasionPresets.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => togglePreset(preset, occasion, setOccasion)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  occasion === preset
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-600"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Årstid
          </div>
          <div className="flex flex-wrap gap-2">
            {seasonPresets.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => togglePreset(preset, season, setSeason)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  season === preset
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-600"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Övrigt (valfritt)
          </div>
          <textarea
            value={freeform}
            onChange={(e) => setFreeform(e.target.value)}
            placeholder="T.ex. 'något varmt och bekvämt' eller lämna tomt och mixa fritt"
            rows={3}
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-neutral-900 px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Stajlar…" : "✨ Skapa outfit"}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {suggestion && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold">{suggestion.title}</h2>
          <p className="mt-1 text-sm text-neutral-600">{suggestion.reasoning}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {suggestion.items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-neutral-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imagePath}
                  alt={item.description}
                  className="h-32 w-full object-cover"
                />
                <div className="p-2 text-xs text-neutral-600">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
