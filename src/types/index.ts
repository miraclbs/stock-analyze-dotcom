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
    price: number
    eps: number
    growth_percent: number
    intrinsic_value: number
    margin_of_safety_percent: number
    inserted_at: string
}