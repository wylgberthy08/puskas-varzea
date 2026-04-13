"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { VotingHeader } from "@/components/public/VotingHeader";
import { VotingFooter } from "@/components/public/VotingFooter";
import { CandidateCard } from "@/components/public/CandidateCard";
import { VideoModal } from "@/components/public/VideoModal";
import { createClient } from "@/utils/supabase/client";
import { Trophy, Share2, ArrowRight, Loader2, Lock } from "lucide-react";

// --- Types ---
type Candidate = {
  id: string;
  playerName: string;
  club: string;
  clubColor: string;
  goalDescription: string;
  image: string;
  imageFallbackGradient?: string;
  votes: number;
};

// --- Countdown Timer ---
function useCountdown(targetDate: string | null) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isExpired: false
        });
      } else {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return time;
}

// --- Main Page ---
export default function VotacaoPage() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // State
  const [user, setUser] = useState<any>(null);
  const [championship, setChampionship] = useState<any>(null);
  const [activeRound, setActiveRound] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedForId, setVotedForId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [votingState, setVotingState] = useState<'UPCOMING' | 'OPEN' | 'CLOSED'>('OPEN');
  const [totalVotesCount, setTotalVotesCount] = useState(0);

  // Countdown
  const targetDate = votingState === 'UPCOMING' ? activeRound?.voto_inicio : activeRound?.voto_fim;
  const countdown = useCountdown(targetDate);

  // Auth Protection Wrapper
  const requireAuth = useCallback((callback: () => void) => {
    if (!user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }
    callback();
  }, [user, router, pathname]);

  const fetchData = useCallback(async () => {
    try {
      // 0. Get Current User
      const { data: { user: userData } } = await supabase.auth.getUser();
      setUser(userData);

      // 1. Fetch Championship Info
      const { data: champData, error: champError } = await supabase
        .from('campeonatos')
        .select('*')
        .eq('id', id)
        .single();

      if (champError) throw champError;
      setChampionship(champData);

      // 2. Fetch Active Round for this Championship
      const { data: roundData, error: roundError } = await supabase
        .from('rodadas')
        .select('*')
        .eq('campeonato_id', id)
        .eq('status', 'Ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (roundError) console.error('Erro ao buscar rodada:', roundError);
      
      if (roundData) {
        setActiveRound(roundData);

        // Check voting state based on the round dates
        const now = new Date();
        const start = roundData.voto_inicio ? new Date(roundData.voto_inicio) : null;
        const end = roundData.voto_fim ? new Date(roundData.voto_fim) : null;

        if (start && now < start) {
          setVotingState('UPCOMING');
        } else if (end && now > end) {
          setVotingState('CLOSED');
        } else {
          setVotingState('OPEN');
        }

        // 3. Fetch Goals specifically for this Round
        const { data: rodadaGolsData, error: goalsError } = await supabase
          .from('rodada_gols')
          .select(`
            gol_id,
            gols (*)
          `)
          .eq('rodada_id', roundData.id);

        if (goalsError) throw goalsError;

        // 4. Fetch All Votes for this Round (to calculate real-time stats)
        const { data: votesData, error: votesError } = await supabase
          .from('votos')
          .select('gol_id')
          .eq('rodada_id', roundData.id);

        if (votesError) console.error('Erro ao buscar votos:', votesError);
        const votesMap: Record<string, number> = {};
        (votesData || []).forEach(v => {
          votesMap[v.gol_id] = (votesMap[v.gol_id] || 0) + 1;
        });
        setTotalVotesCount(votesData?.length || 0);

        // 5. Fetch current user's vote if logged in
        if (userData) {
          const { data: userVote } = await supabase
            .from('votos')
            .select('gol_id')
            .eq('rodada_id', roundData.id)
            .eq('user_id', userData.id)
            .maybeSingle();
          
          if (userVote) setVotedForId(userVote.gol_id);
        }

        const mappedCandidates: Candidate[] = (rodadaGolsData || [])
          .filter(item => item.gols)
          .map((item: any) => {
            const goal = item.gols;
            return {
              id: goal.id,
              playerName: goal.jogador,
              club: goal.clube,
              clubColor: "#1565FF", // Placeholder or from a club table
              goalDescription: `Gol na Rodada ${goal.rodada}`,
              image: goal.video_url || "",
              votes: votesMap[goal.id] || 0,
            };
          });

        setCandidates(mappedCandidates);
      } else {
        setVotingState('CLOSED');
        setCandidates([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const handleVote = async (goalId: string) => {
    requireAuth(async () => {
      if (votingState !== 'OPEN') {
        alert(votingState === 'UPCOMING' ? "A votação ainda não começou!" : "A votação já foi encerrada!");
        return;
      }

      try {
        const { error } = await supabase
          .from('votos')
          .upsert({ 
            user_id: user.id, 
            rodada_id: activeRound.id, 
            gol_id: goalId 
          }, { onConflict: 'user_id,rodada_id' });

        if (error) throw error;

        // Refresh data to show updated counts and state
        setVotedForId(goalId);
        fetchData();
      } catch (error: any) {
        console.error("Erro ao votar:", error);
        alert("Erro ao processar seu voto. Tente novamente.");
      }
    });
  };

  const handlePlayVideo = (candidate: Candidate) => {
    requireAuth(() => {
      setSelectedVideo({ url: candidate.image, title: `Gol de ${candidate.playerName} - ${candidate.club}` });
    });
  };

  const handleGenericAction = () => {
    // Logic for generic buttons like "Ver Regulamento"
    alert("Manual do campeonato!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080d1a] text-white">
        <VotingHeader />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-blue" />
        </div>
        <VotingFooter />
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080d1a] text-white">
        <VotingHeader />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Campeonato não encontrado</h2>
          <p className="text-white/60">O campeonato solicitado não existe ou está indisponível.</p>
        </div>
        <VotingFooter />
      </div>
    );
  }

  const leadingCandidate = candidates.length > 0 ? candidates.reduce((a, b) => (a.votes >= b.votes ? a : b)) : null;
  const leadingPercentage = leadingCandidate && totalVotesCount > 0 
    ? Math.round((leadingCandidate.votes / totalVotesCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-white">
      <VotingHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('${championship.logo_url || '/images/premier_league.png'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d1a]/60 via-[#080d1a]/50 to-[#080d1a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a]/80 via-transparent to-[#080d1a]/80" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-28 max-w-4xl mx-auto">
          {votingState === 'UPCOMING' ? (
            <span className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Em Breve
            </span>
          ) : votingState === 'CLOSED' ? (
            <span className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Votação Encerrada
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Votação Aberta
            </span>
          )}

          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight uppercase leading-none mb-4 text-balance">
            {activeRound ? activeRound.titulo : championship.name}
          </h1>

          {!user && (
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md mb-6">
              <Lock className="w-3 h-3" /> Faça login para participar
            </div>
          )}

          <p className="text-base md:text-lg text-white/60 max-w-xl mb-10 leading-relaxed">
            {!activeRound 
              ? "Não há nenhuma votação ativa para este campeonato no momento. Fique atento às nossas redes para as próximas rodadas!" 
              : `Participe da votação e escolha o gol mais bonito da rodada! Seu voto é fundamental.`}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {votingState === 'OPEN' && (
              <a
                href="#candidatos"
                className="bg-[#1565FF] hover:bg-[#0047E1] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-[#1565FF]/30 flex items-center gap-2 active:scale-95"
              >
                Votar Agora <ArrowRight className="h-4 w-4" />
              </a>
            )}
            <button 
              onClick={handleGenericAction}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-3.5 rounded-xl transition-all backdrop-blur-sm"
            >
              Ver Regulamento
            </button>
          </div>
        </div>
      </section>

      {/* ── Candidates Section ── */}
      <section id="candidatos" className="px-6 md:px-10 py-16 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-tight">
              CANDIDATOS SELECIONADOS
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {votingState === 'UPCOMING' ? "Aqueça os motores, a votação começa logo!" : "Gols espetaculares desta rodada"}
            </p>
          </div>

          {/* Countdown */}
          {!countdown.isExpired && (activeRound?.voto_inicio || activeRound?.voto_fim) && (
            <div className="flex items-center gap-1.5 text-sm font-mono">
              <span className="text-white/30 text-xs uppercase tracking-widest mr-1">
                {votingState === 'UPCOMING' ? 'Começa em:' : 'Encerra em:'}
              </span>
              {[
                { val: countdown.days, label: "d" },
                { val: countdown.hours, label: "h" },
                { val: countdown.minutes, label: "m" },
                { val: countdown.seconds, label: "s" },
              ].map(({ val, label }) => (
                <span key={label} className="text-[#ff6b35] font-black">
                  {String(val).padStart(2, "0")}{label}
                </span>
              ))}
            </div>
          )}
        </div>

        {candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((c, index) => (
                <CandidateCard
                  key={c.id}
                  number={index + 1}
                  playerName={c.playerName}
                  club={c.club}
                  clubColor={c.clubColor}
                  goalDescription={c.goalDescription}
                  image={c.image}
                  imageFallbackGradient={"linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"}
                  voted={votedForId === c.id}
                  onVote={() => handleVote(c.id)}
                  onPlay={() => handlePlayVideo(c)}
                />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/40 italic">
              {!activeRound 
                ? "Aguardando abertura da próxima rodada." 
                : "Ainda não há gols vinculados a esta rodada."}
            </p>
          </div>
        )}
      </section>

      {/* ── Community Engagement ── */}
      {candidates.length > 0 && (
        <section className="mx-6 md:mx-10 mb-16 p-8 md:p-10 rounded-2xl bg-[#0f1628] border border-white/5 max-w-6xl xl:mx-auto w-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left */}
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight mb-3">
                Engajamento da Comunidade
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                {totalVotesCount > 0 
                  ? `${totalVotesCount.toLocaleString()} votos já foram computados. Faça parte da história!` 
                  : "Seja o primeiro a votar nesta rodada!"}
              </p>

              <div className="flex flex-wrap gap-8">
                {leadingCandidate && totalVotesCount > 0 && (
                  <div>
                    <p className="text-[#1565FF] font-black text-xl">{leadingPercentage}%</p>
                    <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">
                      {leadingCandidate.playerName} Liderando
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[#ff6b35] font-black text-xl">{Math.floor(totalVotesCount * 0.8)}</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">Compartilhamentos</p>
                </div>
                <div>
                  <p className="text-green-400 font-black text-xl">Ativo</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">Status da Rodada</p>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex-shrink-0 relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1a2340" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1565FF"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42 * (leadingPercentage/100)} ${2 * Math.PI * 42 * (1 - leadingPercentage/100)}`}
                  className="drop-shadow-[0_0_8px_rgba(21,101,255,0.8)] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{leadingPercentage}%</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest text-center leading-tight">Líder Atual</span>
              </div>
            </div>

            {/* Share CTA */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              <div className="flex items-center gap-2 text-[#facc15]">
                <Trophy className="h-5 w-5" />
                <span className="font-bold text-sm">Votação Ativa</span>
              </div>
              <button 
                onClick={handleGenericAction}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </section>
      )}

      <VotingFooter />

      <VideoModal 
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ""}
        title={selectedVideo?.title}
      />
    </div>
  );
}
