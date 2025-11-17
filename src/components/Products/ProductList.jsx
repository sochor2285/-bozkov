import { useEffect } from 'react'
import { useProductStore } from '../../stores/productStore'
import ProductCard from './ProductCard'
import './Products.css'

export default function ProductList() {
  const { products, loading, fetchProducts } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="section-title">Naše Produkty</h2>
        {loading ? (
          <div className="products-loading">Načítám produkty...</div>
        ) : products.length === 0 ? (
          <div className="products-empty">Žádné produkty k dispozici</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
