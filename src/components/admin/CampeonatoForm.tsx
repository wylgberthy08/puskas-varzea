"use client";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, Image as ImageIcon, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Campeonato } from "@/app/admin/(dashboard)/campeonatos/page";

interface CampeonatoFormProps {
  editingCampeonato: Campeonato | null;
  onSave: () => void;
  onCancel: () => void;
}

export function CampeonatoForm({ editingCampeonato, onSave, onCancel }: CampeonatoFormProps) {
  const [status, setStatus] = useState<"Ativo" | "Inativo">("Ativo");
  const [name, setName] = useState("");
  const [season, setSeason] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (editingCampeonato) {
      setName(editingCampeonato.name);
      setSeason(editingCampeonato.season);
      setStatus(editingCampeonato.status);
      setLogoPreview(editingCampeonato.logo_url);
    } else {
      clearForm();
    }
  }, [editingCampeonato]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setName("");
    setSeason("");
    setStatus("Ativo");
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSave = async () => {
    if (!name) {
      alert("Por favor, informe o nome do campeonato.");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Sessão não encontrada. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }
      let logo_url = logoPreview;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('campeonato-logos')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('campeonato-logos')
          .getPublicUrl(filePath);

        logo_url = publicUrl;
      }

      const dataToSave = {
        name,
        season,
        status,
        logo_url,
      };

      if (editingCampeonato) {
        const { error } = await supabase
          .from('campeonatos')
          .update(dataToSave)
          .eq('id', editingCampeonato.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('campeonatos')
          .insert([dataToSave]);
        if (error) throw error;
      }

      alert(editingCampeonato ? "Campeonato atualizado com sucesso!" : "Campeonato cadastrado com sucesso!");
      clearForm();
      onSave();
    } catch (error: any) {
      alert("Erro ao salvar campeonato: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-6 lg:p-8 mt-6 scroll-mt-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-blue-500 bg-blue-500/10 p-1.5 rounded-full">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl text-white tracking-wide">
            {editingCampeonato ? "Editar Campeonato" : "Criar Novo Campeonato"}
          </h2>
        </div>
        {editingCampeonato && (
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Inputs & Status */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
                NOME DO CAMPEONATO
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Premier League 2024"
                className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
                ANO / TEMPORADA
              </label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="Ex: 2023/24"
                className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>


          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              STATUS INICIAL
            </label>
            <div className="flex bg-[#1A2234] p-1 rounded-xl w-full border border-gray-700">
              <button
                type="button"
                onClick={() => setStatus("Ativo")}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                  status === "Ativo"
                    ? "bg-[#243351] text-blue-400 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Ativo
              </button>
              <button
                type="button"
                onClick={() => setStatus("Inativo")}
                className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                  status === "Inativo"
                    ? "bg-[#243351] text-white shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Inativo
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: File Upload */}
        <div className="flex flex-col">
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            Escudo / Logo do Campeonato
          </label>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-2xl bg-[#1A2234]/50 flex flex-col items-center justify-center p-8 transition-colors cursor-pointer group relative overflow-hidden"
          >
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="max-h-full max-w-full object-contain" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-blue-900/40 flex items-center justify-center mb-4 transition-colors">
                  <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
                </div>
                <p className="text-gray-300 text-sm mb-1 text-center">
                  Arraste o logo aqui ou <span className="text-blue-500 font-medium">clique para selecionar</span>
                </p>
                <p className="text-gray-500 text-xs">Formatos aceitos: PNG, SVG (Máx. 5MB)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-8 flex items-center gap-4 justify-end">
        <button
          type="button"
          onClick={editingCampeonato ? onCancel : clearForm}
          className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {editingCampeonato ? "Cancelar" : "Limpar"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingCampeonato ? "Atualizar Campeonato" : "Salvar Campeonato"}
        </button>
      </div>
    </div>
  );
}
