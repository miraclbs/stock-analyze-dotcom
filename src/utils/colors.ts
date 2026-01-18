/**
 * Color Utilities for Trading/Finance UI
 */

import { cn } from '@/lib/utils'

/**
 * Rating score thresholds and colors
 */
const RATING_THRESHOLDS = [
    { min: 8.5, bg: 'bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/30' },
    { min: 7.5, bg: 'bg-lime-500/20', text: 'text-lime-500', border: 'border-lime-500/30' },
    { min: 6.5, bg: 'bg-yellow-500/20', text: 'text-yellow-500', border: 'border-yellow-500/30' },
    { min: 5.5, bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/30' },
    { min: 4.0, bg: 'bg-red-500/20', text: 'text-red-500', border: 'border-red-500/30' },
    { min: 0, bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' }
] as const

/**
 * Margin of Safety thresholds and colors
 */
const MARGIN_THRESHOLDS = [
    { min: 30, bg: 'bg-emerald-500/20', text: 'text-emerald-500', label: 'Çok Güvenli' },
    { min: 15, bg: 'bg-lime-500/20', text: 'text-lime-500', label: 'Güvenli' },
    { min: 5, bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Dikkatli' },
    { min: 0, bg: 'bg-orange-500/20', text: 'text-orange-500', label: 'Riskli' },
    { min: -Infinity, bg: 'bg-red-500/20', text: 'text-red-500', label: 'Tehlikeli' }
] as const

/**
 * Get rating score color classes
 */
export function getRatingColorClasses(score: number): {
    bg: string
    text: string
    border: string
} {
    for (const threshold of RATING_THRESHOLDS) {
        if (score >= threshold.min) {
            return {
                bg: threshold.bg,
                text: threshold.text,
                border: threshold.border
            }
        }
    }
    return RATING_THRESHOLDS[RATING_THRESHOLDS.length - 1]
}

/**
 * Get combined rating badge classes
 */
export function getRatingBadgeClasses(score: number): string {
    const colors = getRatingColorClasses(score)
    return cn(colors.bg, colors.text, colors.border, 'border')
}

/**
 * Get margin of safety color classes
 */
export function getMarginColorClasses(marginPercent: number | null): {
    bg: string
    text: string
    label: string
} {
    const value = marginPercent ?? -Infinity
    for (const threshold of MARGIN_THRESHOLDS) {
        if (value >= threshold.min) {
            return {
                bg: threshold.bg,
                text: threshold.text,
                label: threshold.label
            }
        }
    }
    return MARGIN_THRESHOLDS[MARGIN_THRESHOLDS.length - 1]
}

/**
 * Get gain/loss color based on value
 */
export function getValueChangeColor(value: number | null): string {
    if (value === null) return 'text-muted-foreground'
    if (value > 0) return 'text-gain'
    if (value < 0) return 'text-loss'
    return 'text-muted-foreground'
}

/**
 * Get gain/loss background color based on value
 */
export function getValueChangeBgColor(value: number | null): string {
    if (value === null) return 'bg-muted'
    if (value > 0) return 'bg-gain/10'
    if (value < 0) return 'bg-loss/10'
    return 'bg-muted'
}

/**
 * Get trend color (for UP/DOWN/Sideways)
 */
export function getTrendColor(trend: string | null): string {
    if (!trend) return 'text-muted-foreground'
    const trendLower = trend.toLowerCase()
    if (trendLower.includes('up') || trendLower.includes('bullish')) return 'text-gain'
    if (trendLower.includes('down') || trendLower.includes('bearish')) return 'text-loss'
    return 'text-yellow-500'
}

/**
 * Get sector color (consistent color for same sector)
 */
const SECTOR_COLORS = [
    'bg-blue-500/20 text-blue-500',
    'bg-purple-500/20 text-purple-500',
    'bg-cyan-500/20 text-cyan-500',
    'bg-pink-500/20 text-pink-500',
    'bg-indigo-500/20 text-indigo-500',
    'bg-teal-500/20 text-teal-500',
    'bg-amber-500/20 text-amber-500',
    'bg-rose-500/20 text-rose-500'
] as const

export function getSectorColor(sector: string): string {
    const hash = sector.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return SECTOR_COLORS[hash % SECTOR_COLORS.length]
}
