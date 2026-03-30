/**
 * Design Tokens — Semânticos
 * Gol Mais Bonito · Campeonato Oficial
 *
 * Camada semântica: nomes de intenção, não de valor.
 * Esses tokens são os que os componentes devem referenciar.
 */

export const semanticTokens = {
    // ─── Página / Layout ────────────────────────────────────────────────────
    page: {
        background: 'var(--color-bg-base)',
        maxWidth: '1280px',
        paddingX: 'var(--spacing-6)',    // 24px mobile
        paddingXDesktop: 'var(--spacing-10)',   // 40px desktop
    },

    // ─── Superfícies ────────────────────────────────────────────────────────
    surface: {
        default: 'var(--color-bg-surface)',
        raised: 'var(--color-bg-raised)',
        overlay: 'var(--color-bg-overlay)',
        hero: 'var(--color-bg-hero)',
    },

    // ─── Texto ──────────────────────────────────────────────────────────────
    text: {
        heading: 'var(--color-text-primary)',
        body: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        accent: 'var(--color-text-accent)',       // amarelo: rodada número
        brand: 'var(--color-brand-blue)',
        onDark: 'var(--color-neutral-0)',
    },

    // ─── Bordas ─────────────────────────────────────────────────────────────
    border: {
        subtle: 'var(--color-border-subtle)',
        default: 'var(--color-border-default)',
        strong: 'var(--color-border-strong)',
        focus: 'var(--color-brand-blue)',
    },

    // ─── Componentes: Navbar ─────────────────────────────────────────────────
    navbar: {
        background: 'var(--color-bg-base)',
        height: '64px',
        borderBottom: '1px solid var(--color-border-subtle)',
        linkColor: 'var(--color-text-secondary)',
        linkActive: 'var(--color-text-primary)',
        linkUnderline: 'var(--color-brand-blue)',
    },

    // ─── Componentes: Button ─────────────────────────────────────────────────
    button: {
        primary: {
            bg: 'var(--color-brand-blue)',
            bgHover: 'var(--color-brand-blue-hover)',
            text: 'var(--color-neutral-0)',
            shadow: 'var(--shadow-glow-blue)',
        },
        secondary: {
            bg: 'transparent',
            bgHover: 'var(--color-bg-raised)',
            text: 'var(--color-neutral-0)',
            border: '1px solid var(--color-border-default)',
        },
        vote: {
            bg: 'var(--color-brand-green)',
            bgHover: 'var(--color-brand-green-hover)',
            text: 'var(--color-neutral-0)',
            shadow: 'var(--shadow-glow-green)',
        },
        height: {
            sm: '32px',
            md: '40px',
            lg: '48px',
        },
        paddingX: {
            sm: 'var(--spacing-3)',
            md: 'var(--spacing-5)',
            lg: 'var(--spacing-6)',
        },
        borderRadius: 'var(--radius-full)',
        fontSize: {
            sm: 'var(--font-size-xs)',
            md: 'var(--font-size-sm)',
            lg: 'var(--font-size-base)',
        },
    },

    // ─── Componentes: Badge ──────────────────────────────────────────────────
    badge: {
        live: {
            bg: 'transparent',
            border: '1px solid var(--color-feedback-live)',
            text: 'var(--color-feedback-live)',
            dot: 'var(--color-feedback-live)',
        },
        golNumber: {
            bg: 'var(--color-brand-blue)',
            text: 'var(--color-neutral-0)',
        },
        countdown: {
            text: 'var(--color-feedback-warning)',
        },
    },

    // ─── Componentes: Card de Gol ────────────────────────────────────────────
    goalCard: {
        bg: 'var(--color-bg-surface)',
        bgHover: 'var(--color-bg-raised)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        borderHover: '1px solid var(--color-border-strong)',
        shadow: 'var(--shadow-md)',
        shadowHover: 'var(--shadow-card-hover)',
        transition: 'all var(--duration-normal) var(--easing-default)',
        thumbnail: {
            aspectRatio: '16/9',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            overlayGradient: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
        },
        footer: {
            padding: 'var(--spacing-4)',
            gap: 'var(--spacing-3)',
        },
        playerName: {
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
        },
        teamName: {
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-brand-green)',
        },
        description: {
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
        },
    },

    // ─── Componentes: Play Button (sobre thumbnail) ──────────────────────────
    playButton: {
        size: '48px',
        bg: 'rgba(255, 255, 255, 0.2)',
        bgHover: 'rgba(255, 255, 255, 0.35)',
        backdrop: 'blur(4px)',
        border: '2px solid rgba(255,255,255,0.5)',
        borderRadius: 'var(--radius-full)',
        iconColor: 'var(--color-neutral-0)',
        iconSize: '20px',
    },

    // ─── Componentes: Hero ───────────────────────────────────────────────────
    hero: {
        minHeight: '340px',
        padding: 'var(--spacing-16) var(--spacing-6)',
        borderRadius: 'var(--radius-xl)',
        overlayGradient: 'linear-gradient(to bottom, rgba(10,14,26,0.5) 0%, rgba(10,14,26,0.75) 100%)',
        title: {
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 'var(--font-weight-black)',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
        },
        accentColor: 'var(--color-brand-yellow)',
    },

    // ─── Componentes: Engagement Section ─────────────────────────────────────
    engagement: {
        bg: 'var(--color-bg-raised)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border-subtle)',
        padding: 'var(--spacing-8)',
        stat: {
            value: {
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-black)',
                fontFamily: 'var(--font-display)',
            },
            label: {
                fontSize: 'var(--font-size-2xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-spacing-widest)',
            },
        },
        progressRing: {
            size: '120px',
            strokeWidth: '8px',
            colorTrack: 'var(--color-border-subtle)',
            colorFill: 'var(--color-brand-blue)',
            shadow: 'var(--shadow-glow-blue)',
        },
    },

    // ─── Componentes: Avatar ─────────────────────────────────────────────────
    avatar: {
        size: {
            sm: '28px',
            md: '36px',
            lg: '44px',
        },
        borderRadius: 'var(--radius-full)',
        border: '2px solid var(--color-border-default)',
        bg: 'var(--color-bg-raised)',
    },

    // ─── Componentes: Section Header ─────────────────────────────────────────
    sectionHeader: {
        accentBar: {
            width: '4px',
            height: '100%',
            color: 'var(--color-brand-yellow)',
            borderRadius: 'var(--radius-full)',
        },
        title: {
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-black)',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
        },
        subtitle: {
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
        },
    },

    // ─── Footer ──────────────────────────────────────────────────────────────
    footer: {
        bg: 'var(--color-bg-base)',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: 'var(--spacing-6) 0',
        textColor: 'var(--color-text-muted)',
        fontSize: 'var(--font-size-xs)',
    },
} as const

export type SemanticTokens = typeof semanticTokens