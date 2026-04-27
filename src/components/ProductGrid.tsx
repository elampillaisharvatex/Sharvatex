import type { Product } from '../utils/supabaseClient'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
  loading: boolean
  error: string | null
  whatsappNumber?: string
}

export default function ProductGrid({ products, loading, error, whatsappNumber }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e8e0d0]/60 animate-pulse shadow-sm">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-[140px]" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-100 rounded-lg w-1/3" />
              <div className="h-3 bg-gray-100 rounded-lg w-full" />
              <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
              <div className="h-px bg-gray-100 my-3" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-red-50">
        <p className="text-4xl mb-3">🥻</p>
        <p className="text-[#0F3D2E] font-medium text-lg">We're arranging our collection</p>
        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
          Please bear with us for a moment while we beautifully drape our new saree arrivals. Try refreshing the page!
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-[#e8e0d0]/60">
        <p className="text-5xl mb-4">✨</p>
        <p className="text-[#0F3D2E] font-display font-semibold text-lg mb-1">Awaiting New Designs</p>
        <p className="text-gray-400 text-sm max-w-sm mx-auto">We are currently unrolling fresh and beautiful sarees in this collection. Please check back soon or explore our other varieties.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  )
}
