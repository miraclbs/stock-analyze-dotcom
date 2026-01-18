import { useState, useCallback, useRef, useEffect } from 'react'
import { Play, RefreshCw, CheckCircle, XCircle, Clock, Terminal, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout'
import { supabase } from '@/api/supabase'

interface LogEntry {
    id: number
    time: string
    message: string
    type: 'info' | 'success' | 'error' | 'progress'
}

interface AnalysisStats {
    sp_total: number
    sp_success: number
    tr_total: number
    tr_success: number
}

export function AdminPage() {
    const [isRunning, setIsRunning] = useState(false)
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [stats, setStats] = useState<AnalysisStats>({
        sp_total: 100,
        sp_success: 0,
        tr_total: 69,
        tr_success: 0
    })
    const [currentSymbol, setCurrentSymbol] = useState<string>('')
    const logIdRef = useRef(0)
    const logsEndRef = useRef<HTMLDivElement>(null)

    const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
        const entry: LogEntry = {
            id: logIdRef.current++,
            time: new Date().toLocaleTimeString('tr-TR'),
            message,
            type
        }
        setLogs(prev => [...prev, entry])
    }, [])

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    const fetchTableCount = async (table: string) => {
        const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
        return count || 0
    }

    const refreshStats = async () => {
        const spCount = await fetchTableCount('ai_analyze_sp')
        const trCount = await fetchTableCount('ai_analyze_tr')
        setStats(prev => ({
            ...prev,
            sp_success: spCount,
            tr_success: trCount
        }))
    }

    useEffect(() => {
        refreshStats()
    }, [])

    const runAnalysis = async (market: 'sp' | 'tr' | 'all') => {
        setIsRunning(true)
        setLogs([])
        // Market type for logging

        addLog('🚀 AI Stock Analysis başlatılıyor...', 'info')
        addLog(`📅 Tarih: ${new Date().toLocaleString('tr-TR')}`, 'info')

        try {
            // This would normally call an API endpoint that runs the Python script
            // For now, we'll simulate the process
            addLog('⚠️ Not: Bu demo modunda çalışıyor.', 'info')
            addLog('Python scriptini manuel çalıştırın:', 'info')
            addLog('cd investing-py && python ai_full_analysis.py', 'info')

            if (market === 'sp' || market === 'all') {
                addLog('\n📈 S&P 100 analizi için:', 'info')
                addLog('python ai_full_analysis.py --sp', 'progress')
            }

            if (market === 'tr' || market === 'all') {
                addLog('\n📈 BIST 100 analizi için:', 'info')
                addLog('python ai_full_analysis.py --tr', 'progress')
            }

            if (market === 'all') {
                addLog('\n📈 Tüm piyasalar için:', 'info')
                addLog('python ai_full_analysis.py', 'progress')
            }

            addLog('\n✅ Komutları terminalde çalıştırabilirsiniz.', 'success')

        } catch (error) {
            addLog(`❌ Hata: ${error}`, 'error')
        } finally {
            setIsRunning(false)
            setCurrentSymbol('')
            await refreshStats()
        }
    }

    const clearTables = async () => {
        if (!confirm('Tüm AI analiz verilerini silmek istediğinizden emin misiniz?')) {
            return
        }

        addLog('🧹 Tablolar temizleniyor...', 'info')

        try {
            await supabase.from('ai_analyze_sp').delete().neq('symbol', '')
            addLog('✅ ai_analyze_sp temizlendi', 'success')

            await supabase.from('ai_analyze_tr').delete().neq('symbol', '')
            addLog('✅ ai_analyze_tr temizlendi', 'success')

            await refreshStats()
        } catch (error) {
            addLog(`❌ Temizleme hatası: ${error}`, 'error')
        }
    }

    const getLogIcon = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'error': return <XCircle className="h-4 w-4 text-red-500" />
            case 'progress': return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
            default: return <Terminal className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <PageContainer>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                    <p className="text-muted-foreground">
                        AI hisse analizi yönetim paneli
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                S&P 100 Analizleri
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">
                                {stats.sp_success} / {stats.sp_total}
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(stats.sp_success / stats.sp_total) * 100}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                BIST 100 Analizleri
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">
                                {stats.tr_success} / {stats.tr_total}
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all"
                                    style={{ width: `${(stats.tr_success / stats.tr_total) * 100}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Toplam Analiz
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.sp_success + stats.tr_success}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Durum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${isRunning ? 'text-yellow-500' : 'text-green-500'}`}>
                                {isRunning ? '⏳ Çalışıyor' : '✅ Hazır'}
                            </div>
                            {currentSymbol && (
                                <div className="text-sm text-muted-foreground mt-1">
                                    Şu an: {currentSymbol}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Control Panel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analiz Kontrolü</CardTitle>
                        <CardDescription>
                            Yahoo Finance'den veri çekip OpenAI ile analiz yapın
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={() => runAnalysis('all')}
                                disabled={isRunning}
                                className="bg-gradient-to-r from-blue-500 to-emerald-500"
                            >
                                {isRunning ? (
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Play className="mr-2 h-4 w-4" />
                                )}
                                Tüm Analizleri Başlat
                            </Button>

                            <Button
                                onClick={() => runAnalysis('sp')}
                                disabled={isRunning}
                                variant="outline"
                                className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Sadece S&P 100
                            </Button>

                            <Button
                                onClick={() => runAnalysis('tr')}
                                disabled={isRunning}
                                variant="outline"
                                className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                Sadece BIST 100
                            </Button>

                            <Button
                                onClick={refreshStats}
                                variant="ghost"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Yenile
                            </Button>

                            <Button
                                onClick={clearTables}
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Tabloları Temizle
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Terminal Output */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            İşlem Logları
                        </CardTitle>
                        <CardDescription>
                            Gerçek zamanlı analiz çıktıları
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-950 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
                            {logs.length === 0 ? (
                                <div className="text-gray-500 flex items-center justify-center h-full">
                                    Analiz başlatıldığında loglar burada görünecek...
                                </div>
                            ) : (
                                logs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-2 py-1">
                                        <span className="text-gray-500 text-xs w-20 flex-shrink-0">
                                            {log.time}
                                        </span>
                                        {getLogIcon(log.type)}
                                        <span className={`flex-1 ${log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-green-400' :
                                                log.type === 'progress' ? 'text-blue-400' :
                                                    'text-gray-300'
                                            }`}>
                                            {log.message}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div ref={logsEndRef} />
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                    <CardHeader>
                        <CardTitle>📋 Kullanım Talimatları</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">1. Supabase Tablolarını Oluşturun</h4>
                            <p className="text-sm text-muted-foreground">
                                <code className="bg-muted px-1 py-0.5 rounded">create_ai_tables.sql</code> dosyasındaki SQL'i
                                Supabase SQL Editor'da çalıştırın.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">2. Python Script'ini Çalıştırın</h4>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                                <div className="text-muted-foreground"># Tüm piyasalar</div>
                                <div>python ai_full_analysis.py</div>
                                <div className="text-muted-foreground mt-2"># Sadece test (2 hisse)</div>
                                <div>python ai_full_analysis.py --test</div>
                                <div className="text-muted-foreground mt-2"># Sadece S&P 100</div>
                                <div>python ai_full_analysis.py --sp</div>
                                <div className="text-muted-foreground mt-2"># Sadece BIST 100</div>
                                <div>python ai_full_analysis.py --tr</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">3. Sonuçları Görüntüleyin</h4>
                            <p className="text-sm text-muted-foreground">
                                Analizler tamamlandığında S&P 100 ve BIST 100 sayfalarında görünecek.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    )
}
