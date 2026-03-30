"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { RodadaForm } from "@/components/admin/RodadaForm";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Plus, Calendar, Trophy, Trash2, Edit2, CheckCircle2, XCircle } from "lucide-react";

export interface Rodada {
  id: string;
  campeonato_id: string;
  titulo: string;
  voto_inicio: string | null;
  voto_fim: string | null;
  status: "Ativo" | "Inativo" | "Finalizado";
  created_at: string;
  campeonatos?: {
    name: string;
  };
  total_votos?: number;
}

export default function RodadasPage() {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRodada, setEditingRodada] = useState<Rodada | null>(null);
  const [rankingRodada, setRankingRodada] = useState<Rodada | null>(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const supabase = createClient();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRodadas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rodadas")
      .select("*, campeonatos(name)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Fetch vote counts for these rounds
      const { data: voteCounts } = await supabase
        .from("votos")
        .select("rodada_id");
      
      const countsMap: Record<string, number> = {};
      (voteCounts || []).forEach(v => {
        countsMap[v.rodada_id] = (countsMap[v.rodada_id] || 0) + 1;
      });

      const enrichedData = (data as any[]).map(r => ({
        ...r,
        total_votos: countsMap[r.id] || 0
      }));

      setRodadas(enrichedData);
    } else if (error) {
      console.error("Erro ao buscar rodadas:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRodadas();
  }, []);

  const handleEdit = (rodada: Rodada) => {
    setEditingRodada(rodada);
    setIsFormOpen(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleNewRodada = () => {
    setEditingRodada(null);
    setIsFormOpen(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta rodada?")) return;
    
    const { error } = await supabase.from("rodadas").delete().eq("id", id);
    if (error) {
      alert("Erro ao excluir rodada: " + error.message);
    } else {
      fetchRodadas();
    }
  };

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title="GESTÃO DE RODADAS"
          subtitle="Crie sessões de votação por rodadas e selecione os gols participantes."
          buttonText="Nova Rodada"
          onButtonClick={handleNewRodada}
        />
        <div className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2 flex items-center gap-3 mb-6 md:mb-10 self-start md:self-auto">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <div className="text-xs">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Horário do Sistema (Local)</p>
            <p className="text-white font-mono font-bold">{currentTime.toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {rodadas.length > 0 ? (
            rodadas.map((rodada) => (
              <div 
                key={rodada.id}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{rodada.titulo}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Trophy className="w-3.5 h-3.5" />
                        {rodada.campeonatos?.name || "Sem campeonato"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          rodada.status === 'Ativo' ? 'bg-green-500/10 text-green-400' :
                          rodada.status === 'Finalizado' ? 'bg-gray-500/10 text-gray-400' :
                          'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {rodada.status}
                        </span>
                        
                        {/* Status Efetivo */}
                        {rodada.status === 'Ativo' && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-tight ${
                            new Date() < new Date(rodada.voto_inicio!) ? 'border-yellow-500/30 text-yellow-500' :
                            rodada.voto_fim && new Date() > new Date(rodada.voto_fim) ? 'border-red-500/30 text-red-500' :
                            'border-green-500/30 text-green-500'
                          }`}>
                            {new Date() < new Date(rodada.voto_inicio!) ? 'Agendado' :
                             rodada.voto_fim && new Date() > new Date(rodada.voto_fim) ? 'Encerrado' :
                              'Em Votação'}
                          </span>
                        )}

                        <span className="text-[9px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                          {rodada.total_votos || 0} Votos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 text-sm border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-8">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Início</p>
                    <p className="text-gray-300">
                      {rodada.voto_inicio ? new Date(rodada.voto_inicio).toLocaleString('pt-BR') : "Não definido"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Término</p>
                    <p className="text-gray-300">
                      {rodada.voto_fim ? new Date(rodada.voto_fim).toLocaleString('pt-BR') : "Não definido"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  <button 
                    onClick={() => handleEdit(rodada)}
                    className="p-2.5 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setRankingRodada(rodada)}
                    className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:text-white hover:bg-blue-500 transition-all"
                    title="Ver Ranking"
                  >
                    <Trophy className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(rodada.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500/70 hover:text-red-500 hover:bg-red-500/20 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-[#111827] border border-dashed border-gray-800 rounded-3xl">
              <Calendar className="w-12 h-12 text-gray-800 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Nenhuma rodada cadastrada ainda.</p>
              <button 
                onClick={handleNewRodada}
                className="mt-4 text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Criar primeira rodada
              </button>
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <RodadaForm 
          editingRodada={editingRodada}
          onSave={() => {
            fetchRodadas();
            setIsFormOpen(false);
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {rankingRodada && (
        <RankingModal 
          rodada={rankingRodada} 
          onClose={() => setRankingRodada(null)} 
        />
      )}
      
      <div className="h-10"></div>
    </div>
  );
}

// --- Internal Component: Ranking Modal ---
function RankingModal({ rodada, onClose }: { rodada: Rodada; onClose: () => void }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      // Fetch goals for this round
      const { data: rodadaGols, error: golsError } = await supabase
        .from('rodada_gols')
        .select('gols(*)')
        .eq('rodada_id', rodada.id);

      if (golsError) console.error(golsError);

      // Fetch votes for this round
      const { data: votes, error: votesError } = await supabase
        .from('votos')
        .select('gol_id')
        .eq('rodada_id', rodada.id);

      if (votesError) console.error(votesError);

      const votesMap: Record<string, number> = {};
      (votes || []).forEach(v => {
        votesMap[v.gol_id] = (votesMap[v.gol_id] || 0) + 1;
      });

      const enrichedResults = (rodadaGols || [])
        .map((rg: any) => ({
          ...rg.gols,
          votos: votesMap[rg.gols.id] || 0
        }))
        .sort((a: any, b: any) => b.votos - a.votos);

      setResults(enrichedResults);
      setLoading(false);
    };

    fetchRanking();
  }, [rodada.id]);

  const totalVotos = results.reduce((acc, curr) => acc + curr.votos, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111827] border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl">
              <Trophy className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">RESULTADO DA RODADA</h2>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{rodada.titulo}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
                 <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">Total de Participação</span>
                 <span className="text-2xl font-black text-white">{totalVotos} VOTOS</span>
              </div>

              {results.map((res, index) => {
                const percentage = totalVotos > 0 ? Math.round((res.votos / totalVotos) * 100) : 0;
                return (
                  <div key={res.id} className="relative bg-gray-800/20 border border-gray-700/30 rounded-2xl p-5 overflow-hidden">
                    {/* Progress Background */}
                    <div 
                      className="absolute left-0 top-0 h-full bg-blue-500/5 transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                    
                    <div className="relative flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center font-black text-xs text-gray-400">
                          {index + 1}º
                        </div>
                        <div>
                          <p className="font-bold text-white">{res.jogador}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{res.clube}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-white text-lg leading-none">{res.votos} <span className="text-[10px] text-gray-500 font-bold uppercase ml-0.5">Votos</span></p>
                        <p className="text-blue-500 text-[10px] font-black uppercase mt-1 tracking-widest">{percentage}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
               <p className="text-gray-500">Nenhum voto registrado para esta rodada.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-black/20 text-center">
            <p className="text-[9px] text-gray-600 uppercase font-black tracking-[0.2em]">O ranking é atualizado em tempo real</p>
        </div>
      </div>
    </div>
  );
}
