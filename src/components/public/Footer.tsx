"use client";

import Link from "next/link";
import { Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-8 py-12 border-t border-border-subtle bg-bg-base/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="flex items-center gap-2 grayscale opacity-80">
          <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-[8px]">⚽</span>
          </div>
          <span className="text-lg font-display font-bold tracking-tight">
            Gol Mais Bonito
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-sm text-text-muted">
          <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
          <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="#" className="p-3 bg-bg-card border border-border-subtle rounded-full text-text-muted hover:text-brand-blue hover:border-brand-blue transition-all">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="p-3 bg-bg-card border border-border-subtle rounded-full text-text-muted hover:text-brand-blue hover:border-brand-blue transition-all">
            <Instagram className="h-5 w-5" />
          </Link>
        </div>

        <p className="text-xs text-text-muted mt-4">
          © 2024 Gol Mais Bonito - Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
