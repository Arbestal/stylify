"use client";

import { useEffect, useState } from "react";
import type { ClothingItem } from "@/lib/db";
import CameraUpload from "@/components/CameraUpload";

const categoryLabels: Record<string, string> = {
  topp: "Topp",
  byxa: "Byxa",
  klänning: "Klänning",
  ytterplagg: "Ytterplagg",
  sko: "Sko",
  accessoar: "Accessoar",
  övrigt: "Övrigt",
};

export default function GarderobPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    const res = await fetch("/api/items");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleCapture(dataUrl: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Något gick fel");
      setItems((prev) => [data.item, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await fetch(`/api/items/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <h1 className="text-2xl font-bold">Garderob</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Fota ett plagg i taget – AI:n taggar det åt dig.
      </p>

      <div className="mt-5">
        <CameraUpload onCapture={handleCapture} busy={busy} label="📷 Lägg till plagg" />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-neutral-400">Laddar…</p>
        ) : items.length === 0 ? (
          <p className="text-neutral-400">Din garderob är tom än så länge.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imagePath}
                  alt={item.description}
                  className="h-36 w-full object-cover"
                />
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-neutral-700">
                    {categoryLabels[item.category] || item.category}
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                    {item.description}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wide text-neutral-400">
                      {item.season} · {item.style}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-500"
                    >
                      Ta bort
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
