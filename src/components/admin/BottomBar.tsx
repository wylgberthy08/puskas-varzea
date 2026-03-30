"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export function BottomBar() {
  const [scope, setScope] = useState<"Rodada" | "Campeonato">("Campeonato");

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-4 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* SEGMENTED CONTROL */}
      <div className="flex bg-[#1A2234] p-1 rounded-xl border border-gray-700 h-10 w-full sm:w-[320px]">
        <button
          onClick={() => setScope("Rodada")}
          className={`flex-1 text-sm font-medium rounded-lg transition-all flex items-center justify-center ${
            scope === "Rodada"
              ? "bg-[#243351] text-blue-400 shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Votação por Rodada
        </button>
        <button
          onClick={() => setScope("Campeonato")}
          className={`flex-1 text-sm font-medium rounded-lg transition-all flex items-center justify-center ${
            scope === "Campeonato"
              ? "bg-[#243351] text-blue-400 shadow-sm"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Votação por Campeonato
        </button>
      </div>

      {/* SEARCH INPUT */}
      <div className="relative w-full sm:w-[320px]">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Buscar campeonatos..."
          className="w-full bg-[#1A2234] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-10"
        />
      </div>
    </div>
  );
}
