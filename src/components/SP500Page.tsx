import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { StockAnalysis } from '../types'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

interface SP500PageProps {
    onStockSelect: (stock: StockAnalysis, market: 'sp500') => void
}

export function SP500Page({ onStockSelect }: SP500PageProps) {
    const [stocks, setStocks] = useState<StockAnalysis[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    useEffect(() => {
        fetchStocks()
    }, [])

    const fetchStocks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('ai_analyze_sp')
                .select('*')
                .order('symbol', { ascending: true })

            if (error) throw error
            setStocks(data || [])
        } catch (error) {
            console.error('Error fetching stocks:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredStocks = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const paginatedStocks = filteredStocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage)

    const getRatingScore = (finalRating: any) => {
        if (!finalRating) return 0;

        try {
            // Eğer direkt sayı ise
            if (typeof finalRating === 'number') {
                return isNaN(finalRating) ? 0 : finalRating;
            }

            // String ise önce JSON parse deneyelim
            if (typeof finalRating === 'string') {
                // Eğer string direkt bir sayı ise
                const directNumber = parseFloat(finalRating);
                if (!isNaN(directNumber)) return directNumber;

                // JSON parse deneyelim
                try {
                    const parsed = JSON.parse(finalRating);
                    if (typeof parsed === 'number') return parsed;

                    // Object içinden skor bulmaya çalışalım
                    if (parsed?.score !== undefined) {
                        const score = parseFloat(parsed.score);
                        return isNaN(score) ? 0 : score;
                    }
                    if (parsed?.final_score !== undefined) {
                        const score = parseFloat(parsed.final_score);
                        return isNaN(score) ? 0 : score;
                    }
                    if (parsed?.analysis?.final_score !== undefined) {
                        const score = parseFloat(parsed.analysis.final_score);
                        return isNaN(score) ? 0 : score;
                    }
                } catch {
                    // JSON parse başarısız, string içinde sayı arayalım
                    const numberMatch = finalRating.match(/\d+\.?\d*/);
                    if (numberMatch) {
                        const score = parseFloat(numberMatch[0]);
                        return isNaN(score) ? 0 : score;
                    }
                }
                return 0;
            }

            // Object ise direkt kontrol edelim
            if (finalRating?.score !== undefined) {
                const score = parseFloat(finalRating.score);
                return isNaN(score) ? 0 : score;
            }
            if (finalRating?.final_score !== undefined) {
                const score = parseFloat(finalRating.final_score);
                return isNaN(score) ? 0 : score;
            }
            if (finalRating?.analysis?.final_score !== undefined) {
                const score = parseFloat(finalRating.analysis.final_score);
                return isNaN(score) ? 0 : score;
            }

            return 0;
        } catch (error) {
            console.error('Rating score parse hatası:', error);
            return 0;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">S&P 100 verileri yükleniyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        S&P 100 Hisse Analizleri
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Amerika'nın en büyük 500 şirketinin AI destekli analizi
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Sembol, şirket adı veya sektör ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                        {filteredStocks.length} hisse bulundu
                    </div>
                </div>

                {/* Stocks Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sembol
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Şirket
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Sektör
                                    </th>
                                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Rating Skoru
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedStocks.map((stock) => (
                                    <tr
                                        key={stock.id}
                                        onClick={() => onStockSelect(stock, 'sp500')}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                    >
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {stock.symbol}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                                                {stock.company_name}
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {stock.sector}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 text-center">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getScoreColor(getRatingScore(stock.final_rating))}`}>
                                                {getRatingScore(stock.final_rating).toFixed(1)}
                                            </span>
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
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Önceki
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    Sonraki
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                        {' - '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, filteredStocks.length)}
                                        </span>
                                        {' / '}
                                        <span className="font-medium">{filteredStocks.length}</span>
                                        {' sonuç gösteriliyor'}
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i
                                            } else {
                                                pageNumber = currentPage - 2 + i
                                            }

                                            return (
                                                <button
                                                    key={pageNumber}
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                        ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            )
                                        })}
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
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