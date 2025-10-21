import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

export async function generateStockAnalysis(stockData: any, symbol: string): Promise<string> {
    const prompt = `
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

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Sen bir profesyonel yatırım danışmanısın. Hisse senedi analizlerinde deneyimlisin ve objektif değerlendirmeler yaparsın."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 3000,
            temperature: 0.7
        })

        return completion.choices[0]?.message?.content || 'Analiz oluşturulamadı.'
    } catch (error) {
        console.error('OpenAI analiz hatası:', error)
        throw new Error('AI analizi oluşturulurken bir hata oluştu.')
    }
}