"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { Play, Share2, Trophy, TrendingUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { ResultsHeader } from "@/components/public/ResultsHeader";
import { VotingFooter } from "@/components/public/VotingFooter";
import { VideoModal } from "@/components/public/VideoModal";
import { createClient } from "@/utils/supabase/client";

// ── Types
type Candidate = {
  id: string;
  rank: number;
  name: string;
  club: string;
  image: string;
  votes: number;
  percentage: number;
  gradient: string;
};

// ── Countdown Timer
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

  const h = String(time.hours + (time.days * 24)).padStart(2, "0");
  const m = String(time.minutes).padStart(2, "0");
  const s = String(time.seconds).padStart(2, "0");
  return time.isExpired ? "Encerrado" : `${h}:${m}:${s}`;
}

// ── Small candidate image
function CandidateImage({ src, gradient, alt }: { src: string; gradient: string; alt: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
      {!err && src ? (
        <Image src={src} alt={alt} fill className="object-cover" onError={() => setErr(true)} />
      ) : (
        <div className="w-full h-full opacity-50" style={{ background: gradient }} />
      )}
    </div>
  );
}

// ── Page
function ResultadosContent() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const voteConfirmed = searchParams.get('voted') === 'true';

  // State
  const [user, setUser] = useState<any>(null);
  const [championship, setChampionship] = useState<any>(null);
  const [activeRound, setActiveRound] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"recentes" | "porcentagem">("porcentagem");
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [winnerImgErr, setWinnerImgErr] = useState(false);

  // Countdown logic
  const countdown = useCountdown(activeRound?.voto_fim);

  // Auth Protection Wrapper
  const requireAuth = useCallback((callback: () => void) => {
    if (!user) {
      router.push(`/admin/login?redirect=${pathname}`);
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

      // 2. Fetch Active Round
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

        // 3. Fetch Goals for this Round
        const { data: rodadaGolsData, error: goalsError } = await supabase
          .from('rodada_gols')
          .select(`
            gol_id,
            gols (*)
          `)
          .eq('rodada_id', roundData.id);

        if (goalsError) throw goalsError;

        // 4. Fetch All Votes for this Round
        const { data: votesData, error: votesError } = await supabase
          .from('votos')
          .select('gol_id')
          .eq('rodada_id', roundData.id);

        if (votesError) console.error('Erro ao buscar votos:', votesError);
        
        const totalVotesCount = votesData?.length || 0;
        const votesMap: Record<string, number> = {};
        (votesData || []).forEach(v => {
          votesMap[v.gol_id] = (votesMap[v.gol_id] || 0) + 1;
        });

        // 5. Build Candidates array with Real Stats and Ranking
        const mappedCandidates: Candidate[] = (rodadaGolsData || [])
          .filter(item => item.gols)
          .map((item: any) => {
            const goal = item.gols;
            const votes = votesMap[goal.id] || 0;
            const percentage = totalVotesCount > 0 ? Math.round((votes / totalVotesCount) * 100) : 0;
            
            return {
              id: goal.id,
              rank: 0, // Will be set after sorting
              name: goal.jogador,
              club: goal.clube,
              image: goal.video_url || "",
              votes,
              percentage,
              gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            };
          });

        // Sort by votes to determine rank
        const rankedCandidates = [...mappedCandidates]
          .sort((a, b) => b.votes - a.votes)
          .map((c, index) => ({ ...c, rank: index + 1 }));

        setCandidates(rankedCandidates);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de resultados:', error);
    } finally {
      setLoading(false);
    }
  }, [id, supabase]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const handlePlayVideo = (candidate: Candidate) => {
    requireAuth(() => {
      setSelectedVideo({ url: candidate.image, title: `Gol de ${candidate.name} - ${candidate.club}` });
    });
  };

  const handleShare = () => {
    requireAuth(() => {
      if (navigator.share) {
        navigator.share({
          title: `Resultados - ${championship?.name}`,
          text: `Confira quem está liderando a votação do gol mais bonito!`,
          url: window.location.href,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copiado para a área de transferência!");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080d1a] text-white">
        <ResultsHeader voteConfirmed={voteConfirmed} />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1565FF]" />
        </div>
        <VotingFooter />
      </div>
    );
  }

  const WINNER = candidates.length > 0 ? candidates[0] : null;
  const OTHERS = candidates.slice(1);

  const sortedOthers = [...OTHERS].sort((a, b) =>
    sort === "porcentagem" ? b.percentage - a.percentage : b.votes - a.votes
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-white">
      <ResultsHeader voteConfirmed={voteConfirmed} />

      <main className="flex-grow px-6 md:px-10 py-10 max-w-4xl mx-auto w-full">
        {/* ── Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight">
              Resultados da Votação
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {activeRound?.titulo || championship?.name} • Acompanhe a apuração em tempo real.
            </p>
          </div>
        </div>

        {WINNER ? (
          <>
            {/* ── Winner Card */}
            <section className="mb-10">
              <h2 className="text-base font-bold uppercase tracking-widest text-white/60 mb-4">
                Líder da Votação
              </h2>
              <div className="rounded-2xl border border-white/10 bg-[#0f1628] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Image/Video Thumbnail */}
                  <div className="relative w-full md:w-64 h-56 md:h-auto flex-shrink-0 bg-white/5">
                    {!winnerImgErr && WINNER.image ? (
                      <Image
                        src={WINNER.image}
                        alt={WINNER.name}
                        fill
                        className="object-cover"
                        onError={() => setWinnerImgErr(true)}
                      />
                    ) : (
                      <div className="w-full h-full" style={{ background: WINNER.gradient }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f1628] hidden md:block" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-7 md:p-8 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1565FF] animate-pulse" />
                      <span className="text-[#1565FF] text-xs font-black tracking-widest uppercase">
                        Vencedor Parcial
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black">{WINNER.name}</h3>
                      <p className="text-white/40 text-sm mt-0.5 uppercase tracking-tighter font-semibold">{WINNER.club}</p>
                    </div>

                    <div>
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-4xl font-black text-[#1565FF]">
                          {WINNER.percentage}%
                        </span>
                        <span className="text-white/30 text-sm">
                          {WINNER.votes.toLocaleString("pt-BR")} votos
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#1565FF] shadow-[0_0_10px_rgba(21,101,255,0.6)]"
                          style={{ width: `${WINNER.percentage}%` }}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handlePlayVideo(WINNER)}
                      className="flex items-center justify-center gap-2.5 bg-[#1565FF] hover:bg-[#0047E1] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#1565FF]/20 mt-1 active:scale-95"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Ver Replay do Gol
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Ranking */}
            {sortedOthers.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2 text-white/80">
                    <TrendingUp className="h-5 w-5 text-[#1565FF]" />
                    Ranking da Rodada
                  </h2>
                  <div className="flex rounded-lg overflow-hidden border border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    <button
                      onClick={() => setSort("recentes")}
                      className={`px-4 py-2 transition-colors ${
                        sort === "recentes" ? "bg-white/15 text-white" : "text-white/40 hover:text-white"
                      }`}
                    >
                      Total Votos
                    </button>
                    <button
                      onClick={() => setSort("porcentagem")}
                      className={`px-4 py-2 transition-colors ${
                        sort === "porcentagem"
                          ? "bg-white/15 text-white"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      Porcentagem
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {sortedOthers.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-[#0f1628]/70 hover:border-white/15 hover:bg-[#0f1628] transition-all cursor-pointer group"
                      onClick={() => handlePlayVideo(c)}
                    >
                      {/* Rank */}
                      <span className="text-white/20 text-sm font-black w-7 text-right flex-shrink-0">
                        #{c.rank}
                      </span>

                      {/* Image */}
                      <CandidateImage src={c.image} gradient={c.gradient} alt={c.name} />

                      {/* Info + Bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="font-bold text-sm leading-tight group-hover:text-[#1565FF] transition-colors">{c.name}</p>
                            <p className="text-white/35 text-[10px] uppercase font-bold tracking-tighter">{c.club}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-black text-sm ml-4 flex-shrink-0 block">
                              {c.percentage}%
                            </span>
                            <span className="text-white/20 text-[10px] font-bold block">{c.votes} votos</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#1565FF] transition-all duration-700"
                            style={{ width: `${c.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center gap-4">
            <Trophy className="w-12 h-12 text-white/10" />
            <p className="text-white/40 italic">
              Nenhum dado de votação disponível para esta rodada ainda.
            </p>
          </div>
        )}

        {/* ── Bottom CTA */}
        <section className="flex flex-col items-center gap-5 pt-8 pb-8 border-t border-white/5 mt-10">
          {activeRound?.voto_fim && (
            <p className="text-white/40 text-sm uppercase tracking-widest font-bold">
              A votação encerra em:{" "}
              <span className="text-[#1565FF] font-black font-mono ml-2 text-lg">{countdown}</span>
            </p>
          )}
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-[#0f1628] hover:bg-[#1a2340] border border-white/10 hover:border-white/20 text-white font-black uppercase tracking-widest px-10 py-4 rounded-2xl transition-all text-xs shadow-xl active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar Resultados
          </button>
        </section>
      </main>

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

export default function ResultadosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#080d1a] text-white">
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#1565FF]" />
        </div>
      </div>
    }>
      <ResultadosContent />
    </Suspense>
  );
}
