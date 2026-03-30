import { Edit2, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

interface CampeonatoCardProps {
  id: string;
  name: string;
  logo: string; // URL block or static asset
  status: "Ativo" | "Inativo";
  goalsCount: number;
  onDelete: () => void;
  onEdit: () => void;
}

export function CampeonatoCard({ id, name, logo, status, goalsCount, onDelete, onEdit }: CampeonatoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir o campeonato "${name}"?`)) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("campeonatos")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir campeonato: " + error.message);
      setIsDeleting(false);
      return;
    }

    onDelete();
  };

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition-colors group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
          {logo.startsWith("bg-") ? (
             <div className={`w-full h-full rounded-lg ${logo}`} />
          ) : (
            <img src={logo} alt={name} className="w-full h-full object-contain" />
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onEdit}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-400 p-1 rounded-md hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="font-display font-bold text-lg text-white mb-1 tracking-wide">{name}</h3>
        
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center text-xs text-gray-400 gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status === "Ativo" ? "bg-green-500" : "bg-gray-500"}`} />
            <span>{status}</span>
            <span className="text-gray-600">•</span>
            <span>{goalsCount} Gols</span>
          </div>
        </div>
      </div>
    </div>
  );
}
