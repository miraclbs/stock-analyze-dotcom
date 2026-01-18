/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T> {
    data: T | null
    error: string | null
    success: boolean
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationMeta
}
