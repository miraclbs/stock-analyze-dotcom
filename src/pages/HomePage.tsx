import { Link } from 'react-router-dom'
import { TrendingUp, BarChart3, Shield, LineChart, Zap, Brain } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout'

/**
 * Modern trading app home page
 */
export function HomePage() {
    return (
        <PageContainer>
            {/* Hero Section */}
            <div className="text-center py-12 md:py-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    <Zap className="h-4 w-4" />
                    AI Destekli Analiz Platformu
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    <span className="gradient-text">Akıllı Yatırım</span>
                    <br />
                    Kararları
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                    S&P 100 ve BIST 100 hisselerinin detaylı yapay zeka analizi ile
                    yatırım kararlarınızı destekleyin
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="text-base">
                        <Link to="/sp500">
                            <TrendingUp className="mr-2 h-5 w-5" />
                            S&P 100 Analizi
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="text-base">
                        <Link to="/bist100">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            BIST 100 Analizi
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <Link to="/sp500">
                    <Card className="h-full trading-card cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-blue-500" />
                            </div>
                            <CardTitle>S&P 100 Analizleri</CardTitle>
                            <CardDescription>
                                Amerika'nın en büyük 100 şirketinin detaylı AI analizi.
                                Fundamental, teknik ve makroekonomik değerlendirmeler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <span className="text-primary font-medium flex items-center">
                                Analizleri İncele →
                            </span>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/bist100">
                    <Card className="h-full trading-card cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-emerald-500" />
                            </div>
                            <CardTitle>BIST 100 Analizleri</CardTitle>
                            <CardDescription>
                                Türkiye'nin en büyük 100 şirketinin kapsamlı analizi.
                                Yerel piyasa koşulları ve global etkileşimler.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <span className="text-primary font-medium flex items-center">
                                Analizleri İncele →
                            </span>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/margin-of-safety">
                    <Card className="h-full trading-card cursor-pointer border-2 hover:border-primary/50">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-purple-500" />
                            </div>
                            <CardTitle>Margin of Safety</CardTitle>
                            <CardDescription>
                                Benjamin Graham'ın güvenlik marjı analizi.
                                İçsel değer hesaplamaları ve yatırım fırsatları.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <span className="text-primary font-medium flex items-center">
                                Analizleri İncele →
                            </span>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Features Section */}
            <Card className="mb-16">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Analiz Özellikleri</CardTitle>
                    <CardDescription>
                        Kapsamlı analiz araçlarımız ile yatırım kararlarınızı destekleyin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                                <LineChart className="h-7 w-7 text-blue-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Teknik Analiz</h3>
                            <p className="text-sm text-muted-foreground">
                                RSI, hareketli ortalamalar, destek/direnç seviyeleri
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="h-7 w-7 text-emerald-500" />
                            </div>
                            <h3 className="font-semibold mb-2">Fundamental Analiz</h3>
                            <p className="text-sm text-muted-foreground">
                                F/K, P/B oranları, borçluluk, kârlılık metrikleri
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                                <Brain className="h-7 w-7 text-purple-500" />
                            </div>
                            <h3 className="font-semibold mb-2">AI Değerlendirme</h3>
                            <p className="text-sm text-muted-foreground">
                                GPT-4 ile derinlemesine piyasa analizi
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    )
}
