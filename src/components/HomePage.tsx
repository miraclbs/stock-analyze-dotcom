import { TrendingUp, BarChart3, AlertCircle } from 'lucide-react'

interface HomePageProps {
    onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        AI Destekli Hisse Analizi
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        S&P 500 ve BIST 100 hisselerinin detaylı yapay zeka analizi ile
                        yatırım kararlarınızı destekleyin
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div
                        onClick={() => onNavigate('sp500')}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center mb-4">
                            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                S&P 500 Analizleri
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Amerika'nın en büyük 500 şirketinin detaylı AI analizi.
                            Fundamental, teknik ve makroekonomik değerlendirmeler.
                        </p>
                        <div className="flex items-center text-blue-600 font-medium">
                            Analizleri İncele →
                        </div>
                    </div>

                    <div
                        onClick={() => onNavigate('bist100')}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center mb-4">
                            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                BIST 100 Analizleri
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Türkiye'nin en büyük 100 şirketinin kapsamlı analizi.
                            Yerel piyasa koşulları ve global etkileşimler.
                        </p>
                        <div className="flex items-center text-green-600 font-medium">
                            Analizleri İncele →
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Analiz Özellikleri
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Teknik Analiz
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                RSI, hareketli ortalamalar, destek/direnç seviyeleri
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Fundamental Analiz
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                F/K, P/B oranları, borçluluk, kârlılık metrikleri
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                AI Değerlendirme
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                ChatGPT AI ile derinlemesine piyasa analizi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}