import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { SP500Page } from './components/SP500Page'
import { BIST100Page } from './components/BIST100Page'
import { StockDetail } from './components/StockDetail'
import { MarginOfSafetyPage } from './components/MarginOfSafetyPage'
import type { StockAnalysis } from './types'

// AppContent component that uses router hooks
function AppContent() {
  const navigate = useNavigate()

  const handleStockSelect = (stock: StockAnalysis, market: 'sp500' | 'bist100') => {
    // Store stock data in sessionStorage to persist across refreshes
    sessionStorage.setItem('selectedStock', JSON.stringify({ stock, market }))
    navigate(`/stock/${stock.symbol}`)
  }

  const handleBackToList = () => {
    const stockData = sessionStorage.getItem('selectedStock')
    if (stockData) {
      const { market } = JSON.parse(stockData)
      navigate(`/${market}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sp500" element={<SP500Page onStockSelect={handleStockSelect} />} />
        <Route path="/bist100" element={<BIST100Page onStockSelect={handleStockSelect} />} />
        <Route path="/margin-of-safety" element={<MarginOfSafetyPage />} />
        <Route path="/stock/:symbol" element={<StockDetailRoute onBack={handleBackToList} />} />
      </Routes>
    </div>
  )
}

// Separate component for stock detail route
function StockDetailRoute({ onBack }: { onBack: () => void }) {
  const stockData = sessionStorage.getItem('selectedStock')

  if (!stockData) {
    // Redirect to home if no stock data found
    window.location.href = '/'
    return null
  }

  const { stock, market } = JSON.parse(stockData)

  return (
    <StockDetail
      stock={stock}
      market={market}
      onBack={onBack}
    />
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
