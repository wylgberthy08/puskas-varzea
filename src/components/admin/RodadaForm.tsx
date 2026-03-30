"use client";

import { useState, useEffect, useRef } from "react";
import { PlusCircle, Loader2, X, Trophy, Calendar, Check, Search, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Rodada } from "@/app/admin/(dashboard)/rodadas/page";

interface RodadaFormProps {
  editingRodada: Rodada | null;
  onSave: () => void;
  onCancel: () => void;
}

interface Campeonato {
  id: string;
  name: string;
}

interface Gol {
  id: string;
  jogador: string;
  clube: string;
  rodada: number;
}

export function RodadaForm({ editingRodada, onSave, onCancel }: RodadaFormProps) {
  const [titulo, setTitulo] = useState("");
  const [campeonatoId, setCampeonatoId] = useState("");
  const [votoInicio, setVotoInicio] = useState("");
  const [votoFim, setVotoFim] = useState("");
  const [status, setStatus] = useState<"Ativo" | "Inativo" | "Finalizado">("Inativo");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [availableGoals, setAvailableGoals] = useState<Gol[]>([]);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const supabase = createClient();

  const toLocalISOString = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    fetchCampeonatos();
    if (editingRodada) {
      setTitulo(editingRodada.titulo);
      setCampeonatoId(editingRodada.campeonato_id);
      setVotoInicio(toLocalISOString(editingRodada.voto_inicio));
      setVotoFim(toLocalISOString(editingRodada.voto_fim));
      setStatus(editingRodada.status);
      fetchSelectedGoals(editingRodada.id);
    } else {
      resetForm();
    }
  }, [editingRodada]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPreviewStatus = () => {
    if (status !== 'Ativo') return null;
    if (!votoInicio) return "Aguardando data";
    
    const start = new Date(votoInicio);
    const end = votoFim ? new Date(votoFim) : null;
    const now = new Date();

    if (now < start) return "Agendado";
    if (end && now > end) return "Encerrado";
    return "Em Votação";
  };

  useEffect(() => {
    if (campeonatoId) {
      fetchGoalsForChampionship(campeonatoId);
    } else {
      setAvailableGoals([]);
    }
  }, [campeonatoId]);

  const fetchCampeonatos = async () => {
    const { data, error } = await supabase
      .from("campeonatos")
      .select("id, name")
      .order("name");
    if (!error && data) setCampeonatos(data);
  };

  const fetchGoalsForChampionship = async (id: string) => {
    const { data, error } = await supabase
      .from("gols")
      .select("id, jogador, clube, rodada")
      .eq("campeonato_id", id)
      .order("rodada", { ascending: true });
    if (!error && data) setAvailableGoals(data);
  };

  const fetchSelectedGoals = async (rodadaId: string) => {
    const { data, error } = await supabase
      .from("rodada_gols")
      .select("gol_id")
      .eq("rodada_id", rodadaId);
    
    if (!error && data) {
      setSelectedGoalIds(data.map(item => item.gol_id));
    }
  };

  const resetForm = () => {
    setTitulo("");
    setCampeonatoId("");
    setVotoInicio("");
    setVotoFim("");
    setStatus("Inativo");
    setSelectedGoalIds([]);
  };

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoalIds(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId) 
        : [...prev, goalId]
    );
  };

  const handleSave = async () => {
    if (!titulo || !campeonatoId) {
      alert("Por favor, preencha o título e selecione um campeonato.");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão expirada. Faça login novamente.");

      const rodadaData = {
        titulo,
        campeonato_id: campeonatoId,
        voto_inicio: votoInicio ? new Date(votoInicio).toISOString() : null,
        voto_fim: votoFim ? new Date(votoFim).toISOString() : null,
        status
      };

      let rodadaId = editingRodada?.id;

      if (editingRodada) {
        const { error } = await supabase
          .from("rodadas")
          .update(rodadaData)
          .eq("id", editingRodada.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("rodadas")
          .insert([rodadaData])
          .select()
          .single();
        if (error) throw error;
        rodadaId = data.id;
      }

      // Sync Selected Goals
      if (rodadaId) {
        // 1. Delete current relations if editing
        if (editingRodada) {
          const { error: delError } = await supabase
            .from("rodada_gols")
            .delete()
            .eq("rodada_id", rodadaId);
          if (delError) throw delError;
        }

        // 2. Insert new relations
        if (selectedGoalIds.length > 0) {
          const relations = selectedGoalIds.map(golId => ({
            rodada_id: rodadaId,
            gol_id: golId
          }));
          const { error: insError } = await supabase
            .from("rodada_gols")
            .insert(relations);
          if (insError) throw insError;
        }
      }

      alert(editingRodada ? "Rodada atualizada!" : "Rodada criada com sucesso!");
      onSave();
    } catch (error: any) {
      alert("Erro ao salvar rodada: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = availableGoals.filter(goal => 
    goal.jogador.toLowerCase().includes(searchTerm.toLowerCase()) || 
    goal.clube.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#111827] border border-gray-800/60 rounded-2xl p-6 lg:p-8 mt-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="text-blue-500 bg-blue-500/10 p-1.5 rounded-full">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl text-white tracking-wide">
            {editingRodada ? "Editar Rodada" : "Criar Nova Rodada"}
          </h2>
        </div>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Basic Info */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              TÍTULO DA RODADA / SESSÃO
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Rodada 1 - Pinturas do Brasileirão"
              className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              CAMPEONATO
            </label>
            <select 
              value={campeonatoId}
              onChange={(e) => setCampeonatoId(e.target.value)}
              className="w-full bg-[#1A2234] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">Selecione um campeonato</option>
              {campeonatos.map((camp) => (
                <option key={camp.id} value={camp.id}>{camp.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-[#1A2234] border border-gray-700/50 rounded-xl p-4 mb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                Agendamento da Votação
              </div>
              <div className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                HORA ATUAL: {currentTime.toLocaleTimeString('pt-BR')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    Início
                  </label>
                  <button 
                    type="button"
                    onClick={() => setVotoInicio(new Date().toISOString().slice(0, 16))}
                    className="text-[9px] text-blue-500 hover:text-blue-400 font-bold uppercase"
                  >
                    Agora
                  </button>
                </div>
                <input
                  type="datetime-local"
                  value={votoInicio}
                  onChange={(e) => setVotoInicio(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">
                  Término
                </label>
                <input
                  type="datetime-local"
                  value={votoFim}
                  onChange={(e) => setVotoFim(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {status === 'Ativo' && (
              <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Status Efetivo na Página:</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  getPreviewStatus() === 'Em Votação' ? 'bg-green-500/20 text-green-400' :
                  getPreviewStatus() === 'Agendado' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {getPreviewStatus()}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2">
              STATUS
            </label>
            <div className="flex bg-[#1A2234] p-1 rounded-xl w-full border border-gray-700">
              {["Inativo", "Ativo", "Finalizado"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt as any)}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                    status === opt
                      ? "bg-[#243351] text-blue-400 shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Goal Selection */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase">
              Selecionar Gols para Votação ({selectedGoalIds.length})
            </label>
            {campeonatoId && (
               <span className="text-[10px] text-blue-400 font-bold uppercase">{availableGoals.length} Disponíveis</span>
            )}
          </div>

          {!campeonatoId ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl bg-[#1A2234]/30 p-8 text-center">
              <Trophy className="w-8 h-8 text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">Selecione um campeonato primeiro para listar os gols.</p>
            </div>
          ) : (
            <div className="flex flex-col bg-[#1A2234] border border-gray-700 rounded-2xl overflow-hidden h-[400px]">
              {/* Search Header */}
              <div className="p-4 border-b border-gray-800 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Buscar jogador ou clube..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-800">
                {filteredGoals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {filteredGoals.map((goal) => {
                      const isSelected = selectedGoalIds.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => handleToggleGoal(goal.id)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all grow text-left ${
                            isSelected 
                              ? "bg-blue-600/10 border border-blue-600/30" 
                              : "hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isSelected ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"
                            }`}>
                              R{goal.rodada}
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isSelected ? "text-blue-400" : "text-gray-200"}`}>{goal.jogador}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">{goal.clube}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                     <AlertCircle className="w-6 h-6 text-gray-700 mb-2" />
                     <p className="text-gray-500 text-xs">Nenhum gol encontrado para este campeonato.</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
          {editingRodada ? "Atualizar Rodada" : "Salvar Rodada"}
        </button>
      </div>
    </div>
  );
}
