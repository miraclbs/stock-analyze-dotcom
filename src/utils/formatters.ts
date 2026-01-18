/**
 * Number and Currency Formatting Utilities
 */

/**
 * Format a number as currency
 */
export function formatCurrency(
    value: number | null | undefined,
    currency: 'USD' | 'TRY' = 'USD',
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A'
    }

    const { minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {}

    const formatter = new Intl.NumberFormat(currency === 'TRY' ? 'tr-TR' : 'en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits,
        maximumFractionDigits
    })

    return formatter.format(value)
}

/**
 * Format a number as percentage
 */
export function formatPercent(
    value: number | null | undefined,
    decimals: number = 1,
    showSign: boolean = false
): string {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A'
    }

    const formatted = value.toFixed(decimals)
    const sign = showSign && value > 0 ? '+' : ''
    return `${sign}${formatted}%`
}

/**
 * Format large numbers with suffix (B, M, K)
 */
export function formatLargeNumber(
    value: number | null | undefined,
    options?: { decimals?: number; currency?: 'USD' | 'TRY' }
): string {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A'
    }

    const { decimals = 2, currency } = options || {}
    const prefix = currency === 'USD' ? '$' : currency === 'TRY' ? '₺' : ''

    const absValue = Math.abs(value)
    const sign = value < 0 ? '-' : ''

    if (absValue >= 1e12) {
        return `${sign}${prefix}${(absValue / 1e12).toFixed(decimals)}T`
    }
    if (absValue >= 1e9) {
        return `${sign}${prefix}${(absValue / 1e9).toFixed(decimals)}B`
    }
    if (absValue >= 1e6) {
        return `${sign}${prefix}${(absValue / 1e6).toFixed(decimals)}M`
    }
    if (absValue >= 1e3) {
        return `${sign}${prefix}${(absValue / 1e3).toFixed(decimals)}K`
    }

    return `${sign}${prefix}${absValue.toFixed(decimals)}`
}

/**
 * Format a decimal number with fixed precision
 */
export function formatNumber(
    value: number | null | undefined,
    decimals: number = 2
): string {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A'
    }
    return value.toFixed(decimals)
}

/**
 * Format date
 */
export function formatDate(
    date: string | Date | null | undefined,
    locale: 'tr-TR' | 'en-US' = 'tr-TR'
): string {
    if (!date) return 'N/A'

    try {
        const d = typeof date === 'string' ? new Date(date) : date
        return d.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return 'N/A'
    }
}
