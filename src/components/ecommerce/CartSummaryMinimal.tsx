import { useMemo } from 'react'
import { useCart } from './cart'

export default function CartSummaryMinimal() {
  const { items, dispatch } = useCart()
  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2),
    [items]
  )
  if (items.length === 0) return null
  return (
    <div className="island ecommerce-cart">
      <h4 className="ecommerce-cart-title">Cart ({items.length})</h4>
      {items.map((i) => (
        <div key={i.productId} className="ecommerce-cart-item">
          <span className="ecommerce-cart-item-name">{i.name} ×{i.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'SET_QTY', productId: i.productId, quantity: i.quantity - 1 })}
            className="ecommerce-cart-qty-btn"
          >
            -
          </button>
          <span className="ecommerce-cart-qty-value">{i.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'SET_QTY', productId: i.productId, quantity: i.quantity + 1 })}
            className="ecommerce-cart-qty-btn"
          >
            +
          </button>
          <span className="ecommerce-cart-item-total">${(i.price * i.quantity).toFixed(2)}</span>
          <button
            onClick={() => dispatch({ type: 'REMOVE', productId: i.productId })}
            className="ecommerce-cart-remove"
          >
            ×
          </button>
        </div>
      ))}
      <div className="ecommerce-cart-total">
        Total: ${total}
      </div>
    </div>
  )
}
