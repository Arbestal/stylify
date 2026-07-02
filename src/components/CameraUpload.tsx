"use client";

import { useRef, useState } from "react";

export default function CameraUpload({
  onCapture,
  busy,
  label,
}: {
  onCapture: (dataUrl: string) => void;
  busy?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      onCapture(dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
        disabled={busy}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="w-full border border-ink bg-rust px-5 py-3 font-mono text-sm uppercase tracking-widest text-paper transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Framkallar…" : label || "Ta foto"}
      </button>
      {preview && (
        <div className="frame-tick relative w-full overflow-hidden border border-ink/70 bg-film p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Förhandsvisning"
            className="max-h-48 w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
