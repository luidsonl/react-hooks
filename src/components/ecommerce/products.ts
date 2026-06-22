export type Product = { id: number; name: string; category: string; price: number; rating: number }

export const products: Product[] = [
  { id: 1, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, rating: 4 },
  { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', price: 89.99, rating: 5 },
  { id: 3, name: 'USB-C Hub', category: 'Electronics', price: 34.99, rating: 3 },
  { id: 4, name: 'Notebook', category: 'Stationery', price: 4.99, rating: 4 },
  { id: 5, name: 'Pen Set', category: 'Stationery', price: 12.99, rating: 3 },
  { id: 6, name: 'Desk Lamp', category: 'Furniture', price: 45.99, rating: 4 },
  { id: 7, name: 'Ergonomic Chair', category: 'Furniture', price: 299.99, rating: 5 },
  { id: 8, name: 'Monitor Stand', category: 'Furniture', price: 39.99, rating: 3 },
  { id: 9, name: 'Headphones', category: 'Electronics', price: 59.99, rating: 4 },
  { id: 10, name: 'Mouse Pad', category: 'Electronics', price: 14.99, rating: 2 },
  { id: 11, name: 'Sticky Notes', category: 'Stationery', price: 3.99, rating: 3 },
  { id: 12, name: 'Whiteboard', category: 'Stationery', price: 24.99, rating: 4 },
]

export const categories = ['All', ...new Set(products.map((p) => p.category))]
