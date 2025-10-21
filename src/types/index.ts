export interface StockAnalysis {
    id: number
    record_date: string
    symbol: string
    company_name: string
    sector: string
    fundamental_analysis: any
    technical_analysis: any
    macro_sector_analysis: any
    behavioral_strategy: any
    portfolio_effect: any
    final_rating: any
    principle_alignment: any
}

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
    analysis_status: 'valid' | 'invalid'
    analysis_comment: string
    market_cap: number
    pe_ratio: number
    created_at: string
    updated_at: string
}