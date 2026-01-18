import { useState, useEffect, useCallback } from 'react'
import { fetchMarginOfSafetyData, calculateMoSStats, type MoSMarket } from '@/api'
import type { MarginOfSafety, MoSStatistics } from '@/types'

interface UseMarginOfSafetyReturn {
    data: MarginOfSafety[]
    stats: MoSStatistics
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
}

const EMPTY_STATS: MoSStatistics = {
    verySecure: 0,
    secure: 0,
    caution: 0,
    risky: 0,
    total: 0
}

/**
 * Hook for fetching margin of safety data
 */
export function useMarginOfSafety(market: MoSMarket = 'sp500'): UseMarginOfSafetyReturn {
    const [data, setData] = useState<MarginOfSafety[]>([])
    const [stats, setStats] = useState<MoSStatistics>(EMPTY_STATS)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        const response = await fetchMarginOfSafetyData(market)

        if (response.success && response.data) {
            setData(response.data)
            setStats(calculateMoSStats(response.data))
        } else {
            setError(response.error || 'Veri alınırken bir hata oluştu')
        }

        setLoading(false)
    }, [market])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return {
        data,
        stats,
        loading,
        error,
        refetch: fetchData
    }
}
