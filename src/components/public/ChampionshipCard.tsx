"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Bell } from "lucide-react";

type Status = "VOTAÇÃO ABERTA" | "RESULTADOS FINAIS" | "EM BREVE" | "Ativo" | "Encerrado";

interface ChampionshipCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  status: Status | string;
}

export function ChampionshipCard({ id, title, description, image, status }: ChampionshipCardProps) {
  const isVotacaoAberta = status === "VOTAÇÃO ABERTA" || status === "Ativo";
  const isResultadosFinais = status === "RESULTADOS FINAIS" || status === "Encerrado";
  const isEmBreve = status === "EM BREVE";

  return (
    <Link href={`/campeonatos/${id}`} className="block h-full">
      <div className="group h-full relative bg-bg-card border border-border-subtle rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-blue/50 hover:-translate-y-1">
        {/* Background Image with Overlay */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            alt={title}
            src={image}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-wider ${isVotacaoAberta ? "bg-green-500/90 text-white" :
                isResultadosFinais ? "bg-brand-blue/90 text-white" :
                  "bg-slate-500/90 text-white"
              }`}>
              {status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-brand-blue transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-6">
            {description}
          </p>

          {/* Dynamic Button (Visual Only since wrapped in Link) */}
          <div className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${isVotacaoAberta ? "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-lg shadow-brand-blue/20" :
              isResultadosFinais ? "bg-bg-card/50 text-white border border-border-subtle hover:bg-border-subtle" :
                "bg-transparent text-text-muted border border-border-subtle hover:text-white"
            }`}>
            {isVotacaoAberta && (
              <>
                Ver e Votar <ArrowRight className="h-4 w-4" />
              </>
            )}
            {isResultadosFinais && (
              <>
                Ver Resultados <Eye className="h-4 w-4" />
              </>
            )}
            {isEmBreve && (
              <>
                Notificar-me <Bell className="h-4 w-4" />
              </>
            )}
            {!isVotacaoAberta && !isResultadosFinais && !isEmBreve && (
              <>
                Ver Campeonato <ArrowRight className="h-4 w-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
