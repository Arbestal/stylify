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
        className="w-full rounded-xl bg-neutral-900 px-5 py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? "Analyserar…" : label || "📷 Ta foto"}
      </button>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Förhandsvisning"
          className="max-h-48 rounded-lg object-cover"
        />
      )}
    </div>
  );
}
