import Image from "next/image";
import Link from "next/link";
import {
  Trophy,
  Users,
  Zap,
  Vote,
  ChevronRight,
  CheckCircle2,
  Settings,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";


export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user)
  return (
    <div className="flex flex-col min-h-screen bg-bg-base">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border-subtle/50 bg-bg-base/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center glow-blue">
              <Trophy className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
              GOL MAIS BONITO
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#organizadores" className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
              Para Organizadores
            </Link>
            <Link href="#torcedores" className="text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
              Para Torcedores
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!user && (
              <Link href="/login">
                <span className="text-sm font-medium text-text-secondary hover:text-white transition-colors cursor-pointer mr-2">
                  Entrar
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background with Generated Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-base/20 via-bg-base/60 to-bg-base z-10" />
          <Image
            src="/images/hero-bg.png"
            alt="Fundo Estádio"
            fill
            className="object-cover opacity-40 mix-blend-luminosity"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6">
            <Zap className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-brand-blue tracking-wider uppercase">Votação em Tempo Real</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight mb-6 max-w-4xl mx-auto uppercase">
            Dê o brilho que seu <span className="text-brand-blue">campeonato</span> merece.
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            A plataforma definitiva para organizar, votar e premiar os gols mais épicos de cada rodada.
            Crie engajamento real com sua torcida.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="https://wa.me/5592992688904?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20organização%20de%20campeonatos." target="_blank">
              <Button size="lg" className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-hover text-white h-14 px-8 text-lg font-bold rounded-xl glow-blue group">
                Saiba Mais
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/campeonatos">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-border-subtle text-white h-14 px-8 text-lg font-bold rounded-xl hover:bg-white/5 transition-colors">
                Explorar Gols
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/*    <section className="py-12 border-y border-border-subtle bg-bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-display font-black text-white mb-1">50+</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Campeonatos</div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-white mb-1">12K+</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Votos Realizados</div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-white mb-1">2.5K+</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Gols Cadastrados</div>
            </div>
            <div>
              <div className="text-3xl font-display font-black text-white mb-1">100%</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-widest">Engajamento</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Dual Content Section */}
      <section id="organizadores" className="py-24 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-brand-blue/30 to-purple-500/10 card-shadow">
              <div className="bg-bg-card rounded-[22px] p-8 md:p-12 overflow-hidden border border-white/5">
                <div className="inline-block p-3 bg-brand-blue/20 rounded-2xl mb-6">
                  <Settings className="text-brand-blue w-6 h-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black mb-6 uppercase leading-[0.9] tracking-tighter">
                  Gestão Profissional para <span className="text-brand-blue">Organizadores</span>
                </h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "Crie rodadas de votação em minutos",
                    "Integração simples com vídeos e imagens",
                    "Painel administrativo completo",
                    "Aumente a visibilidade do seu torneio"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle2 className="text-brand-blue w-5 h-5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="https://wa.me/5592992688904?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20organização%20de%20campeonatos." target="_blank">
                  <Button variant="outline" className="w-full sm:w-auto border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all font-bold">
                    Saiba Mais sobre o Painel
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="text-brand-blue font-bold tracking-[0.2em] uppercase mb-4">Para os Donos do Jogo</h3>
            <h2 className="text-5xl md:text-6xl font-display font-black mb-6 uppercase leading-[0.9]">
              Transforme seu Campeonato em um Show.
            </h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Dê aos seus participantes uma experiência profissional. Gere valor para seus patrocinadores
              e torne os momentos decisivos do seu torneio inesquecíveis.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-white">Dashboard</span>
                <span className="text-sm text-text-muted">Gestão completa e intuitiva</span>
              </div>
              <div className="w-px h-12 bg-border-subtle" />
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold text-white">Relatórios</span>
                <span className="text-sm text-text-muted">Dados reais de engajamento</span>
              </div>
            </div>
          </div>
        </div>

        {/* Torcedores Section */}
        <div id="torcedores" className="grid lg:grid-cols-2 gap-16 items-center mt-32">
          <div>
            <h3 className="text-brand-blue font-bold tracking-[0.2em] uppercase mb-4">A Voz da Galera</h3>
            <h2 className="text-5xl md:text-6xl font-display font-black mb-6 uppercase leading-[0.9]">
              Onde cada Voto é uma vibração.
            </h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Encontre o campeonato da sua região, assista aos vídeos dos gols mais bonitos e decida
              quem merece o topo do ranking. Torça, comente e compartilhe o seu favorito.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-bg-card/50 rounded-2xl border border-white/5">
                <Vote className="text-brand-blue w-6 h-6 mb-2" />
                <span className="font-bold block">Votação Simples</span>
                <span className="text-xs text-text-muted">1 clique e seu voto tá na conta</span>
              </div>
              <div className="p-4 bg-bg-card/50 rounded-2xl border border-white/5">
                <BarChart3 className="text-brand-blue w-6 h-6 mb-2" />
                <span className="font-bold block">Rankings Reais</span>
                <span className="text-xs text-text-muted">Veja quem tá liderando o prêmio</span>
              </div>
            </div>
          </div>

          <div>
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-purple-500/30 to-brand-blue/10 card-shadow">
              <div className="bg-bg-card rounded-[22px] p-8 md:p-12 overflow-hidden border border-white/5">
                <div className="inline-block p-3 bg-purple-500/20 rounded-2xl mb-6">
                  <Users className="text-purple-400 w-6 h-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black mb-6 uppercase leading-[0.9] tracking-tighter">
                  Comunidade Apaixonada por <span className="text-purple-400">Gols</span>
                </h2>
                <ul className="space-y-4 mb-8">
                  {[
                    "Acesse de qualquer dispositivo",
                    "Vídeos em alta definição",
                    "Apoie seus amigos e atletas locais",
                    "Fique por dentro das rodadas"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle2 className="text-purple-400 w-5 h-5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/campeonatos">
                  <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl h-12 px-8 shadow-lg shadow-purple-500/20">
                    Explorar Campeonatos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-border-subtle bg-bg-card/20 divide-y divide-border-subtle">
        <div className="container mx-auto px-4 pb-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Trophy className="text-brand-blue w-6 h-6" />
            <span className="font-display font-bold text-lg tracking-tight">GOL MAIS BONITO</span>
          </div>

          <div className="flex gap-12 text-sm text-text-secondary">
            <div className="flex flex-col gap-2">
              <span className="text-white font-bold">Produto</span>
              <Link href="#" className="hover:text-brand-blue">Home</Link>
              <Link href="#" className="hover:text-brand-blue">Funcionalidades</Link>
              <Link href="#" className="hover:text-brand-blue">Explorar</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white font-bold">Empresa</span>
              <Link href="#" className="hover:text-brand-blue">Sobre Nós</Link>
              <Link href="#" className="hover:text-brand-blue">Contato</Link>
              <Link href="#" className="hover:text-brand-blue">Privacidade</Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-8 flex justify-between items-center text-xs text-text-muted">
          <p>© 2026 Gol Mais Bonito. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white">Instagram</Link>
            <Link href="#" className="hover:text-white">YouTube</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}