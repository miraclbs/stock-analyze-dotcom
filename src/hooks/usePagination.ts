import { useState, useMemo, useCallback } from 'react'
import { PAGINATION } from '@/utils'

interface UsePaginationOptions {
    initialPage?: number
    pageSize?: number
}

interface UsePaginationReturn<T> {
    paginatedData: T[]
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
    setCurrentPage: (page: number) => void
    nextPage: () => void
    prevPage: () => void
    goToFirstPage: () => void
    goToLastPage: () => void
    canGoNext: boolean
    canGoPrev: boolean
    startIndex: number
    endIndex: number
}

/**
 * Hook for client-side pagination
 */
export function usePagination<T>(
    data: T[],
    options?: UsePaginationOptions
): UsePaginationReturn<T> {
    const {
        initialPage = 1,
        pageSize = PAGINATION.DEFAULT_PAGE_SIZE
    } = options || {}

    const [currentPage, setCurrentPage] = useState(initialPage)

    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / pageSize)

    // Reset to page 1 if data changes and current page is invalid
    const validPage = useMemo(() => {
        if (currentPage > totalPages) return 1
        if (currentPage < 1) return 1
        return currentPage
    }, [currentPage, totalPages])

    // Calculate slice indices
    const startIndex = (validPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)

    // Get paginated data
    const paginatedData = useMemo(
        () => data.slice(startIndex, endIndex),
        [data, startIndex, endIndex]
    )

    // Navigation functions
    const nextPage = useCallback(() => {
        if (validPage < totalPages) {
            setCurrentPage(validPage + 1)
        }
    }, [validPage, totalPages])

    const prevPage = useCallback(() => {
        if (validPage > 1) {
            setCurrentPage(validPage - 1)
        }
    }, [validPage])

    const goToFirstPage = useCallback(() => {
        setCurrentPage(1)
    }, [])

    const goToLastPage = useCallback(() => {
        setCurrentPage(totalPages)
    }, [totalPages])

    const handleSetCurrentPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }, [totalPages])

    return {
        paginatedData,
        currentPage: validPage,
        totalPages,
        totalItems,
        pageSize,
        setCurrentPage: handleSetCurrentPage,
        nextPage,
        prevPage,
        goToFirstPage,
        goToLastPage,
        canGoNext: validPage < totalPages,
        canGoPrev: validPage > 1,
        startIndex: startIndex + 1, // 1-indexed for display
        endIndex
    }
}
