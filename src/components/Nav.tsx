"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Hem", icon: "🏠" },
  { href: "/garderob", label: "Garderob", icon: "👕" },
  { href: "/mig", label: "Mig", icon: "🧍" },
  { href: "/stajla", label: "Stajla", icon: "✨" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/95 backdrop-blur">
      <ul className="flex justify-around">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                  active ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                <span className="text-lg leading-none">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
