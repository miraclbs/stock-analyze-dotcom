import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Header } from '@/components/layout'
import {
  HomePage,
  SP500Page,
  BIST100Page,
  MarginOfSafetyPage,
  StockDetailRoute,
  AdminPage
} from '@/pages'

/**
 * Main application component
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sp500" element={<SP500Page />} />
            <Route path="/bist100" element={<BIST100Page />} />
            <Route path="/margin-of-safety" element={<MarginOfSafetyPage />} />
            <Route path="/stock/:symbol" element={<StockDetailRoute />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
