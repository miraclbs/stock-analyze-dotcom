import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
    ArrowLeft,
    Brain,
    Loader2,
    AlertCircle,
    TrendingUp,
    BarChart3,
    Globe,
    Target,
    Shield,
    Users,
    Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageContainer } from '@/components/layout'
import { useAIAnalysis } from '@/hooks'
import {
    extractRatingScore,
    getRatingBadgeClasses,
    getRatingLabel,
    getSectorColor
} from '@/utils'
import type { StockAnalysis } from '@/types'
import type { Market } from '@/api'
import { cn } from '@/lib/utils'

interface StockDetailPageProps {
    stock: StockAnalysis
    market: Market
    onBack: () => void
}

/**
 * Stock Detail Page - Shows comprehensive stock analysis (full data, no tabs)
 */
export function StockDetailPage({ stock, market, onBack }: StockDetailPageProps) {
    // Calculate score - try flat field first, then nested JSON
    const score = stock.final_score ?? extractRatingScore(stock.final_rating)
    const { state, requestAnalysis, confirmAnalysis, cancelAnalysis, closeModal } = useAIAnalysis(stock)

    // Parse nested JSON (legacy format)
    const parseJSON = (data: unknown): Record<string, unknown> | null => {
        if (!data) return null
        if (typeof data === 'object') return data as Record<string, unknown>
        try {
            return JSON.parse(String(data))
        } catch {
            return null
        }
    }

    // Helper to safely get string value
    const getString = (obj: Record<string, unknown> | null | undefined, key: string): string | null => {
        if (!obj) return null
        const value = obj[key]
        if (value === null || value === undefined) return null
        return String(value)
    }

    // Build data from flat fields OR fallback to nested JSON
    const fundamentalAnalysis = parseJSON(stock.fundamental_analysis)
    const technicalAnalysis = parseJSON(stock.technical_analysis)
    const macroSectorAnalysis = parseJSON(stock.macro_sector_analysis)
    const behavioralStrategy = parseJSON(stock.behavioral_strategy)
    const portfolioEffect = parseJSON(stock.portfolio_effect)
    const finalRating = parseJSON(stock.final_rating)
    const principleAlignmentNested = parseJSON(stock.principle_alignment) as Record<string, string> | null

    // Build valuation object from flat fields or nested
    const valuation = stock.pe_ratio !== undefined ? {
        pe_ratio: stock.pe_ratio,
        pb_ratio: stock.pb_ratio,
        roe: stock.roe,
        roa: null,
        net_margin_pct: stock.net_margin_pct,
        debt_to_equity: stock.debt_to_equity,
        margin_of_safety: stock.margin_of_safety
    } : (fundamentalAnalysis?.valuation as Record<string, unknown> | undefined)

    // Build technical data from flat fields or nested
    const techData = stock.trend !== undefined ? {
        trend: stock.trend,
        rsi: stock.rsi,
        signal: stock.technical_signal,
        support_resistance: stock.support_level ? { support: stock.support_level, resistance: stock.resistance_level } : null,
        long_term_view: stock.long_term_view,
        short_term_view: stock.short_term_view
    } : technicalAnalysis

    // Build behavioral data from flat fields or nested
    const behavioralData: { long_term_action?: string; short_term_action?: string; investor_emotion?: string } | Record<string, unknown> | null = stock.long_term_action !== undefined ? {
        long_term_action: stock.long_term_action,
        short_term_action: stock.short_term_action,
        investor_emotion: stock.investor_emotion
    } : behavioralStrategy

    // Build macro data from flat fields or nested
    const macroData = stock.sector_trend !== undefined ? {
        sector_trend: stock.sector_trend,
        economic_context: stock.economic_context,
        recent_headlines: stock.recent_headlines
    } : macroSectorAnalysis

    // Build portfolio data from flat fields or nested
    const portfolioData = stock.risk_level !== undefined ? {
        risk_level: stock.risk_level,
        suggested_weight: stock.suggested_weight,
        role: stock.portfolio_role
    } : portfolioEffect

    // Build final rating from flat fields or nested
    const finalData = stock.final_status !== undefined ? {
        status: stock.final_status,
        score: stock.final_score,
        summary: stock.final_summary
    } : finalRating

    // Build principle alignment from flat fields or nested
    const principleAlignment = stock.principle_graham !== undefined ? {
        Benjamin_Graham: stock.principle_graham || '',
        Warren_Buffett: stock.principle_buffett || '',
        Jeremy_Siegel: stock.principle_siegel || '',
        Burton_Malkiel: stock.principle_malkiel || '',
        Morgan_Housel: stock.principle_housel || ''
    } : principleAlignmentNested

    // Fundamental summary from flat or nested
    const fundamentalSummary = stock.fundamental_summary || (fundamentalAnalysis?.summary as string | undefined)

    const supportResistance = techData?.support_resistance as Record<string, unknown> | undefined

    return (
        <PageContainer>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={onBack} className="self-start">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">{stock.symbol}</h1>
                        <Badge className={cn(getRatingBadgeClasses(score), 'text-base px-3 py-1')}>
                            {score.toFixed(1)} - {getRatingLabel(score)}
                        </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground">{stock.company_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className={cn(getSectorColor(stock.sector))}>
                            {stock.sector}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {market === 'sp500' ? 'S&P 100' : 'BIST 100'}
                        </span>
                    </div>
                </div>
                <Button onClick={requestAnalysis} size="lg" className="gap-2 self-start sm:self-center">
                    <Brain className="h-5 w-5" />
                    Derinlemesine AI Analizi
                </Button>
            </div>

            {/* Overview Cards - 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Final Rating */}
                <Card className="trading-card">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Award className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Final Rating</p>
                                <p className="text-lg font-semibold">{String(finalData?.status || 'N/A')}</p>
                                <Badge className={cn(getRatingBadgeClasses(score), 'mt-1')}>
                                    Skor: {score.toFixed(1)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Trend */}
                <Card className="trading-card">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Teknik Trend</p>
                                <p className="text-lg font-semibold">{String(techData?.trend || 'N/A')}</p>
                                <p className="text-sm text-emerald-500 mt-1">
                                    RSI: {String(techData?.rsi || 'N/A')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Level */}
                <Card className="trading-card">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Risk Seviyesi</p>
                                <p className="text-lg font-semibold">{String(portfolioData?.risk_level || 'N/A')}</p>
                                <p className="text-sm text-orange-500 mt-1">
                                    Ağırlık: {String(portfolioData?.suggested_weight || 'N/A')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Margin of Safety */}
                <Card className="trading-card">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                <Target className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Güvenlik Marjı</p>
                                <p className="text-lg font-semibold">
                                    {String(valuation?.margin_of_safety || 'N/A')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Sections - 2x2 Grid */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Fundamental Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            Fundamental Analiz
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {valuation && (
                            <div>
                                <h3 className="font-semibold mb-3">Değerleme Oranları</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <MetricItem label="P/E Oranı" value={valuation.pe_ratio} />
                                    <MetricItem label="P/B Oranı" value={valuation.pb_ratio} />
                                    <MetricItem
                                        label="ROE"
                                        value={valuation.roe ? `${(Number(valuation.roe) * 100).toFixed(2)}%` : null}
                                    />
                                    <MetricItem
                                        label="ROA"
                                        value={valuation.roa ? `${(Number(valuation.roa) * 100).toFixed(2)}%` : null}
                                    />
                                    <MetricItem label="Net Marj" value={valuation.net_margin_pct ? `${valuation.net_margin_pct}%` : null} />
                                    <MetricItem label="Borç/Özkaynak" value={valuation.debt_to_equity} />
                                </div>
                            </div>
                        )}
                        {(fundamentalSummary || getString(fundamentalAnalysis, 'summary')) && (
                            <div>
                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-2">Özet</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {fundamentalSummary || getString(fundamentalAnalysis, 'summary')}
                                </p>
                            </div>
                        )}
                        {!valuation && !fundamentalSummary && !fundamentalAnalysis?.summary && (
                            <p className="text-muted-foreground">Fundamental analiz verisi bulunamadı.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Technical Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            Teknik Analiz
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <MetricItem label="Trend" value={techData?.trend} />
                            <MetricItem label="Sinyal" value={techData?.signal} />
                            <MetricItem label="RSI" value={techData?.rsi} />
                            <MetricItem label="Uzun Vadeli Görünüm" value={techData?.long_term_view ? 'Mevcut' : 'N/A'} />
                        </div>

                        {supportResistance && (
                            <div>
                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-3">Destek / Direnç</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Destek</p>
                                        <p className="font-semibold text-emerald-600">
                                            {String(supportResistance.support || 'N/A')}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-red-500/10 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Direnç</p>
                                        <p className="font-semibold text-red-600">
                                            {String(supportResistance.resistance || 'N/A')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(techData?.long_term_view || getString(technicalAnalysis, 'long_term_view')) && (
                            <div>
                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-2">Uzun Vadeli Görünüm</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {String(techData?.long_term_view || getString(technicalAnalysis, 'long_term_view'))}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Behavioral Strategy */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-500" />
                            Davranışsal Strateji
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(behavioralData?.long_term_action || getString(behavioralStrategy, 'long_term_action')) && (
                            <div>
                                <h3 className="font-semibold mb-2">Uzun Vadeli Aksiyon</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {String(behavioralData?.long_term_action || getString(behavioralStrategy, 'long_term_action'))}
                                </p>
                            </div>
                        )}
                        {(behavioralData?.short_term_action || getString(behavioralStrategy, 'short_term_action')) && (
                            <div>
                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-2">Kısa Vadeli Aksiyon</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {String(behavioralData?.short_term_action || getString(behavioralStrategy, 'short_term_action'))}
                                </p>
                            </div>
                        )}
                        {(behavioralData as { investor_emotion?: string })?.investor_emotion && (
                            <div>
                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-2">Yatırımcı Duygu Durumu</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {String((behavioralData as { investor_emotion?: string }).investor_emotion)}
                                </p>
                            </div>
                        )}
                        {!behavioralData?.long_term_action && !behavioralData?.short_term_action && !behavioralStrategy?.long_term_action && !behavioralStrategy?.short_term_action && (
                            <p className="text-muted-foreground">Davranışsal strateji verisi bulunamadı.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Macro Sector Analysis */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-cyan-500" />
                            Makro Sektör Analizi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(macroData?.sector_trend || getString(macroSectorAnalysis, 'sector_trend')) && (
                            <div>
                                <h3 className="font-semibold mb-2">Sektör Trendi</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {String(macroData?.sector_trend || getString(macroSectorAnalysis, 'sector_trend'))}
                                </p>
                            </div>
                        )}
                        {(macroData?.economic_context || getString(macroSectorAnalysis, 'economic_context')) && (
                            <div>
                                <Separator className="my-4" />
                                <h3 className="font-semibold mb-2">Ekonomik Bağlam</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {String(macroData?.economic_context || getString(macroSectorAnalysis, 'economic_context'))}
                                </p>
                            </div>
                        )}
                        {!macroData?.sector_trend && !macroData?.economic_context && !macroSectorAnalysis?.sector_trend && !macroSectorAnalysis?.economic_context && (
                            <p className="text-muted-foreground">Makro sektör analizi verisi bulunamadı.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Principle Alignment - Full Width */}
            {principleAlignment && Object.keys(principleAlignment).length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Yatırım Prensipleri Uyumu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(principleAlignment).map(([expert, analysis]) => (
                                <div
                                    key={expert}
                                    className="p-4 border rounded-lg bg-muted/30"
                                >
                                    <h3 className="font-semibold mb-2 capitalize">
                                        {expert.replace(/_/g, ' ')}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {analysis}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )
            }

            {/* AI Analysis Confirmation Dialog */}
            <Dialog open={state.isConfirmOpen} onOpenChange={(open) => !open && cancelAnalysis()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            Detaylı AI Analizi
                        </DialogTitle>
                        <DialogDescription>
                            {stock.symbol} için derinlemesine AI analizi yapılacak.
                            Bu işlem ChatGPT API kullanır ve birkaç saniye sürebilir.
                            Devam etmek istiyor musunuz?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelAnalysis}>
                            İptal
                        </Button>
                        <Button onClick={confirmAnalysis}>
                            <Brain className="h-4 w-4 mr-2" />
                            Devam Et
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* AI Analysis Result Dialog */}
            <Dialog open={state.isOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="max-w-4xl max-h-[85vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            {stock.symbol} - Derinlemesine AI Analizi
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[65vh]">
                        {state.loading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground">Analiz hazırlanıyor...</p>
                            </div>
                        ) : state.error ? (
                            <div className="flex flex-col items-center justify-center py-16 text-destructive">
                                <AlertCircle className="h-12 w-12 mb-4" />
                                <p>{state.error}</p>
                            </div>
                        ) : (
                            <div className="p-4">
                                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {state.content}
                                </pre>
                            </div>
                        )}
                    </ScrollArea>
                    <DialogFooter>
                        <Button onClick={closeModal}>Kapat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageContainer >
    )
}

// Metric Item Component
interface MetricItemProps {
    label: string
    value: unknown
}

function MetricItem({ label, value }: MetricItemProps) {
    const displayValue = value === null || value === undefined ? 'N/A' : String(value)

    return (
        <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="font-semibold">{displayValue}</p>
        </div>
    )
}

// Route wrapper for getting stock from session
export function StockDetailRoute() {
    const navigate = useNavigate()
    const [stockData, setStockData] = useState<{ stock: StockAnalysis; market: Market } | null>(null)

    useEffect(() => {
        const data = sessionStorage.getItem('selectedStock')
        if (data) {
            setStockData(JSON.parse(data))
        } else {
            navigate('/')
        }
    }, [navigate])

    if (!stockData) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </PageContainer>
        )
    }

    return (
        <StockDetailPage
            stock={stockData.stock}
            market={stockData.market}
            onBack={() => navigate(-1)}
        />
    )
}


