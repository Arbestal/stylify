"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Hem" },
  { href: "/garderob", label: "Garderob" },
  { href: "/mig", label: "Mig" },
  { href: "/stajla", label: "Stajla" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-ink/20 bg-film">
      <div className="sprocket-row h-1.5" />
      <ul className="flex justify-around">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href} className="flex-1">
              <Link
                href={link.href}
                className={`block py-3 text-center font-mono text-[11px] uppercase tracking-widest transition-colors ${
                  active ? "text-rust-soft" : "text-paper/50"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
