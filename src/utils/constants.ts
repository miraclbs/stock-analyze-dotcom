/**
 * Application Constants
 */

/**
 * Pagination defaults
 */
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const

/**
 * Market configurations
 */
export const MARKETS = {
    SP500: {
        id: 'sp500',
        name: 'S&P 100',
        fullName: 'S&P 100 Hisse Analizleri',
        description: "Amerika'nın en büyük 100 şirketinin AI destekli analizi",
        currency: 'USD' as const
    },
    BIST100: {
        id: 'bist100',
        name: 'BIST 100',
        fullName: 'BIST 100 Hisse Analizleri',
        description: "Türkiye'nin en büyük 100 şirketinin kapsamlı analizi",
        currency: 'TRY' as const
    }
} as const

/**
 * Rating labels
 */
export const RATING_LABELS = {
    EXCELLENT: { min: 8.5, label: 'Mükemmel' },
    GOOD: { min: 7.5, label: 'İyi' },
    FAIR: { min: 6.5, label: 'Orta' },
    POOR: { min: 5.5, label: 'Zayıf' },
    BAD: { min: 4.0, label: 'Kötü' },
    UNKNOWN: { min: 0, label: 'Bilinmiyor' }
} as const

/**
 * Get rating label from score
 */
export function getRatingLabel(score: number): string {
    if (score >= 8.5) return RATING_LABELS.EXCELLENT.label
    if (score >= 7.5) return RATING_LABELS.GOOD.label
    if (score >= 6.5) return RATING_LABELS.FAIR.label
    if (score >= 5.5) return RATING_LABELS.POOR.label
    if (score >= 4.0) return RATING_LABELS.BAD.label
    return RATING_LABELS.UNKNOWN.label
}

/**
 * Navigation items
 */
export const NAV_ITEMS = [
    { id: 'home', label: 'Ana Sayfa', path: '/' },
    { id: 'sp500', label: 'S&P 100', path: '/sp500' },
    { id: 'bist100', label: 'BIST 100', path: '/bist100' },
    { id: 'margin-of-safety', label: 'Margin of Safety', path: '/margin-of-safety' }
] as const

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
    THEME: 'theme',
    SELECTED_STOCK: 'selectedStock'
} as const
