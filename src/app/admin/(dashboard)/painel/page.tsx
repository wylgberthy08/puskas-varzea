"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { LayoutDashboard, Users, Trophy, Play, Star } from "lucide-react";

export default function PainelPage() {
  const stats = [
    { label: "Gols Ativos", value: "124", icon: Play, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Campeonatos", value: "8", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Votos Totais", value: "12.450", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Administradores", value: "3", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="min-h-full p-6 lg:p-10 w-full max-w-7xl mx-auto">
      <PageHeader
        title="PAINEL DE CONTROLE"
        subtitle="Visão geral do sistema e estatísticas rápidas."
      />

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-3xl shadow-xl shadow-black/20 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">{stat.label}</p>
              <p className="text-2xl font-display font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITY PLACEHOLDER */}
        <div className="lg:col-span-2 bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 mb-6">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-display font-bold text-white">Atividades Recentes</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#1A2234] border border-gray-800 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white uppercase">US</div>
                  <div>
                    <p className="text-sm font-medium text-white">Novo gol adicionado</p>
                    <p className="text-xs text-gray-400">Há {i * 2} horas por Admin</p>
                  </div>
                </div>
                <button className="text-xs text-blue-500 font-medium hover:underline">Ver detalhes</button>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-xl shadow-black/20">
          <h2 className="text-xl font-display font-bold text-white mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 gap-4">
            <button className="w-full bg-[#1A2234] hover:bg-blue-600/10 border border-gray-800 hover:border-blue-600/30 p-4 rounded-2xl text-left transition-all group">
              <p className="text-sm font-bold text-white group-hover:text-blue-400">Novo Campeonato</p>
              <p className="text-xs text-gray-400">Configurar nova competição</p>
            </button>
            <button className="w-full bg-[#1A2234] hover:bg-emerald-600/10 border border-gray-800 hover:border-emerald-600/30 p-4 rounded-2xl text-left transition-all group">
              <p className="text-sm font-bold text-white group-hover:text-emerald-400">Cadastrar Gol</p>
              <p className="text-xs text-gray-400">Adicionar vídeo e candidato</p>
            </button>
            <button className="w-full bg-[#1A2234] hover:bg-purple-600/10 border border-gray-800 hover:border-purple-600/30 p-4 rounded-2xl text-left transition-all group">
              <p className="text-sm font-bold text-white group-hover:text-purple-400">Ver Votação</p>
              <p className="text-xs text-gray-400">Acompanhar resultados ao vivo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
