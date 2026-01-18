import OpenAI from 'openai'
import type { StockAnalysis, ApiResponse } from '../types'

/**
 * AI Analysis API Service
 */

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const SYSTEM_PROMPT = `Sen bir profesyonel yatırım danışmanısın. Hisse senedi analizlerinde deneyimlisin ve objektif değerlendirmeler yaparsın.`

const createAnalysisPrompt = (stockData: StockAnalysis, symbol: string): string => `
Aşağıdaki hisse senedi verilerini analiz et ve detaylı bir yatırım analizi hazırla:

Hisse Sembolü: ${symbol}
Şirket Bilgileri: ${JSON.stringify(stockData, null, 2)}

Lütfen şu konularda analiz yap:
1. Kısa vadeli yatırım perspektifi (1-3 ay)
2. Orta vadeli yatırım perspektifi (6-12 ay)
3. Yakın dönem fiyat beklentisi (yükseliş/düşüş potansiyeli)
4. Risk faktörleri ve fırsatlar
5. Teknik analiz özeti
6. Temel analiz değerlendirmesi
7. Sektörel karşılaştırma
8. Makroekonomik faktörlerin etkisi
9. Güncel piyasa koşulları ve haberlerin potansiyel etkisi
10. Yatırım önerisi (AL/SAT/BEKLE) ve gerekçeleri

Analizi Türkçe olarak, net ve anlaşılır bir şekilde hazırla. Objektif ol ve riskleri açık şekilde belirt.
`

/**
 * Generate AI stock analysis
 */
export async function generateStockAnalysis(
    stockData: StockAnalysis,
    symbol: string
): Promise<ApiResponse<string>> {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: createAnalysisPrompt(stockData, symbol) }
            ],
            max_tokens: 4000,
            temperature: 0.7
        })

        const content = completion.choices[0]?.message?.content

        if (!content) {
            return {
                data: null,
                error: 'Analiz oluşturulamadı.',
                success: false
            }
        }

        return {
            data: content,
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
 * Check if OpenAI API is configured
 */
export function isAIConfigured(): boolean {
    return !!import.meta.env.VITE_OPENAI_API_KEY
}
