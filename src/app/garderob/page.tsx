"use client";

import { useEffect, useRef, useState } from "react";
import type { ClothingItem } from "@/lib/db";
import CameraUpload from "@/components/CameraUpload";
import PhotoFrame from "@/components/PhotoFrame";
import Tag from "@/components/Tag";

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
  const justAddedId = useRef<string | null>(null);

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
      justAddedId.current = data.item.id;
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
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rust">
        Katalog
      </p>
      <h1 className="mt-1 font-display text-4xl uppercase tracking-tight text-ink">
        Garderob
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Fota ett plagg i taget – AI:n taggar det åt dig.
      </p>

      <div className="mt-6 border border-dashed border-putty p-4">
        <CameraUpload onCapture={handleCapture} busy={busy} label="Lägg till plagg" />
        {error && <p className="mt-2 font-mono text-xs text-rust">{error}</p>}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Laddar…
          </p>
        ) : items.length === 0 ? (
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Din garderob är tom än så länge.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {items.map((item, i) => (
              <div key={item.id}>
                <PhotoFrame
                  src={item.imagePath}
                  alt={item.description}
                  index={items.length - i}
                  caption={item.season}
                  onDelete={() => handleDelete(item.id)}
                  animate={justAddedId.current === item.id}
                />
                <div className="mt-2 flex flex-wrap gap-1">
                  <Tag tone="rust">{categoryLabels[item.category] || item.category}</Tag>
                  <Tag tone="sage">{item.style}</Tag>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-ink-soft">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
