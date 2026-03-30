"use client";

import Link from "next/link";

export function VotingFooter() {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between px-8 py-5 border-t border-white/5 bg-[#080d1a] text-xs text-white/30">
      <div className="flex items-center gap-2 mb-3 md:mb-0">
        <div className="w-5 h-5 bg-[#1565FF] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-[7px]">⚽</span>
        </div>
        <span>© 2024 Gol Mais Bonito. Todos os direitos reservados.</span>
      </div>

      <div className="flex items-center gap-2 mb-3 md:mb-0">
        {["🐦", "📷", "📘"].map((icon, i) => (
          <button key={i} className="w-7 h-7 rounded-full border border-white/10 hover:border-white/30 transition-colors flex items-center justify-center text-sm">
            {icon}
          </button>
        ))}
      </div>

      <nav className="flex items-center gap-5">
        {["Privacidade", "Termos", "Contato"].map((label) => (
          <Link key={label} href="#" className="hover:text-white transition-colors">
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
