/**
 * Design Tokens — Spacing, Radius, Shadows, Z-index, Animation
 * Gol Mais Bonito · Campeonato Oficial
 */

// ─── Spacing scale (base 4px) ─────────────────────────────────────────────
export const spacing = {
    px: '1px',
    0: '0px',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
} as const

// ─── Border Radius ────────────────────────────────────────────────────────
export const borderRadius = {
    none: '0px',
    xs: '2px',
    sm: '4px',
    md: '8px',     // cards de jogadores
    lg: '12px',    // cards principais
    xl: '16px',    // seção de engajamento
    '2xl': '20px',
    full: '9999px',  // badges, avatares, botão pill
} as const

// ─── Shadows ──────────────────────────────────────────────────────────────
export const boxShadow = {
    none: 'none',
    sm: '0 1px 2px rgb(0 0 0 / 0.4)',
    md: '0 4px 12px rgb(0 0 0 / 0.5)',
    lg: '0 8px 24px rgb(0 0 0 / 0.6)',
    xl: '0 16px 40px rgb(0 0 0 / 0.7)',
    // Glow effects para elementos de destaque
    'glow-blue': '0 0 20px rgb(21 101 255 / 0.5)',
    'glow-green': '0 0 20px rgb(0 200 83 / 0.5)',
    'glow-yellow': '0 0 20px rgb(255 214 0 / 0.4)',
    // Card hover state
    'card-hover': '0 8px 32px rgb(0 0 0 / 0.7), 0 0 0 1px rgb(21 101 255 / 0.3)',
} as const

// ─── Z-index ──────────────────────────────────────────────────────────────
export const zIndex = {
    hide: '-1',
    base: '0',
    raised: '10',
    overlay: '20',
    dropdown: '30',
    sticky: '40',
    navbar: '50',
    modal: '60',
    toast: '70',
    tooltip: '80',
} as const

// ─── Breakpoints ──────────────────────────────────────────────────────────
export const screens = {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
} as const

// ─── Animation / Transition ───────────────────────────────────────────────
export const animation = {
    duration: {
        instant: '0ms',
        fast: '100ms',
        normal: '200ms',
        slow: '350ms',
        slower: '500ms',
    },
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
} as const

export type Spacing = typeof spacing
export type BorderRadius = typeof borderRadius
export type BoxShadow = typeof boxShadow
export type ZIndex = typeof zIndex
export type Screens = typeof screens
export type Animation = typeof animation