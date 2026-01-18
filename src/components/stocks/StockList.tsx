import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { PageContainer, PageHeader } from '@/components/layout'
import { TablePagination } from '@/components/common/TablePagination'
import { useStocks, useSearch, usePagination } from '@/hooks'
import { extractRatingScore, getRatingBadgeClasses, getSectorColor, MARKETS } from '@/utils'
import type { Market } from '@/api'
import type { StockAnalysis } from '@/types'
import { cn } from '@/lib/utils'

interface StockListProps {
    market: Market
}

/**
 * Generic Stock List component - used by both SP500 and BIST100 pages
 */
export function StockList({ market }: StockListProps) {
    const navigate = useNavigate()
    const marketConfig = MARKETS[market === 'sp500' ? 'SP500' : 'BIST100']

    const { stocks, loading, error, refetch } = useStocks(market)
    const { searchTerm, setSearchTerm, filteredData } = useSearch(
        stocks,
        ['symbol', 'company_name', 'sector']
    )
    const pagination = usePagination(filteredData)

    const handleStockClick = (stock: StockAnalysis) => {
        sessionStorage.setItem('selectedStock', JSON.stringify({ stock, market }))
        navigate(`/stock/${stock.symbol}`)
    }

    if (loading) {
        return (
            <PageContainer>
                <PageHeader
                    title={marketConfig.fullName}
                    description={marketConfig.description}
                />
                <StockListSkeleton />
            </PageContainer>
        )
    }

    if (error) {
        return (
            <PageContainer>
                <PageHeader
                    title={marketConfig.fullName}
                    description={marketConfig.description}
                />
                <Card className="border-destructive">
                    <CardContent className="py-10 text-center">
                        <p className="text-destructive mb-4">{error}</p>
                        <Button onClick={refetch} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Tekrar Dene
                        </Button>
                    </CardContent>
                </Card>
            </PageContainer>
        )
    }

    return (
        <PageContainer>
            <PageHeader
                title={marketConfig.fullName}
                description={marketConfig.description}
            >
                <Button onClick={refetch} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                </Button>
            </PageHeader>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Sembol, şirket adı veya sektör ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {filteredData.length} hisse bulundu
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Desktop Table */}
            <Card className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Sembol</TableHead>
                            <TableHead>Şirket</TableHead>
                            <TableHead>Sektör</TableHead>
                            <TableHead className="text-center w-[120px]">Rating</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.paginatedData.map((stock) => {
                            const score = extractRatingScore(stock.final_rating)
                            return (
                                <TableRow
                                    key={stock.id}
                                    onClick={() => handleStockClick(stock)}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-medium">
                                        {stock.symbol}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">
                                        {stock.company_name}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={cn(getSectorColor(stock.sector))}
                                        >
                                            {stock.sector}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(getRatingBadgeClasses(score))}>
                                            {score.toFixed(1)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {pagination.paginatedData.map((stock) => {
                    const score = extractRatingScore(stock.final_rating)
                    return (
                        <Card
                            key={stock.id}
                            onClick={() => handleStockClick(stock)}
                            className="cursor-pointer trading-card"
                        >
                            <CardContent className="py-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">
                                            {stock.symbol}
                                        </span>
                                        <Badge className={cn(getRatingBadgeClasses(score))}>
                                            {score.toFixed(1)}
                                        </Badge>
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium mb-2 line-clamp-1">
                                    {stock.company_name}
                                </p>
                                <Badge
                                    variant="secondary"
                                    className={cn(getSectorColor(stock.sector))}
                                >
                                    {stock.sector}
                                </Badge>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Pagination */}
            <TablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                startIndex={pagination.startIndex}
                endIndex={pagination.endIndex}
                onPageChange={pagination.setCurrentPage}
                onPrevPage={pagination.prevPage}
                onNextPage={pagination.nextPage}
                canGoPrev={pagination.canGoPrev}
                canGoNext={pagination.canGoNext}
            />
        </PageContainer>
    )
}

function StockListSkeleton() {
    return (
        <Card>
            <CardContent className="py-6">
                <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 flex-1" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-12" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
