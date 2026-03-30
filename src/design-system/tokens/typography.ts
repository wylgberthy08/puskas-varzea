/**
 * Design Tokens — Typography
 * Gol Mais Bonito · Campeonato Oficial
 */

export const typography = {
    // ─── Font Families ──────────────────────────────────────────────────────
    fontFamily: {
        // Display: headings hero e títulos de seção em caixa alta
        display: ['var(--font-display)', 'Barlow Condensed', 'Impact', 'sans-serif'],
        // Body: textos corridos, labels, botões
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        // Mono: contadores, placares, dados numéricos
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
    },

    // ─── Font Sizes ─────────────────────────────────────────────────────────
    fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],   // 10px
        xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],     // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],     // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],     // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],      // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px  — hero title
        '6xl': ['3.75rem', { lineHeight: '1' }],           // 60px  — hero title bold
        '7xl': ['4.5rem', { lineHeight: '1' }],           // 72px
    },

    // ─── Font Weights ───────────────────────────────────────────────────────
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',   // hero headings em caixa alta
    },

    // ─── Letter Spacing ─────────────────────────────────────────────────────
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.15em',   // badges/labels em caixa alta
    },
} as const

export type Typography = typeof typography