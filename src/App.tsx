import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { SP500Page } from './components/SP500Page'
import { BIST100Page } from './components/BIST100Page'
import { StockDetail } from './components/StockDetail'
import { MarginOfSafetyPage } from './components/MarginOfSafetyPage'
import type { StockAnalysis } from './types'

type Page = 'home' | 'sp500' | 'bist100' | 'margin-of-safety' | 'stock-detail'

interface SelectedStock {
  stock: StockAnalysis
  market: 'sp500' | 'bist100'
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedStock, setSelectedStock] = useState<SelectedStock | null>(null)

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page)
    setSelectedStock(null)
  }

  const handleStockSelect = (stock: StockAnalysis, market: 'sp500' | 'bist100') => {
    setSelectedStock({ stock, market })
    setCurrentPage('stock-detail')
  }

  const handleBackToList = () => {
    if (selectedStock) {
      setCurrentPage(selectedStock.market)
      setSelectedStock(null)
    } else {
      setCurrentPage('home')
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageChange} />
      case 'sp500':
        return <SP500Page onStockSelect={handleStockSelect} />
      case 'bist100':
        return <BIST100Page onStockSelect={handleStockSelect} />
      case 'margin-of-safety':
        return <MarginOfSafetyPage />
      case 'stock-detail':
        return selectedStock ? (
          <StockDetail
            stock={selectedStock.stock}
            market={selectedStock.market}
            onBack={handleBackToList}
          />
        ) : (
          <HomePage onNavigate={handlePageChange} />
        )
      default:
        return <HomePage onNavigate={handlePageChange} />
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header
          currentPage={currentPage === 'stock-detail' ? (selectedStock?.market || 'home') : currentPage}
          onPageChange={handlePageChange}
        />
        {renderCurrentPage()}
      </div>
    </ThemeProvider>
  )
}

export default App
