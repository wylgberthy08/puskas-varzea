# 🏆 GOL MAIS BONITO

O **Gol Mais Bonito** é uma plataforma moderna e intuitiva projetada para aumentar o engajamento em campeonatos de futebol, permitindo que torcedores votem nos gols mais épicos de cada rodada.

## 🚀 Funcionalidades

### ⚽ Para Torcedores
- **Votação em Tempo Real:** Participe da decisão de quem marcou o melhor gol da rodada com apenas um clique.
- **Galeria de Gols:** Assista aos vídeos dos lances mais bonitos diretamente na plataforma.
- **Rankings Dinâmicos:** Acompanhe em tempo real quais atletas e gols estão liderando a preferência do público.
- **Acesso Multiplataforma:** Interface totalmente responsiva, otimizada para smartphones e desktops.

### 🛠️ Para Organizadores (Painel Administrativo)
- **Gestão de Campeonatos:** Crie e gerencie múltiplos torneios simultaneamente.
- **Controle de Rodadas:** Organize as votações por etapas (rodadas), definindo datas de início e fim.
- **Cadastro de Gols:** Vincule vídeos e informações dos atletas de forma simples e rápida.
- **Dashboard de Engajamento:** Visualize métricas de votos e participação da torcida para gerar valor aos patrocinadores.

## 💻 Stack Tecnológica

O projeto utiliza as tecnologias mais modernas do ecossistema Web:

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router)
- **Interface:** [React 19](https://react.dev/) com [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (SSR)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Como Rodar o Projeto Especialmente

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou pnpm

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz com suas credenciais do Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

---
Desenvolvido com foco em alta performance e experiência do usuário.
