"use client";

import { useState } from "react";
import { Play, CheckCircle } from "lucide-react";
import Image from "next/image";

interface CandidateCardProps {
  number: number;
  playerName: string;
  club: string;
  clubColor: string;
  goalDescription: string;
  image: string;
  imageFallbackGradient: string;
  voted: boolean;
  onVote: (name: string) => void;
  onPlay?: () => void;
}

export function CandidateCard({
  number,
  playerName,
  club,
  clubColor,
  goalDescription,
  image,
  imageFallbackGradient,
  voted,
  onVote,
  onPlay,
}: CandidateCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        voted
          ? "border-green-500/70 shadow-[0_0_24px_rgba(34,197,94,0.2)]"
          : "border-white/10 hover:border-[#1565FF]/50 hover:shadow-[0_0_24px_rgba(21,101,255,0.15)]"
      } bg-[#0f1628]`}
    >
      {/* Image Area */}
      <div className="relative h-52 overflow-hidden bg-slate-900">
        {!imageError && image ? (
          image.toLowerCase().endsWith('.mp4') ? (
            <video
              src={image}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              playsInline
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <Image
              src={image}
              alt={playerName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <div
            className="w-full h-full"
            style={{ background: imageFallbackGradient }}
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1628] via-[#0f1628]/20 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={onPlay}>
          <button 
            type="button"
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:bg-white/30 hover:scale-110 active:scale-95 shadow-2xl"
          >
            <Play className="h-6 w-6 text-white fill-white ml-1" />
          </button>
        </div>

        {/* Gol Badge */}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black tracking-widest text-white bg-[#1565FF]/90 px-2.5 py-1 rounded uppercase">
            GOL #{String(number).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Info Area */}
      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Club badge */}
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xs border-2 border-white/10"
            style={{ backgroundColor: clubColor }}
          >
            {club.slice(0, 3).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm truncate">{playerName}</h3>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: clubColor }}>
              {club}
            </p>
            <p className="text-[11px] text-white/40 truncate">{goalDescription}</p>
          </div>
        </div>

        {/* Vote Button */}
        <button
          onClick={() => onVote(playerName)}
          disabled={voted}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
            voted
              ? "bg-green-500 text-white cursor-default"
              : "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/20"
          }`}
        >
          {voted ? (
            <>
              <CheckCircle className="h-4 w-4" /> Votado
            </>
          ) : (
            <>
              <span className="text-base">▲</span> Votar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
