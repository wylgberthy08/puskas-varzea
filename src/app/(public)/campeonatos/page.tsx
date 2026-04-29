"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { ChampionshipCard } from "@/components/public/ChampionshipCard";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

export default function CampeonatosPage() {
  const [championships, setChampionships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCampeonatos() {
      try {
        const { data, error } = await supabase
          .from('campeonatos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setChampionships(data || []);
      } catch (error) {
        console.error('Erro ao buscar campeonatos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCampeonatos();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-8 text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-display font-black tracking-tighter mb-6 uppercase">
            Escolha um <span className="text-brand-blue">Campeonato</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Selecione a competição e vote nos gols mais memoráveis da temporada.
            Sua voz define o vencedor do Puskás nacional.
          </p>
        </section>

        {/* Grid Section */}
        <section className="max-w-7xl mx-auto px-8 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
            </div>
          ) : championships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {championships.map((championship) => (
                <ChampionshipCard

                  key={championship.id}
                  id={championship.id}
                  title={championship.nome}
                  description={championship.descricao || "Confira os melhores lances deste campeonato."}
                  image={championship.logo_url || "/images/placeholder-championship.png"}
                  status={(championship.status as any) || "VOTAÇÃO ABERTA"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-bg-card rounded-2xl border border-border-subtle">
              <p className="text-text-muted italic">Nenhum campeonato encontrado no momento.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
