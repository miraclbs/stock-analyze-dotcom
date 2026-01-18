import { useState, useCallback } from 'react'
import { generateStockAnalysis } from '@/api'
import type { StockAnalysis } from '@/types'

interface AIAnalysisState {
    isOpen: boolean
    isConfirmOpen: boolean
    loading: boolean
    content: string
    error: string | null
}

interface UseAIAnalysisReturn {
    state: AIAnalysisState
    requestAnalysis: () => void
    confirmAnalysis: () => Promise<void>
    cancelAnalysis: () => void
    closeModal: () => void
}

const INITIAL_STATE: AIAnalysisState = {
    isOpen: false,
    isConfirmOpen: false,
    loading: false,
    content: '',
    error: null
}

/**
 * Hook for managing AI analysis modal state and API calls
 */
export function useAIAnalysis(stock: StockAnalysis): UseAIAnalysisReturn {
    const [state, setState] = useState<AIAnalysisState>(INITIAL_STATE)

    const requestAnalysis = useCallback(() => {
        setState(prev => ({ ...prev, isConfirmOpen: true }))
    }, [])

    const confirmAnalysis = useCallback(async () => {
        setState(prev => ({
            ...prev,
            isConfirmOpen: false,
            isOpen: true,
            loading: true,
            content: '',
            error: null
        }))

        const response = await generateStockAnalysis(stock, stock.symbol)

        if (response.success && response.data) {
            setState(prev => ({
                ...prev,
                loading: false,
                content: response.data as string
            }))
        } else {
            setState(prev => ({
                ...prev,
                loading: false,
                error: response.error || 'Analiz oluşturulurken bir hata oluştu.'
            }))
        }
    }, [stock])

    const cancelAnalysis = useCallback(() => {
        setState(prev => ({ ...prev, isConfirmOpen: false }))
    }, [])

    const closeModal = useCallback(() => {
        setState(INITIAL_STATE)
    }, [])

    return {
        state,
        requestAnalysis,
        confirmAnalysis,
        cancelAnalysis,
        closeModal
    }
}
