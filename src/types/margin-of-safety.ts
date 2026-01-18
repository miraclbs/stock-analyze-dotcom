/**
 * Margin of Safety Types
 */

export type AnalysisStatus = 'valid' | 'invalid' | 'no_data'

export interface MarginOfSafety {
    id: number
    symbol: string
    company_name: string
    sector: string
    industry: string
    price: number
    eps: number
    growth_percent: number | null
    intrinsic_value: number | null
    margin_of_safety_percent: number | null
    analysis_status: AnalysisStatus
    analysis_comment: string
    market_cap: number
    pe_ratio: number
    // NEW: Scoring fields
    piotroski_score: number | null
    value_score: number | null
    quality_score: number | null
    technical_score: number | null
    composite_score: number | null
    investment_rating: string | null
    risk_level: string | null
    recommendation: string | null
    created_at: string
    updated_at: string
}

/**
 * Margin of Safety Statistics
 */
export interface MoSStatistics {
    verySecure: number
    secure: number
    caution: number
    risky: number
    total: number
}

/**
 * Margin Level for categorization
 */
export type MarginLevel = 'very-secure' | 'secure' | 'caution' | 'risky' | 'dangerous'

/**
 * Get margin level from percentage
 */
export function getMarginLevel(marginPercent: number | null): MarginLevel {
    if (marginPercent === null) return 'dangerous'
    if (marginPercent >= 30) return 'very-secure'
    if (marginPercent >= 15) return 'secure'
    if (marginPercent >= 5) return 'caution'
    if (marginPercent >= 0) return 'risky'
    return 'dangerous'
}

/**
 * Get margin label in Turkish
 */
export function getMarginLabel(marginPercent: number | null): string {
    const level = getMarginLevel(marginPercent)
    const labels: Record<MarginLevel, string> = {
        'very-secure': 'Çok Güvenli',
        'secure': 'Güvenli',
        'caution': 'Dikkatli',
        'risky': 'Riskli',
        'dangerous': 'Tehlikeli'
    }
    return labels[level]
}
