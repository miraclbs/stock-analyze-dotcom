/**
 * JSON and Data Parsing Utilities
 */

import type { FinalRating } from '@/types'

/**
 * Safely parse JSON with fallback
 */
export function safeJSONParse<T>(value: unknown, fallback: T): T {
    if (value === null || value === undefined) {
        return fallback
    }

    if (typeof value === 'object') {
        return value as T
    }

    if (typeof value === 'string') {
        try {
            return JSON.parse(value) as T
        } catch {
            return fallback
        }
    }

    return fallback
}

/**
 * Extract rating score from various formats
 * Handles: number, string, JSON object with score/final_score
 */
export function extractRatingScore(finalRating: unknown): number {
    if (finalRating === null || finalRating === undefined) {
        return 0
    }

    // Direct number
    if (typeof finalRating === 'number') {
        return isNaN(finalRating) ? 0 : finalRating
    }

    // String that might be a number or JSON
    if (typeof finalRating === 'string') {
        // Try parsing as direct number
        const directNumber = parseFloat(finalRating)
        if (!isNaN(directNumber)) {
            return directNumber
        }

        // Try parsing as JSON
        try {
            const parsed = JSON.parse(finalRating)
            return extractRatingScore(parsed)
        } catch {
            // Try extracting number from string
            const match = finalRating.match(/\d+\.?\d*/)
            if (match) {
                const extracted = parseFloat(match[0])
                return isNaN(extracted) ? 0 : extracted
            }
            return 0
        }
    }

    // Object with score property
    if (typeof finalRating === 'object') {
        const rating = finalRating as Record<string, unknown>

        // Check common score property names
        const scoreProperties = ['score', 'final_score', 'rating']
        for (const prop of scoreProperties) {
            if (prop in rating && rating[prop] !== undefined) {
                const score = parseFloat(String(rating[prop]))
                if (!isNaN(score)) {
                    return score
                }
            }
        }

        // Check nested analysis.final_score
        if ('analysis' in rating && typeof rating.analysis === 'object' && rating.analysis !== null) {
            const analysis = rating.analysis as Record<string, unknown>
            if ('final_score' in analysis) {
                const score = parseFloat(String(analysis.final_score))
                if (!isNaN(score)) {
                    return score
                }
            }
        }
    }

    return 0
}

/**
 * Parse analysis data (handles both JSON string and object)
 */
export function parseAnalysisData<T>(data: T | string | null | undefined): T | null {
    if (data === null || data === undefined) {
        return null
    }

    if (typeof data === 'string') {
        try {
            return JSON.parse(data) as T
        } catch {
            return null
        }
    }

    return data as T
}

/**
 * Get final rating object safely
 */
export function parseFinalRating(data: unknown): FinalRating | null {
    const parsed = safeJSONParse<FinalRating | null>(data, null)
    if (!parsed) return null

    return {
        status: parsed.status ?? null,
        score: parsed.score ?? parsed.final_score ?? null,
        final_score: parsed.final_score ?? parsed.score ?? null,
        recommendation: parsed.recommendation ?? null
    }
}
