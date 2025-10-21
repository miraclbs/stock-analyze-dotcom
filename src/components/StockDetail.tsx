import { useState } from 'react'
import type { StockAnalysis } from '../types'
import { ArrowLeft, Brain, TrendingUp, BarChart3, Target, Shield, Users, Award } from 'lucide-react'
import { generateStockAnalysis } from '../lib/openai'

interface StockDetailProps {
    stock: StockAnalysis
    market: 'sp500' | 'bist100'
    onBack: () => void
}

interface AnalysisModal {
    isOpen: boolean
    loading: boolean
    content: string
    error: string | null
}

interface ConfirmationModal {
    isOpen: boolean
}

export function StockDetail({ stock, market, onBack }: StockDetailProps) {
    const [modal, setModal] = useState<AnalysisModal>({
        isOpen: false,
        loading: false,
        content: '',
        error: null
    })

    const [confirmModal, setConfirmModal] = useState<ConfirmationModal>({
        isOpen: false
    })

    const parseJSON = (jsonString: any) => {
        try {
            return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString
        } catch {
            return {}
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 8.5) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        if (score >= 7.5) return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200'
        if (score >= 6.5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        if (score >= 5.5) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        if (score >= 4) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }

    const getScore = (rating: any) => {
        if (!rating) return 0;
        const score = parseFloat(rating.score || rating.final_score || 0);
        return isNaN(score) ? 0 : score;
    }

    const fundamentalAnalysis = parseJSON(stock.fundamental_analysis)
    const technicalAnalysis = parseJSON(stock.technical_analysis)
    const macroSectorAnalysis = parseJSON(stock.macro_sector_analysis)
    const behavioralStrategy = parseJSON(stock.behavioral_strategy)
    const portfolioEffect = parseJSON(stock.portfolio_effect)
    const finalRating = parseJSON(stock.final_rating)
    const principleAlignment = parseJSON(stock.principle_alignment)

    const handleDeepAnalysis = async () => {
        setConfirmModal({ isOpen: true })
    }

    const confirmAnalysis = async () => {
        setConfirmModal({ isOpen: false })
        setModal({ isOpen: true, loading: true, content: '', error: null })

        try {
            const analysisContent = await generateStockAnalysis(stock, stock.symbol)
            setModal({ isOpen: true, loading: false, content: analysisContent, error: null })
        } catch (error: any) {
            setModal({
                isOpen: true,
                loading: false,
                content: '',
                error: error.message || 'Analiz oluşturulurken bir hata oluştu.'
            })
        }
    }

    const cancelAnalysis = () => {
        setConfirmModal({ isOpen: false })
    }

    const closeModal = () => {
        setModal({ isOpen: false, loading: false, content: '', error: null })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Geri Dön
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {stock.symbol} - {stock.company_name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {stock.sector} | {market === 'sp500' ? 'S&P 500' : 'BIST 100'}
                        </p>
                    </div>
                </div>

                {/* AI Analysis Button */}
                <div className="mb-8">
                    <button
                        onClick={handleDeepAnalysis}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg"
                    >
                        <Brain className="w-5 h-5 mr-2" />
                        Derinlemesine AI Analizi
                    </button>
                </div>

                {/* Overview Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Award className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Final Rating</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {finalRating?.status || 'N/A'}
                                </p>
                                <div className="mt-1">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getScoreColor(getScore(finalRating))}`}>
                                        Skor: {getScore(finalRating).toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Teknik Trend</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {technicalAnalysis?.trend || 'N/A'}
                                </p>
                                <p className="text-sm text-green-600">
                                    RSI: {technicalAnalysis?.rsi || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Shield className="w-8 h-8 text-orange-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Risk Seviyesi</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {portfolioEffect?.risk_level || 'N/A'}
                                </p>
                                <p className="text-sm text-orange-600">
                                    Ağırlık: {portfolioEffect?.suggested_weight || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Target className="w-8 h-8 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Güvenlik Marjı</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {fundamentalAnalysis?.valuation?.margin_of_safety || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis Sections */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Fundamental Analysis */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Fundamental Analiz
                        </h2>

                        {fundamentalAnalysis?.valuation && (
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Değerleme Oranları</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">P/E Oranı:</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {fundamentalAnalysis.valuation.pe_ratio || 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">P/B Oranı:</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {fundamentalAnalysis.valuation.pb_ratio || 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">ROE:</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {fundamentalAnalysis.valuation.roe ? `${(fundamentalAnalysis.valuation.roe * 100).toFixed(2)}%` : 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Net Marj:</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {fundamentalAnalysis.valuation.net_margin_pct ? `${fundamentalAnalysis.valuation.net_margin_pct}%` : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {fundamentalAnalysis?.summary && (
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Özet</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {fundamentalAnalysis.summary}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Technical Analysis */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Teknik Analiz
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Sinyal:</span>
                                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                    {technicalAnalysis?.signal || 'N/A'}
                                </span>
                            </div>

                            {technicalAnalysis?.support_resistance && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Destek/Direnç</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Destek:</span>
                                            <span className="ml-2 font-medium text-green-600">
                                                {technicalAnalysis.support_resistance.support || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Direnç:</span>
                                            <span className="ml-2 font-medium text-red-600">
                                                {technicalAnalysis.support_resistance.resistance || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {technicalAnalysis?.long_term_view && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Uzun Vadeli Görünüm</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {technicalAnalysis.long_term_view}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Behavioral Strategy */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Davranışsal Strateji
                        </h2>

                        <div className="space-y-4">
                            {behavioralStrategy?.long_term_action && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Uzun Vadeli Aksiyon</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {behavioralStrategy.long_term_action}
                                    </p>
                                </div>
                            )}

                            {behavioralStrategy?.short_term_action && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Kısa Vadeli Aksiyon</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {behavioralStrategy.short_term_action}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Macro Sector Analysis */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Makro Sektör Analizi
                        </h2>

                        <div className="space-y-4">
                            {macroSectorAnalysis?.sector_trend && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sektör Trendi</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {macroSectorAnalysis.sector_trend}
                                    </p>
                                </div>
                            )}

                            {macroSectorAnalysis?.economic_context && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ekonomik Bağlam</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {macroSectorAnalysis.economic_context}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Principle Alignment */}
                {principleAlignment && (
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Yatırım Prensipleri Uyumu
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(principleAlignment).map(([expert, analysis]) => (
                                <div key={expert} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize">
                                        {expert.replace('_', ' ')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {analysis as string}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Deep Analysis Modal */}
            {modal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {stock.symbol} - Derinlemesine AI Analizi
                            </h2>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {modal.loading && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600 dark:text-gray-300">Analiz hazırlanıyor...</p>
                                </div>
                            )}

                            {modal.error && (
                                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                                    <p className="text-red-800 dark:text-red-200">{modal.error}</p>
                                </div>
                            )}

                            {modal.content && (
                                <div className="prose dark:prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {modal.content}
                                    </pre>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                                    <Brain className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Detaylı AI Analizi
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Derinlemesine AI analizi için ChatGPT API kullanılacak. Bu işlem birkaç saniye sürebilir. Devam etmek istiyor musunuz?
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={cancelAnalysis}
                                        className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={confirmAnalysis}
                                        className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                                    >
                                        Devam Et
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}