"use client";

import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import Image from "next/image";
import { Trophy, Star, Play, ArrowRight, Crown, Medal } from "lucide-react";

// ── Types ──────────────────────────────────────────────────
type Winner = {
  year: string;
  championship: string;
  player: string;
  club: string;
  clubColor: string;
  goalDescription: string;
  votes: number;
  percentage: number;
  image: string;
  gradient: string;
  featured?: boolean;
};

// ── Data ──────────────────────────────────────────────────
const WINNERS: Winner[] = [
  {
    year: "2024",
    championship: "Campeonato Brasileiro",
    player: "Yuri Alberto",
    club: "Corinthians",
    clubColor: "#000000",
    goalDescription: "Drible seco em dois defensores e toque de cobertura no ângulo.",
    votes: 42840,
    percentage: 65,
    image: "/images/copa_america.png",
    gradient: "linear-gradient(135deg, #0a2240 0%, #143d70 100%)",
    featured: true,
  },
  {
    year: "2024",
    championship: "Copa do Brasil",
    player: "Gabriel Jesus",
    club: "Arsenal FC",
    clubColor: "#EF0107",
    goalDescription: "Bicicleta impossível na ângulo direito nos acréscimos.",
    votes: 31200,
    percentage: 58,
    image: "/images/brasileirao.png",
    gradient: "linear-gradient(135deg, #0f3d2e 0%, #1a6641 100%)",
  },
  {
    year: "23/24",
    championship: "Champions League",
    player: "Giorgian De Arrascaeta",
    club: "Flamengo",
    clubColor: "#e8321c",
    goalDescription: "Chute seco de fora da área no ângulo superior.",
    votes: 28500,
    percentage: 52,
    image: "/images/champions.png",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  },
  {
    year: "2024",
    championship: "Copa América",
    player: "Hulk Paraíba",
    club: "Atlético-MG",
    clubColor: "#000000",
    goalDescription: "Falta de fora da área com efeito impossível no ângulo.",
    votes: 24100,
    percentage: 47,
    image: "/images/copa_brasil.png",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%)",
  },
  {
    year: "2023",
    championship: "Campeonato Brasileiro",
    player: "Endrick",
    club: "Palmeiras",
    clubColor: "#006428",
    goalDescription: "Giro de 360° no meio da área e finalização precisa.",
    votes: 39200,
    percentage: 71,
    image: "/images/premier_league.png",
    gradient: "linear-gradient(135deg, #003320 0%, #006428 100%)",
  },
  {
    year: "2023",
    championship: "Copa do Brasil",
    player: "Luís Suárez",
    club: "Grêmio",
    clubColor: "#4B7BCF",
    goalDescription: "Drible com a sola e toque sutil na saída do goleiro.",
    votes: 19800,
    percentage: 43,
    image: "/images/brasileirao.png",
    gradient: "linear-gradient(135deg, #1a2a4d 0%, #2a3f6f 100%)",
  },
];

// ── Helper Components ─────────────────────────────────────
function WinnerImageWithFallback({
  src,
  gradient,
  alt,
}: {
  src: string;
  gradient: string;
  alt: string;
}) {
  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = "none";
        }}
      />
      <div className="absolute inset-0" style={{ background: gradient, opacity: 0.3 }} />
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────
const STATS = [
  { label: "Gols Premiados", value: "48" },
  { label: "Edições", value: "12" },
  { label: "Campeonatos", value: "5" },
  { label: "Votos Totais", value: "2.1M+" },
];

// ── Page ──────────────────────────────────────────────────
export default function VencedoresPage() {
  const featured = WINNERS.find((w) => w.featured)!;
  const rest = WINNERS.filter((w) => !w.featured);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-base)] text-white">
      <Header />

      {/* ── Hero */}
      <section className="relative overflow-hidden py-20 px-6 text-center">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1565FF]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#1565FF]/10 text-[#1565FF] border border-[#1565FF]/20 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            <Trophy className="h-3.5 w-3.5" />
            Hall da Fama
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-5">
            VENCE<span className="text-[#1565FF]">DORES</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Os gols mais votados e memoráveis da história do campeonato. Arte pura em forma de futebol.
          </p>
        </div>
      </section>

      {/* ── Stats Strip */}
      <section className="border-y border-white/5 bg-[#0f1628]/50">
        <div className="max-w-5xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-[#1565FF]">{s.value}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Winner */}
      <section className="max-w-5xl mx-auto px-6 py-14 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="h-5 w-5 text-[#facc15]" />
          <h2 className="text-xl font-black uppercase tracking-widest text-white/70">Campeão Atual</h2>
        </div>

        <div className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-[#1565FF]/40 transition-all duration-300 h-80">
          <WinnerImageWithFallback
            src={featured.image}
            gradient={featured.gradient}
            alt={featured.player}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d1a] via-[#080d1a]/70 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-end md:justify-center p-8 md:p-12 max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-[#facc15] fill-[#facc15]" />
              <span className="text-[#facc15] text-xs font-black tracking-widest uppercase">
                {featured.championship} {featured.year}
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-display font-black mb-1">{featured.player}</h3>
            <p
              className="text-sm font-bold uppercase tracking-widest mb-4"
              style={{ color: featured.clubColor === "#000000" ? "#888" : featured.clubColor }}
            >
              {featured.club}
            </p>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">{featured.goalDescription}</p>

            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-3xl font-black text-[#1565FF]">{featured.percentage}%</span>
                <span className="text-white/40 text-sm ml-2">dos votos</span>
              </div>
              <button className="flex items-center gap-2 bg-[#1565FF] hover:bg-[#0047E1] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-[#1565FF]/20 text-sm active:scale-95">
                <Play className="h-4 w-4 fill-white" />
                Ver Replay
              </button>
            </div>
          </div>

          {/* Big trophy watermark */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none hidden md:block">
            <Trophy className="w-56 h-56 text-white" />
          </div>
        </div>
      </section>

      {/* ── All Winners Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Medal className="h-5 w-5 text-white/40" />
          <h2 className="text-xl font-black uppercase tracking-widest text-white/70">Todos os Vencedores</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((winner, i) => (
            <WinnerCard key={i} winner={winner} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Winner Card ────────────────────────────────────────────
function WinnerCard({ winner }: { winner: Winner }) {
  return (
    <div className="group relative bg-[#0f1628] border border-white/8 rounded-2xl overflow-hidden hover:border-[#1565FF]/40 hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={winner.image}
            alt={winner.player}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0" style={{ background: winner.gradient, opacity: 0.4 }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] via-[#0f1628]/30 to-transparent" />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Year + Championship badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-black tracking-widest text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded uppercase border border-white/10">
            {winner.championship} · {winner.year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-black text-white text-base leading-tight">{winner.player}</h3>
            <p
              className="text-xs font-bold uppercase tracking-wider mt-0.5"
              style={{ color: winner.clubColor === "#000000" ? "#666" : winner.clubColor }}
            >
              {winner.club}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[#1565FF] font-black text-lg">{winner.percentage}%</p>
            <p className="text-white/30 text-[10px]">{winner.votes.toLocaleString("pt-BR")} votos</p>
          </div>
        </div>

        <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-2">
          {winner.goalDescription}
        </p>

        {/* Progress */}
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#1565FF] transition-all duration-700"
            style={{ width: `${winner.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
