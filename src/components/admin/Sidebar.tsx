"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Activity,
  CalendarDays,
  Users,
  LogOut,
  Hexagon
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const links = [
    { name: "Dashboard", href: "/admin/painel", icon: LayoutDashboard },
    { name: "Campeonatos", href: "/admin/campeonatos", icon: Trophy },
    { name: "Gols", href: "/admin/gols", icon: Activity },
    { name: "Rodadas", href: "/admin/rodadas", icon: CalendarDays },
    { name: "Usuários", href: "/admin/usuarios", icon: Users },
  ];

  return (
    <aside className="w-64 h-full bg-[#0d121f] text-white flex flex-col justify-between border-r border-gray-800">
      <div>
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 p-6 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center glow-blue">
             <Hexagon className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm leading-tight">GOL MAIS BONITO</span>
            <span className="text-xs text-gray-400">Painel Administrativo</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-1 px-4">
          {links.map((link) => {
            // Precise active matching to avoid overlapping paths
            const isActive = link.href === "/admin/painel" 
              ? pathname === link.href
              : pathname.startsWith(link.href);
              
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-400"}`} />
                <span className="text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER PROFILE AREA */}
      <div className="p-6 border-t border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-300 flex-shrink-0"></div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-medium text-sm truncate">Administrador</span>
            <span className="text-gray-400 text-xs truncate">admin@gol.com.br</span>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="text-gray-400 hover:text-white transition-colors"
          title="Sair"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
