import { type Product } from './products'

type Props = {
  product: Product
  onAdd: () => void
}

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="ecommerce-product-card">
      <div className="ecommerce-product-name">{product.name}</div>
      <div className="ecommerce-product-category">{product.category}</div>
      <div className="ecommerce-product-rating">
        {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
      </div>
      <div className="ecommerce-product-price">${product.price.toFixed(2)}</div>
      <button onClick={onAdd} className="ecommerce-product-add">Add to Cart</button>
    </div>
  )
}
