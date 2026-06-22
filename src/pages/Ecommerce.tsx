import '../styles/ecommerce.css'
import { useState, useDeferredValue, useTransition, useMemo, useCallback } from 'react'
import { CartProvider, useCart } from '../components/ecommerce/cart'
import { products, categories } from '../components/ecommerce/products'
import ProductCard from '../components/ecommerce/ProductCard'
import CartSummaryMinimal from '../components/ecommerce/CartSummaryMinimal'

function Shop() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [isPending, startTransition] = useTransition()
  const deferredSearch = useDeferredValue(search)
  const { dispatch } = useCart()

  const setSearchDeferred = useCallback((value: string) => {
    startTransition(() => setSearch(value))
  }, [])

  const filtered = useMemo(() => {
    const max = maxPrice ? parseFloat(maxPrice) : Infinity
    const min = minPrice ? parseFloat(minPrice) : 0
    return products.filter((p) => {
      if (category !== 'All' && p.category !== category) return false
      if (deferredSearch && !p.name.toLowerCase().includes(deferredSearch.toLowerCase())) return false
      if (p.price < min || p.price > max) return false
      return true
    })
  }, [category, minPrice, maxPrice, deferredSearch])

  return (
    <div className="page">
      <div className="ecommerce-layout">
        <div className="ecommerce-sidebar">
          <div className="island ecommerce-filters">
            <h4 className="ecommerce-filters-title">Filters</h4>
            <div>
              <label className="ecommerce-label">Search</label>
              <input
                value={search}
                onChange={(e) => setSearchDeferred(e.target.value)}
                placeholder="Search products..."
              />
            </div>
            <div>
              <label className="ecommerce-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="ecommerce-price-row">
              <div>
                <label className="ecommerce-label">Min $</label>
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="ecommerce-label">Max $</label>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999" />
              </div>
            </div>
          </div>
          <CartSummaryMinimal />
        </div>

        <div>
          <div className="ecommerce-result-count">
            {isPending ? 'Updating...' : `${filtered.length} products`}
          </div>
          <div className={`ecommerce-product-grid${isPending ? ' ecommerce-product-grid-loading' : ''}`}>
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => dispatch({ type: 'ADD', productId: p.id, name: p.name, price: p.price })}
              />
            ))}
            {filtered.length === 0 && (
              <div className="ecommerce-empty">No products match your filters</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Ecommerce() {
  return (
    <CartProvider>
      <Shop />
    </CartProvider>
  )
}
