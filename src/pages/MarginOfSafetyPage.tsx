import { Search, Shield, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
import { useMarginOfSafety, useSearch, usePagination } from '@/hooks'
import { formatCurrency, formatPercent, getMarginColorClasses } from '@/utils'
import type { MarginOfSafety } from '@/types'
import { cn } from '@/lib/utils'

/**
 * Margin of Safety Page - Benjamin Graham analysis
 */
export function MarginOfSafetyPage() {
    const { data, stats, loading, error, refetch } = useMarginOfSafety('sp500')
    const { searchTerm, setSearchTerm, filteredData } = useSearch(
        data,
        ['symbol', 'company_name', 'sector']
    )
    const pagination = usePagination(filteredData)

    if (loading) {
        return (
            <PageContainer>
                <PageHeader
                    title="Margin of Safety Analizi"
                    description="Benjamin Graham'ın güvenlik marjı analizi ile değerli hisseleri keşfedin"
                />
                <MarginOfSafetySkeleton />
            </PageContainer>
        )
    }

    if (error) {
        return (
            <PageContainer>
                <PageHeader
                    title="Margin of Safety Analizi"
                    description="Benjamin Graham'ın güvenlik marjı analizi ile değerli hisseleri keşfedin"
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
                title="Margin of Safety Analizi"
                description="S&P 100 hisselerinin Benjamin Graham güvenlik marjı analizi"
            >
                <Button onClick={refetch} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Yenile
                </Button>
            </PageHeader>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Çok Güvenli"
                    value={stats.verySecure}
                    icon={<Shield className="h-5 w-5" />}
                    colorClass="text-emerald-500 bg-emerald-500/10"
                />
                <StatCard
                    title="Güvenli"
                    value={stats.secure}
                    icon={<Shield className="h-5 w-5" />}
                    colorClass="text-lime-500 bg-lime-500/10"
                />
                <StatCard
                    title="Dikkatli"
                    value={stats.caution}
                    icon={<Shield className="h-5 w-5" />}
                    colorClass="text-yellow-500 bg-yellow-500/10"
                />
                <StatCard
                    title="Riskli"
                    value={stats.risky}
                    icon={<Shield className="h-5 w-5" />}
                    colorClass="text-red-500 bg-red-500/10"
                />
            </div>

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
            <Card className="hidden lg:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Sembol</TableHead>
                            <TableHead>Şirket</TableHead>
                            <TableHead className="text-center">Skor</TableHead>
                            <TableHead className="text-center">Rating</TableHead>
                            <TableHead className="text-center">Öneri</TableHead>
                            <TableHead className="text-center">MoS %</TableHead>
                            <TableHead className="text-right">Fiyat</TableHead>
                            <TableHead className="text-right">İçsel Değer</TableHead>
                            <TableHead className="text-right">P/E</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.paginatedData.map((item) => (
                            <MoSTableRow key={item.id} item={item} />
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
                {pagination.paginatedData.map((item) => (
                    <MoSCard key={item.id} item={item} />
                ))}
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

// Stat Card Component
interface StatCardProps {
    title: string
    value: number
    icon: React.ReactNode
    colorClass: string
}

function StatCard({ title, value, icon, colorClass }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorClass)}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}

// Table Row Component
function MoSTableRow({ item }: { item: MarginOfSafety }) {
    const marginColors = getMarginColorClasses(item.margin_of_safety_percent)
    const isPositive = (item.margin_of_safety_percent ?? 0) >= 0

    // Rating color helper
    const getRatingColor = (rating: string | null) => {
        if (!rating) return 'text-muted-foreground'
        if (rating.startsWith('A')) return 'text-emerald-500 bg-emerald-500/10'
        if (rating.startsWith('B')) return 'text-blue-500 bg-blue-500/10'
        if (rating === 'C') return 'text-yellow-500 bg-yellow-500/10'
        return 'text-red-500 bg-red-500/10'
    }

    // Recommendation color helper
    const getRecommendationColor = (rec: string | null) => {
        if (!rec) return ''
        if (rec.includes('Buy')) return 'text-emerald-600'
        if (rec === 'Hold') return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{item.symbol}</TableCell>
            <TableCell className="max-w-[180px] truncate">{item.company_name}</TableCell>
            <TableCell className="text-center">
                <span className="font-bold text-lg">
                    {item.composite_score?.toFixed(0) ?? '-'}
                </span>
            </TableCell>
            <TableCell className="text-center">
                <Badge className={cn(getRatingColor(item.investment_rating), 'border-0 font-bold')}>
                    {item.investment_rating ?? '-'}
                </Badge>
            </TableCell>
            <TableCell className="text-center">
                <span className={cn('font-medium text-sm', getRecommendationColor(item.recommendation))}>
                    {item.recommendation ?? '-'}
                </span>
            </TableCell>
            <TableCell className="text-center">
                <Badge className={cn(marginColors.bg, marginColors.text, 'border-0')}>
                    <span className="flex items-center gap-1">
                        {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        {formatPercent(item.margin_of_safety_percent, 1, true)}
                    </span>
                </Badge>
            </TableCell>
            <TableCell className="text-right font-mono">
                {formatCurrency(item.price)}
            </TableCell>
            <TableCell className="text-right font-mono">
                {formatCurrency(item.intrinsic_value)}
            </TableCell>
            <TableCell className="text-right font-mono">
                {item.pe_ratio?.toFixed(1) ?? '-'}
            </TableCell>
        </TableRow>
    )
}

// Mobile Card Component
function MoSCard({ item }: { item: MarginOfSafety }) {
    const marginColors = getMarginColorClasses(item.margin_of_safety_percent)
    const isPositive = (item.margin_of_safety_percent ?? 0) >= 0

    const getRatingColor = (rating: string | null) => {
        if (!rating) return 'text-muted-foreground'
        if (rating.startsWith('A')) return 'text-emerald-500 bg-emerald-500/10'
        if (rating.startsWith('B')) return 'text-blue-500 bg-blue-500/10'
        if (rating === 'C') return 'text-yellow-500 bg-yellow-500/10'
        return 'text-red-500 bg-red-500/10'
    }

    const getRecommendationColor = (rec: string | null) => {
        if (!rec) return ''
        if (rec.includes('Buy')) return 'text-emerald-600'
        if (rec === 'Hold') return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <Card className="trading-card">
            <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{item.symbol}</span>
                        <span className="text-2xl font-bold">{item.composite_score?.toFixed(0) ?? '-'}</span>
                        <Badge className={cn(getRatingColor(item.investment_rating), 'border-0 font-bold')}>
                            {item.investment_rating ?? '-'}
                        </Badge>
                    </div>
                    <span className={cn('font-semibold', getRecommendationColor(item.recommendation))}>
                        {item.recommendation ?? '-'}
                    </span>
                </div>

                <p className="text-sm font-medium mb-3 line-clamp-1">{item.company_name}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">MoS:</span>
                        <Badge className={cn(marginColors.bg, marginColors.text, 'border-0 text-xs')}>
                            {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                            {formatPercent(item.margin_of_safety_percent, 1, true)}
                        </Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Fiyat:</span>
                        <span className="font-mono">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">İçsel:</span>
                        <span className="font-mono">{formatCurrency(item.intrinsic_value)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">P/E:</span>
                        <span className="font-mono">{item.pe_ratio?.toFixed(1) ?? '-'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Skeleton
function MarginOfSafetySkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="py-6">
                            <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-8 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardContent className="py-6">
                    <div className="space-y-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 flex-1" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
