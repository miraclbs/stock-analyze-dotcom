import type { StockAnalysis, ApiResponse } from '../types'

/**
 * AI Analysis API Service
 * Calls the server-side API proxy to keep the OpenAI key secure
 */

/**
 * Generate AI stock analysis via server-side proxy
 */
export async function generateStockAnalysis(
    stockData: StockAnalysis,
    symbol: string
): Promise<ApiResponse<string>> {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stockData, symbol })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
            return {
                data: null,
                error: result.error || 'Analiz oluşturulamadı.',
                success: false
            }
        }

        return {
            data: result.data,
            error: null,
            success: true
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'AI analizi oluşturulurken bir hata oluştu.'
        return {
            data: null,
            error: errorMessage,
            success: false
        }
    }
}

/**
 * Check if AI analysis is available (always true now since it's server-side)
 */
export function isAIConfigured(): boolean {
    return true
}
