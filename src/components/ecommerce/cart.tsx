import { createContext, useContext, useReducer, useMemo } from 'react'

type CartItem = { productId: number; name: string; price: number; quantity: number }

type CartState = CartItem[]

type CartAction =
  | { type: 'ADD'; productId: number; name: string; price: number }
  | { type: 'REMOVE'; productId: number }
  | { type: 'SET_QTY'; productId: number; quantity: number }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.productId === action.productId)
      if (existing) {
        return state.map((i) =>
          i.productId === action.productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...state, { productId: action.productId, name: action.name, price: action.price, quantity: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.productId !== action.productId)
    case 'SET_QTY':
      return state.map((i) =>
        i.productId === action.productId ? { ...i, quantity: Math.max(0, action.quantity) } : i
      ).filter((i) => i.quantity > 0)
  }
}

const CartCtx = createContext<{
  items: CartItem[]
  dispatch: React.Dispatch<CartAction>
}>({ items: [], dispatch: () => {} })

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartCtx)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const value = useMemo(() => ({ items, dispatch }), [items])
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}
