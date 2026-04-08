/**
 * OpenAI API Service (via server-side proxy)
 * API key is kept secure on the server - never exposed to the browser
 */

export async function generateStockAnalysis(stockData: any, symbol: string): Promise<string> {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stockData, symbol })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Analiz oluşturulamadı.')
        }

        return result.data || 'Analiz oluşturulamadı.'
    } catch (error) {
        console.error('AI analiz hatası:', error)
        throw new Error('AI analizi oluşturulurken bir hata oluştu.')
    }
}