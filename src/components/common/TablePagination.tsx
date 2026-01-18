import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    startIndex: number
    endIndex: number
    onPageChange: (page: number) => void
    onPrevPage: () => void
    onNextPage: () => void
    canGoPrev: boolean
    canGoNext: boolean
    className?: string
}

/**
 * Reusable table pagination component
 */
export function TablePagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPageChange,
    onPrevPage,
    onNextPage,
    canGoPrev,
    canGoNext,
    className
}: TablePaginationProps) {
    if (totalPages <= 1) return null

    // Generate page numbers to display
    const getPageNumbers = (): number[] => {
        const pages: number[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            let start = Math.max(1, currentPage - 2)
            const end = Math.min(totalPages, start + maxVisible - 1)

            if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1)
            }

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
        }

        return pages
    }

    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mt-4',
                className
            )}
        >
            {/* Info */}
            <div className="text-sm text-muted-foreground">
                <span className="font-medium">{startIndex}</span>
                {' - '}
                <span className="font-medium">{endIndex}</span>
                {' / '}
                <span className="font-medium">{totalItems}</span>
                {' sonuç gösteriliyor'}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onPrevPage}
                    disabled={!canGoPrev}
                    className="h-8 w-8"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((pageNum) => (
                    <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="h-8 w-8 p-0"
                    >
                        {pageNum}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    onClick={onNextPage}
                    disabled={!canGoNext}
                    className="h-8 w-8"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
