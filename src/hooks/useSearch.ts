import { useState, useMemo, useCallback } from 'react'

interface UseSearchReturn<T> {
    searchTerm: string
    setSearchTerm: (term: string) => void
    filteredData: T[]
    clearSearch: () => void
    hasSearch: boolean
}

/**
 * Hook for filtering data based on search term
 */
export function useSearch<T>(
    data: T[],
    searchFields: (keyof T)[]
): UseSearchReturn<T> {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) {
            return data
        }

        const lowerSearchTerm = searchTerm.toLowerCase().trim()

        return data.filter(item => {
            return searchFields.some(field => {
                const value = item[field]
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(lowerSearchTerm)
                }
                if (typeof value === 'number') {
                    return value.toString().includes(lowerSearchTerm)
                }
                return false
            })
        })
    }, [data, searchTerm, searchFields])

    const clearSearch = useCallback(() => {
        setSearchTerm('')
    }, [])

    return {
        searchTerm,
        setSearchTerm,
        filteredData,
        clearSearch,
        hasSearch: searchTerm.trim().length > 0
    }
}

