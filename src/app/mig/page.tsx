"use client";

import { useEffect, useRef, useState } from "react";
import type { PersonPhoto } from "@/lib/db";
import CameraUpload from "@/components/CameraUpload";
import PhotoFrame from "@/components/PhotoFrame";

const angleOptions = [
  "Framifrån",
  "Från sidan",
  "Bakifrån",
  "Helkropp",
  "Övrigt",
];

export default function MigPage() {
  const [photos, setPhotos] = useState<PersonPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [angle, setAngle] = useState(angleOptions[0]);
  const [error, setError] = useState<string | null>(null);
  const justAddedId = useRef<string | null>(null);

  async function loadPhotos() {
    setLoading(true);
    const res = await fetch("/api/person");
    const data = await res.json();
    setPhotos(data.photos || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleCapture(dataUrl: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/person", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl, angle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Något gick fel");
      justAddedId.current = data.photo.id;
      setPhotos((prev) => [data.photo, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    await fetch(`/api/person/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-rust">
        Referensbibliotek
      </p>
      <h1 className="mt-1 font-display text-4xl uppercase tracking-tight text-ink">
        Mig
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Foton av dig själv i olika vinklar, som referens.
      </p>

      <div className="mt-6 flex flex-col gap-3 border border-dashed border-putty p-4">
        <select
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          className="border border-ink/30 bg-paper px-4 py-3 font-mono text-sm uppercase tracking-wide text-ink"
        >
          {angleOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <CameraUpload onCapture={handleCapture} busy={busy} label="Lägg till foto" />
        {error && <p className="font-mono text-xs text-rust">{error}</p>}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Laddar…
          </p>
        ) : photos.length === 0 ? (
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            Inga foton tillagda än.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {photos.map((photo, i) => (
              <PhotoFrame
                key={photo.id}
                src={photo.imagePath}
                alt={photo.angle}
                index={photos.length - i}
                caption={photo.angle}
                heightClassName="h-52"
                onDelete={() => handleDelete(photo.id)}
                animate={justAddedId.current === photo.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
