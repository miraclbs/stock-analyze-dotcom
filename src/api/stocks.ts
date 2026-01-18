import { supabase } from './supabase'
import type { StockAnalysis, ApiResponse } from '../types'

/**
 * Stock API Service
 * Centralized API calls for stock data
 */

export type Market = 'sp500' | 'bist100'

interface StockApiConfig {
    table: string
    title: string
    description: string
}

const MARKET_CONFIG: Record<Market, StockApiConfig> = {
    sp500: {
        table: 'ai_analyze_sp',
        title: 'S&P 100 Hisse Analizleri',
        description: "Amerika'nın en büyük 100 şirketinin AI destekli analizi"
    },
    bist100: {
        table: 'ai_analyze_tr',
        title: 'BIST 100 Hisse Analizleri',
        description: "Türkiye'nin en büyük 100 şirketinin kapsamlı analizi"
    }
}

/**
 * Fetch all stocks for a specific market
 */
export async function fetchStocks(market: Market): Promise<ApiResponse<StockAnalysis[]>> {
    try {
        const config = MARKET_CONFIG[market]

        const { data, error } = await supabase
            .from(config.table)
            .select('*')
            .order('symbol', { ascending: true })

        if (error) {
            return {
                data: null,
                error: error.message,
                success: false
            }
        }

        return {
            data: data || [],
            error: null,
            success: true
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        return {
            data: null,
            error: errorMessage,
            success: false
        }
    }
}

/**
 * Get market configuration
 */
export function getMarketConfig(market: Market): StockApiConfig {
    return MARKET_CONFIG[market]
}

/**
 * Fetch a single stock by symbol
 */
export async function fetchStockBySymbol(
    symbol: string,
    market: Market
): Promise<ApiResponse<StockAnalysis>> {
    try {
        const config = MARKET_CONFIG[market]

        const { data, error } = await supabase
            .from(config.table)
            .select('*')
            .eq('symbol', symbol)
            .single()

        if (error) {
            return {
                data: null,
                error: error.message,
                success: false
            }
        }

        return {
            data,
            error: null,
            success: true
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        return {
            data: null,
            error: errorMessage,
            success: false
        }
    }
}
