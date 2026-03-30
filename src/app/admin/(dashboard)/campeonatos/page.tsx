"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { CampeonatoCard } from "@/components/admin/CampeonatoCard";
import { CampeonatoForm } from "@/components/admin/CampeonatoForm";
import { BottomBar } from "@/components/admin/BottomBar";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export interface Campeonato {
  id: string;
  name: string;
  season: string;
  status: "Ativo" | "Inativo";
  logo_url: string | null;
  created_at: string;
}

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampeonato, setEditingCampeonato] = useState<Campeonato | null>(null);
  const supabase = createClient();

  const fetchCampeonatos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("campeonatos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCampeonatos(data as Campeonato[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampeonatos();
  }, []);

  const handleEdit = (camp: Campeonato) => {
    setEditingCampeonato(camp);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-full p-6 lg:p-10 w-full max-w-7xl mx-auto">
      <PageHeader
        title="GESTÃO DE CAMPEONATOS"
        subtitle="Organize as competições, logos e configurações globais."
        buttonText="Adicionar Campeonato"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {campeonatos.length > 0 ? (
            campeonatos.map((camp) => (
              <CampeonatoCard
                key={camp.id}
                id={camp.id}
                name={camp.name}
                logo={camp.logo_url || "bg-blue-600/20"}
                status={camp.status}
                goalsCount={0} // To be implemented later with goals table
                onDelete={fetchCampeonatos}
                onEdit={() => handleEdit(camp)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-[#111827] border border-dashed border-gray-800 rounded-2xl">
              <p className="text-gray-500">Nenhum campeonato encontrado.</p>
            </div>
          )}
        </div>
      )}

      <CampeonatoForm 
        editingCampeonato={editingCampeonato} 
        onSave={() => {
          fetchCampeonatos();
          setEditingCampeonato(null);
        }}
        onCancel={() => setEditingCampeonato(null)}
      />
      <BottomBar />
      
      {/* Small spacing at bottom to ensure no cutoff */}
      <div className="h-10"></div>
    </div>
  );
}
