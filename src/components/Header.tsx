import { Sun, Moon, TrendingUp } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

interface HeaderProps {
    currentPage: string
    onPageChange: (page: string) => void
}

export function Header({ currentPage, onPageChange }: HeaderProps) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Yatırım Analizi
                            </span>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <button
                                onClick={() => onPageChange('home')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'home'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                Ana Sayfa
                            </button>
                            <button
                                onClick={() => onPageChange('sp500')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'sp500'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                S&P 500
                            </button>
                            <button
                                onClick={() => onPageChange('bist100')}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'bist100'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                BIST 100
                            </button>
                        </nav>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    )
}