/**
 * Fundamental Analysis Types
 */
export interface ValuationMetrics {
    pe_ratio: number | null
    pb_ratio: number | null
    roe: number | null
    roa: number | null
    margin_of_safety: string | null
    net_margin_pct: number | null
    debt_to_equity: number | null
}

export interface FundamentalAnalysis {
    valuation: ValuationMetrics | null
    summary: string | null
    quality_score: number | null
}

/**
 * Technical Analysis Types
 */
export interface SupportResistance {
    support: number | null
    resistance: number | null
}

export interface TechnicalAnalysis {
    trend: string | null
    signal: string | null
    rsi: number | null
    support_resistance: SupportResistance | null
    long_term_view: string | null
    moving_averages: {
        ma20: number | null
        ma50: number | null
        ma200: number | null
    } | null
}

/**
 * Macro/Sector Analysis Types
 */
export interface MacroSectorAnalysis {
    sector_trend: string | null
    economic_context: string | null
    market_sentiment: string | null
}

/**
 * Behavioral Strategy Types
 */
export interface BehavioralStrategy {
    long_term_action: string | null
    short_term_action: string | null
    risk_tolerance: string | null
}

/**
 * Portfolio Effect Types
 */
export interface PortfolioEffect {
    risk_level: string | null
    suggested_weight: string | null
    diversification_impact: string | null
}

/**
 * Final Rating Types
 */
export interface FinalRating {
    status: string | null
    score: number | null
    final_score: number | null
    recommendation: string | null
}

/**
 * Principle Alignment Types
 */
export interface PrincipleAlignment {
    [expert: string]: string
}

/**
 * Main Stock Analysis Type
 * Supports both nested JSON format and flat database fields
 */
export interface StockAnalysis {
    id: number
    record_date?: string
    symbol: string
    company_name: string
    sector: string
    industry?: string

    // Nested JSON format (legacy)
    fundamental_analysis?: FundamentalAnalysis | string | null
    technical_analysis?: TechnicalAnalysis | string | null
    macro_sector_analysis?: MacroSectorAnalysis | string | null
    behavioral_strategy?: BehavioralStrategy | string | null
    portfolio_effect?: PortfolioEffect | string | null
    final_rating?: FinalRating | string | null
    principle_alignment?: PrincipleAlignment | string | null

    // Flat database fields (new AI analysis tables)
    fundamental_summary?: string
    pe_ratio?: number
    pb_ratio?: number
    ev_ebitda?: number
    debt_to_equity?: number
    roe?: number
    net_margin_pct?: number
    margin_of_safety?: string
    fundamental_commentary?: string

    trend?: string
    rsi?: number
    technical_signal?: string
    support_level?: number
    resistance_level?: number
    short_term_view?: string
    long_term_view?: string

    economic_context?: string
    sector_trend?: string
    recent_headlines?: string | string[]

    investor_emotion?: string
    short_term_action?: string
    long_term_action?: string

    suggested_weight?: string
    risk_level?: string
    portfolio_role?: string

    final_status?: string
    final_score?: number
    final_summary?: string

    principle_graham?: string
    principle_buffett?: string
    principle_siegel?: string
    principle_malkiel?: string
    principle_housel?: string

    raw_analysis?: string | object
}

/**
 * Stock Summary (for list views)
 */
export interface StockSummary {
    id: number
    symbol: string
    company_name: string
    sector: string
    score: number
}
