import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { MarginOfSafety } from '../types'
import { Search, ChevronLeft, ChevronRight, Shield, TrendingUp, TrendingDown } from 'lucide-react'

export function MarginOfSafetyPage() {
    const [marginData, setMarginData] = useState<MarginOfSafety[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    useEffect(() => {
        fetchMarginData()
    }, [])

    const fetchMarginData = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('sp500_margin_of_safety')
                .select('*')
                .eq('analysis_status', 'valid')
                .not('margin_of_safety_percent', 'is', null)
                .not('intrinsic_value', 'is', null)
                .order('margin_of_safety_percent', { ascending: false })

            if (error) throw error
            setMarginData(data || [])
        } catch (error) {
            console.error('Error fetching margin of safety data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredData = marginData.filter(item =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sector.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)

    const getMarginColor = (marginPercent: number) => {
        if (marginPercent >= 30) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        if (marginPercent >= 15) return 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200'
        if (marginPercent >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        if (marginPercent >= 0) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }

    const getMarginIcon = (marginPercent: number) => {
        if (marginPercent >= 0) {
            return <TrendingUp className="w-4 h-4" />
        }
        return <TrendingDown className="w-4 h-4" />
    }

    const getMarginLabel = (marginPercent: number) => {
        if (marginPercent >= 30) return 'Çok Güvenli'
        if (marginPercent >= 15) return 'Güvenli'
        if (marginPercent >= 5) return 'Dikkatli'
        if (marginPercent >= 0) return 'Riskli'
        return 'Tehlikeli'
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Margin of Safety verileri yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Margin of Safety Analizi
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        S&P 100 hisselerinin güvenlik marjı analizleri. Gerçek değer ile güncel fiyat arasındaki farkı gösterir.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Sembol, şirket adı veya sektör ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-300">
                        {filteredData.length} hisse bulundu
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 border border-green-200 dark:border-green-700">
                        <div className="flex items-center">
                            <Shield className="w-6 h-6 text-green-600 dark:text-green-300 mr-2" />
                            <div>
                                <p className="text-sm text-green-600 dark:text-green-300 font-medium">Çok Güvenli</p>
                                <p className="text-lg font-bold text-green-800 dark:text-green-100">
                                    {marginData.filter(item => item.margin_of_safety_percent !== null && item.margin_of_safety_percent >= 30).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-lime-50 dark:bg-lime-900 rounded-lg p-4 border border-lime-200 dark:border-lime-700">
                        <div className="flex items-center">
                            <Shield className="w-6 h-6 text-lime-600 dark:text-lime-300 mr-2" />
                            <div>
                                <p className="text-sm text-lime-600 dark:text-lime-300 font-medium">Güvenli</p>
                                <p className="text-lg font-bold text-lime-800 dark:text-lime-100">
                                    {marginData.filter(item => item.margin_of_safety_percent !== null && item.margin_of_safety_percent >= 15 && item.margin_of_safety_percent < 30).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center">
                            <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-300 mr-2" />
                            <div>
                                <p className="text-sm text-yellow-600 dark:text-yellow-300 font-medium">Dikkatli</p>
                                <p className="text-lg font-bold text-yellow-800 dark:text-yellow-100">
                                    {marginData.filter(item => item.margin_of_safety_percent !== null && item.margin_of_safety_percent >= 5 && item.margin_of_safety_percent < 15).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 border border-red-200 dark:border-red-700">
                        <div className="flex items-center">
                            <Shield className="w-6 h-6 text-red-600 dark:text-red-300 mr-2" />
                            <div>
                                <p className="text-sm text-red-600 dark:text-red-300 font-medium">Riskli/Tehlikeli</p>
                                <p className="text-lg font-bold text-red-800 dark:text-red-100">
                                    {marginData.filter(item => item.margin_of_safety_percent !== null && item.margin_of_safety_percent < 5).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sembol
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Şirket
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sektör
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Güncel Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Gerçek Değer
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Margin of Safety
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Risk Durumu
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        EPS
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Büyüme %
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        P/E Oranı
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Piyasa Değeri
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.symbol}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate" title={item.company_name}>
                                                {item.company_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {item.sector}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                ${item.price.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white font-medium">
                                                ${item.intrinsic_value?.toFixed(2) || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.margin_of_safety_percent !== null ? (
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getMarginColor(item.margin_of_safety_percent)}`}>
                                                    {getMarginIcon(item.margin_of_safety_percent)}
                                                    <span className="ml-1">{item.margin_of_safety_percent.toFixed(1)}%</span>
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.margin_of_safety_percent !== null ? (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMarginColor(item.margin_of_safety_percent)}`}>
                                                    {getMarginLabel(item.margin_of_safety_percent)}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                ${item.eps.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {item.growth_percent?.toFixed(1) || 'N/A'}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {item.pe_ratio.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                ${(item.market_cap / 1000000000).toFixed(2)}B
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sonraki
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                        {' - '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, filteredData.length)}
                                        </span>
                                        {' / '}
                                        <span className="font-medium">{filteredData.length}</span>
                                        {' '}sonuç gösteriliyor
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                        ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}