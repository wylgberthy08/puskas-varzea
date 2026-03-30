"use client";

import { Edit2, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Gol } from "@/app/admin/(dashboard)/gols/page";

interface GolsTableProps {
  data: Gol[];
  onDelete: () => void;
  onEdit: (gol: Gol) => void;
}

export function GolsTable({ data, onDelete, onEdit }: GolsTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const supabase = createClient();

  const handleDelete = async (gol: Gol) => {
    if (!confirm(`Tem certeza que deseja excluir o gol de "${gol.jogador}"?`)) return;

    setIsDeleting(gol.id);
    const { error } = await supabase
      .from("gols")
      .delete()
      .eq("id", gol.id);

    if (error) {
      alert("Erro ao excluir gol: " + error.message);
      setIsDeleting(null);
      return;
    }

    onDelete();
    setIsDeleting(null);
  };

  const toggleVisibilidade = async (gol: Gol) => {
    const { error } = await supabase
      .from("gols")
      .update({ visibilidade: !gol.visibilidade })
      .eq("id", gol.id);

    if (error) {
      alert("Erro ao atualizar visibilidade: " + error.message);
      return;
    }

    onDelete(); // Triggers a refresh
  };

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl overflow-hidden flex flex-col mb-8">
      {/* WRAPPER FOR HORIZONTAL SCROLL ON VERY SMALL SCREENS */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-800/60 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Vídeo</th>
              <th className="px-6 py-4">Jogador</th>
              <th className="px-6 py-4">Clube</th>
              <th className="px-6 py-4 text-center">Visibilidade</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                    #{row.id.slice(0, 4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-20 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800 relative group/video">
                       {row.video_url ? (
                         <video 
                           src={row.video_url} 
                           className="w-full h-full object-cover"
                           muted
                           onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                           onMouseOut={(e) => {
                             (e.target as HTMLVideoElement).pause();
                             (e.target as HTMLVideoElement).currentTime = 0;
                           }}
                         />
                       ) : (
                         <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                           <span className="text-[10px] text-gray-500">Sem vídeo</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-display font-bold text-white text-base">
                    {row.jogador}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
                      {row.clube}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => toggleVisibilidade(row)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#111827] ${
                        row.visibilidade ? "bg-blue-600" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          row.visibilidade ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(row)}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(row)}
                        disabled={isDeleting === row.id}
                        className="text-gray-400 hover:text-red-400 p-2 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        {isDeleting === row.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Nenhum gol encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="px-6 py-4 border-t border-gray-800/60 bg-[#111827] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-400">
          Mostrando {data.length} gols registrados
        </span>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/5 transition-colors cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium shadow-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors cursor-not-allowed">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
