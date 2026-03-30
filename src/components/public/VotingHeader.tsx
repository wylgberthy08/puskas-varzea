"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bell, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function VotingHeader() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const nav = [
    { label: "Votação", href: "#", active: true },
    { label: "Candidatos", href: "#candidatos" },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#080d1a]/90 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-10">
        <Link href="/campeonatos" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1565FF] rounded-full flex items-center justify-center shadow-[0_0_14px_rgba(21,101,255,0.6)]">
            <span className="text-white font-bold text-[10px]">⚽</span>
          </div>
          <div className="leading-tight">
            <span className="text-sm font-display font-black tracking-tight uppercase text-white">
              GOL <span className="text-[#1565FF]">MAIS BONITO</span>
            </span>
            <p className="text-[9px] text-white/40 tracking-widest uppercase -mt-0.5">Campeonato Oficial</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
                item.active
                  ? "text-white border-[#1565FF]"
                  : "text-white/50 border-transparent hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-white/40 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1565FF] rounded-full" />
        </button>
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
              <User className="h-4 w-4 text-brand-blue" />
            </div>
            <button 
              onClick={handleSignOut}
              className="p-2 text-white/40 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <button className="bg-[#1565FF] hover:bg-[#0047E1] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#1565FF]/20 flex items-center gap-2">
              <User className="h-4 w-4" />
              Entrar
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
