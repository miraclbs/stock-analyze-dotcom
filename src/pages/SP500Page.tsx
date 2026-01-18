import { StockList } from '@/components/stocks'

/**
 * S&P 500 page - thin wrapper around StockList
 */
export function SP500Page() {
    return <StockList market="sp500" />
}
