"use client";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, CloudUpload, Loader2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Gol } from "@/app/admin/(dashboard)/gols/page";

interface GolFormProps {
  editingGol: Gol | null;
  onSave: () => void;
  onCancel: () => void;
}

interface Campeonato {
  id: string;
  name: string;
}

export function GolForm({ editingGol, onSave, onCancel }: GolFormProps) {
  const [jogador, setJogador] = useState("");
  const [clube, setClube] = useState("");
  const [rodada, setRodada] = useState("1");
  const [campeonatoId, setCampeonatoId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCampeonatos();
    if (editingGol) {
      setJogador(editingGol.jogador);
      setClube(editingGol.clube);
      setRodada(String(editingGol.rodada));
      setCampeonatoId(editingGol.campeonato_id || "");
      setVideoPreview(editingGol.video_url);
    } else {
      resetForm();
    }
  }, [editingGol]);

  const fetchCampeonatos = async () => {
    const { data, error } = await supabase
      .from("campeonatos")
      .select("id, name")
      .order("name");
    
    if (!error && data) {
      setCampeonatos(data);
    }
  };

  const resetForm = () => {
    setJogador("");
    setClube("");
    setRodada("1");
    setCampeonatoId("");
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("O vídeo deve ter no máximo 50MB");
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSave = async () => {
    if (!jogador || !clube || !campeonatoId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // Verificar sessão
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Sessão não encontrada. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }

      let video_url = videoPreview || "";

      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `videos/${fileName}`;

        console.log("Tentando upload para o bucket 'gols-videos' na pasta 'videos'...");

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gols-videos')
          .upload(filePath, videoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          throw new Error(`Erro no upload do vídeo: ${uploadError.message}. Verifique se o bucket 'gols-videos' existe e permite uploads.`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('gols-videos')
          .getPublicUrl(filePath);

        video_url = publicUrl;
      }

      const golData = {
        jogador,
        clube,
        rodada: parseInt(rodada),
        video_url,
        campeonato_id: campeonatoId,
        visibilidade: editingGol ? editingGol.visibilidade : true
      };

      console.log("Tentando salvar no banco:", golData);

      if (editingGol) {
        const { error } = await supabase
          .from('gols')
          .update(golData)
          .eq('id', editingGol.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gols')
          .insert([golData]);
        if (error) throw error;
      }

      alert(editingGol ? "Gol atualizado!" : "Gol cadastrado com sucesso!");
      onSave();
    } catch (error: any) {
      console.error("Erro completo:", error);
      alert("Erro ao salvar gol: " + error.message);
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
            {editingGol ? "Editar Gol" : "Cadastrar Novo Gol"}
          </h2>
        </div>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Inputs */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              NOME DO JOGADOR *
            </label>
            <input
              type="text"
              value={jogador}
              onChange={(e) => setJogador(e.target.value)}
              placeholder="Ex: Cristiano Ronaldo"
              className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
                CLUBE / SELEÇÃO *
              </label>
              <input
                type="text"
                value={clube}
                onChange={(e) => setClube(e.target.value)}
                placeholder="Ex: Santos FC"
                className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
                RODADA *
              </label>
              <input
                type="number"
                value={rodada}
                onChange={(e) => setRodada(e.target.value)}
                min="1"
                className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              CAMPEONATO *
            </label>
            <div className="relative">
              <select 
                value={campeonatoId}
                onChange={(e) => setCampeonatoId(e.target.value)}
                className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
              >
                <option value="">Selecione um campeonato</option>
                {campeonatos.map((camp) => (
                  <option key={camp.id} value={camp.id}>{camp.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Video Upload */}
        <div className="flex flex-col">
          <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
            Upload do Vídeo (MP4)
          </label>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-2xl bg-[#1A2234]/50 flex flex-col items-center justify-center p-8 transition-colors cursor-pointer group min-h-[220px] relative overflow-hidden"
          >
            {videoPreview ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <video src={videoPreview} className="max-h-[160px] rounded-lg" controls={false} muted />
                <p className="text-xs text-blue-400 font-medium">Clique para trocar o vídeo</p>
              </div>
            ) : (
              <>
                <div className="mb-4 transition-colors">
                  <CloudUpload className="w-10 h-10 text-gray-400 group-hover:text-blue-400" />
                </div>
                <p className="text-gray-300 text-sm mb-1 text-center font-medium">
                  Arraste o vídeo aqui ou <span className="text-blue-500">clique para selecionar</span>
                </p>
                <p className="text-gray-500 text-xs text-center">Tamanho máximo: 50MB (MP4)</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-8 flex items-center gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {editingGol ? "Atualizar Gol" : "Salvar Registro"}
        </button>
      </div>
    </div>
  );
}
