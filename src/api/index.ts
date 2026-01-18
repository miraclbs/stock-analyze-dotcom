// Supabase client
export { supabase } from './supabase'

// Stock API
export {
    fetchStocks,
    fetchStockBySymbol,
    getMarketConfig,
    type Market
} from './stocks'

// Margin of Safety API
export {
    fetchMarginOfSafetyData,
    getMoSMarketConfig,
    calculateMoSStats,
    type MoSMarket
} from './margin-of-safety'

// AI API
export {
    generateStockAnalysis,
    isAIConfigured
} from './ai'
