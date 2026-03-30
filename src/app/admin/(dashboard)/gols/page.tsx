"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { GolsTopBar } from "@/components/admin/GolsTopBar";
import { GolsTable } from "@/components/admin/GolsTable";
import { GolForm } from "@/components/admin/GolForm";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export interface Gol {
  id: string;
  created_at: string;
  jogador: string;
  clube: string;
  rodada: number;
  video_url: string;
  visibilidade: boolean;
  campeonato_id: string;
}

export default function GolsPage() {
  const [gols, setGols] = useState<Gol[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGol, setEditingGol] = useState<Gol | null>(null);
  
  const supabase = createClient();

  const fetchGols = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gols")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGols(data as Gol[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGols();
  }, []);

  const handleEdit = (gol: Gol) => {
    setEditingGol(gol);
    setIsFormOpen(true);
    
    // Scroll to form
    const formElement = document.getElementById("gol-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNewGoal = () => {
    setEditingGol(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingGol(null);
  };

  const handleSaveSuccess = () => {
    fetchGols();
    handleCloseForm();
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto">
      <PageHeader
        title="GESTÃO DE GOLS"
        subtitle="Gerencie os vídeos e informações dos gols participantes da competição."
        buttonText="Novo Gol"
        onButtonClick={handleNewGoal}
      />

      <GolsTopBar />
      
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <GolsTable 
          data={gols} 
          onDelete={fetchGols} 
          onEdit={handleEdit} 
        />
      )}

      <div id="gol-form">
        {isFormOpen && (
          <GolForm 
            editingGol={editingGol} 
            onSave={handleSaveSuccess} 
            onCancel={handleCloseForm} 
          />
        )}
      </div>
      
      {/* Spacer to avoid cutoff on mobile/scrolling */}
      <div className="h-10"></div>
    </div>
  );
}
