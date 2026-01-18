import { useState, useEffect, useCallback } from 'react'
import { fetchStocks, type Market } from '@/api'
import type { StockAnalysis } from '@/types'

interface UseStocksReturn {
    stocks: StockAnalysis[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

/**
 * Hook for fetching stock data from a specific market
 */
export function useStocks(market: Market): UseStocksReturn {
    const [stocks, setStocks] = useState<StockAnalysis[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        const response = await fetchStocks(market)

        if (response.success && response.data) {
            setStocks(response.data)
        } else {
            setError(response.error || 'Veri alınırken bir hata oluştu')
        }

        setLoading(false)
    }, [market])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        stocks,
        loading,
        error,
        refetch: fetchData
    }
}
