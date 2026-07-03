import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stilify — din digitala garderob",
    short_name: "Stilify",
    description: "Fota din garderob och låt AI:n stajla dina outfits.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#e7e2d6",
    theme_color: "#c9491d",
    lang: "sv",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
