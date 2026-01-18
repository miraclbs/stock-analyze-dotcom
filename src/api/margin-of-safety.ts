import { supabase } from './supabase'
import type { MarginOfSafety, ApiResponse } from '../types'

/**
 * Margin of Safety API Service
 */

export type MoSMarket = 'sp500' | 'bist'

interface MoSApiConfig {
    table: string
    title: string
    description: string
}

const MOS_MARKET_CONFIG: Record<MoSMarket, MoSApiConfig> = {
    sp500: {
        table: 'sp500_margin_of_safety',
        title: 'S&P 100 Margin of Safety',
        description: 'S&P 100 hisselerinin güvenlik marjı analizleri'
    },
    bist: {
        table: 'tr_margin_of_safety',
        title: 'BIST Margin of Safety',
        description: 'BIST hisselerinin güvenlik marjı analizleri'
    }
}

/**
 * Fetch margin of safety data for a specific market
 */
export async function fetchMarginOfSafetyData(
    market: MoSMarket = 'sp500'
): Promise<ApiResponse<MarginOfSafety[]>> {
    try {
        const config = MOS_MARKET_CONFIG[market]

        const { data, error } = await supabase
            .from(config.table)
            .select('*')
            .eq('analysis_status', 'valid')
            .not('margin_of_safety_percent', 'is', null)
            .not('intrinsic_value', 'is', null)
            .order('margin_of_safety_percent', { ascending: false })

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
 * Get MoS market configuration
 */
export function getMoSMarketConfig(market: MoSMarket): MoSApiConfig {
    return MOS_MARKET_CONFIG[market]
}

/**
 * Calculate MoS statistics from data
 */
export function calculateMoSStats(data: MarginOfSafety[]) {
    return {
        verySecure: data.filter(item =>
            item.margin_of_safety_percent !== null && item.margin_of_safety_percent >= 30
        ).length,
        secure: data.filter(item =>
            item.margin_of_safety_percent !== null &&
            item.margin_of_safety_percent >= 15 &&
            item.margin_of_safety_percent < 30
        ).length,
        caution: data.filter(item =>
            item.margin_of_safety_percent !== null &&
            item.margin_of_safety_percent >= 5 &&
            item.margin_of_safety_percent < 15
        ).length,
        risky: data.filter(item =>
            item.margin_of_safety_percent !== null && item.margin_of_safety_percent < 5
        ).length,
        total: data.length
    }
}
