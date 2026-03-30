/**
 * Utilitário `cn` — merge seguro de classes Tailwind
 * Combina clsx (lógica condicional) + tailwind-merge (deduplicação).
 *
 * Instalar dependências:
 *   npm install clsx tailwind-merge
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}