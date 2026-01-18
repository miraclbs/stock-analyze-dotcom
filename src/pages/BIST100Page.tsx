import { StockList } from '@/components/stocks'

/**
 * BIST 100 page - thin wrapper around StockList
 */
export function BIST100Page() {
    return <StockList market="bist100" />
}
