"use client";

import Link from "next/link";
import { Bell, User, CheckCircle2 } from "lucide-react";

interface ResultsHeaderProps {
  voteConfirmed?: boolean;
}

export function ResultsHeader({ voteConfirmed = true }: ResultsHeaderProps) {
  const nav = [
    { label: "Início", href: "/campeonatos" },
    { label: "Votação", href: "../" },
    { label: "Resultados", href: "#", active: true },
    { label: "Histórico", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#080d1a]/95 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-10">
        <Link href="/campeonatos" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1565FF] rounded-full flex items-center justify-center shadow-[0_0_14px_rgba(21,101,255,0.6)]">
            <span className="text-white font-bold text-xs">⚽</span>
          </div>
          <span className="text-base font-display font-black tracking-tight text-white">
            Gol <span className="text-[#1565FF]">Mais Bonito</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                item.active ? "text-[#1565FF]" : "text-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {voteConfirmed && (
          <span className="hidden sm:flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/25 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Voto Confirmado
          </span>
        )}
        <button className="relative p-2 text-white/40 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1565FF] rounded-full" />
        </button>
        <button className="p-2 text-white/40 hover:text-white transition-colors">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
