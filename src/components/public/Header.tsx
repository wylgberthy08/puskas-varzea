"use client";

import Link from "next/link";
import { Search, User, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-[var(--color-bg-base)] border-b border-[var(--color-border-subtle)] sticky top-0 z-50">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center glow-blue">
            <span className="text-white font-bold text-xs">⚽</span>
          </div>
          <span className="text-xl font-display font-bold tracking-tight">
            Gol Mais Bonito
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/campeonatos" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Campeonatos
          </Link>
          <Link href="/vencedores" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Vencedores
          </Link>
          <Link href="/sobre" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Sobre
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            placeholder="Buscar campeonato..."
            className="pl-10 pr-4 py-2 bg-bg-card border border-border-subtle rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue w-64 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          {!loading && !user && (
            <Link href="/login">
              <button className="bg-brand-blue hover:bg-brand-blue-hover text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-brand-blue/20 active:scale-95">
                Entrar
              </button>
            </Link>
          )}
          
          {user && (
            <button 
              onClick={handleSignOut}
              className="p-2 text-text-muted hover:text-white transition-colors bg-bg-card rounded-full border border-border-subtle"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}

          <button className="p-2 text-text-muted hover:text-white transition-colors bg-bg-card rounded-full border border-border-subtle">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
