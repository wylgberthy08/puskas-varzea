/**
 * Design Tokens — Colors
 * Gol Mais Bonito · Campeonato Oficial
 *
 * Extraídos diretamente do layout de referência.
 */

export const colors = {
    // ─── Brand ────────────────────────────────────────────────────────────────
    brand: {
        blue: {
            DEFAULT: '#1565FF',
            hover: '#0047E1',
            light: '#3D7FFF',
            muted: '#1A3D8F',
        },
        yellow: {
            DEFAULT: '#FFD600',
            hover: '#F5C800',
        },
        green: {
            DEFAULT: '#00C853',
            hover: '#00A843',
            muted: '#1DB954',
        },
    },

    // ─── Backgrounds ──────────────────────────────────────────────────────────
    bg: {
        base: '#0A0E1A',   // fundo raiz da página
        surface: '#111827',   // cards / painéis
        raised: '#1A2235',   // elementos elevados
        overlay: '#0D1525',   // seção de engajamento
        hero: '#0B1220',   // hero overlay
    },

    // ─── Text ─────────────────────────────────────────────────────────────────
    text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        muted: '#64748B',
        accent: '#FFD600',   // destaques em amarelo
        link: '#3D7FFF',
    },

    // ─── Borders ──────────────────────────────────────────────────────────────
    border: {
        subtle: '#1E2D45',
        default: '#243351',
        strong: '#2E4270',
    },

    // ─── Feedback ─────────────────────────────────────────────────────────────
    feedback: {
        success: '#00C853',
        warning: '#FFD600',
        error: '#FF3D3D',
        info: '#1565FF',
        live: '#00E676',   // badge "Votação Aberta"
    },

    // ─── Neutros puros ────────────────────────────────────────────────────────
    neutral: {
        0: '#FFFFFF',
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#050B14',
    },
} as const

export type Colors = typeof colors