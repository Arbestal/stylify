"use client";

import { useEffect, useState } from "react";
import type { PersonPhoto } from "@/lib/db";
import CameraUpload from "@/components/CameraUpload";

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
      <h1 className="text-2xl font-bold">Mig</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Foton av dig själv i olika vinklar, som referens.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <select
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm"
        >
          {angleOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <CameraUpload onCapture={handleCapture} busy={busy} label="📷 Lägg till foto" />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-neutral-400">Laddar…</p>
        ) : photos.length === 0 ? (
          <p className="text-neutral-400">Inga foton tillagda än.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.imagePath}
                  alt={photo.angle}
                  className="h-48 w-full object-cover"
                />
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-xs font-semibold text-neutral-700">
                    {photo.angle}
                  </span>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-xs text-red-500"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
