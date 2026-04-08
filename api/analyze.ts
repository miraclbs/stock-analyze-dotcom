import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `Sen bir profesyonel yatırım danışmanısın. Hisse senedi analizlerinde deneyimlisin ve objektif değerlendirmeler yaparsın.`

const createAnalysisPrompt = (stockData: any, symbol: string): string => `
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Validate API key exists on server
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key is not configured on the server.' })
    }

    const { stockData, symbol } = req.body

    if (!stockData || !symbol) {
        return res.status(400).json({ error: 'Missing stockData or symbol in request body.' })
    }

    try {
        const openai = new OpenAI({ apiKey })

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
            return res.status(500).json({ error: 'Analiz oluşturulamadı.' })
        }

        return res.status(200).json({ data: content, success: true })
    } catch (err: any) {
        console.error('OpenAI API error:', err.message)
        return res.status(500).json({
            error: err.message || 'AI analizi oluşturulurken bir hata oluştu.',
            success: false
        })
    }
}
