import type { Product } from '../utils/supabaseClient'

type Props = {
  product: Product
  whatsappNumber?: string
}

export default function ProductCard({ product, whatsappNumber = "8925677774" }: Props) {
  // Strip all non-numeric characters just in case it has spaces or '+' inside
  let cleanNumber = (whatsappNumber || "8925677774").replace(/\D/g, '');
  
  // If it's exactly 10 digits (no country code), prepend 91 (India)
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }

  const message = `Hello! 👋 I am interested in this product from your catalog:

*${product.name}*
Price: ${product.price}

📸 *Product Image:*
${product.image_url ? product.image_url : 'No image available'}

Could you please provide more details about availability and bulk pricing?`;

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col border border-[#e8e0d0]/80 card-hover shadow-sm">

      {/* ── Image / Emoji banner ── */}
      {product.image_url ? (
        <div className="relative overflow-hidden" style={{ height: '200px' }}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {product.badge && (
            <span className="absolute top-3 right-3 text-xs font-bold bg-[#C9A44C] text-white px-2.5 py-1 rounded-full shadow-md badge-glow">
              {product.badge}
            </span>
          )}
        </div>
      ) : (
        <div
          className="relative flex items-center justify-center min-h-[140px]"
          style={{
            background: 'linear-gradient(135deg, #0F3D2E 0%, #1a5c42 50%, #0d3326 100%)',
          }}
        >
          {/* Subtle pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A44C' fill-opacity='1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <span className="relative text-5xl drop-shadow-lg">{product.emoji || '🧵'}</span>
          {product.badge && (
            <span className="absolute top-3 right-3 text-xs font-bold bg-[#C9A44C] text-white px-2.5 py-1 rounded-full badge-glow">
              {product.badge}
            </span>
          )}
        </div>
      )}

      {/* ── Content ── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[#0F3D2E] text-[17px] leading-snug mb-1">
          {product.name}
        </h3>

        <span className="inline-flex items-center gap-1 text-xs text-[#C9A44C] font-medium mb-3">
          <span className="w-1 h-1 rounded-full bg-[#C9A44C] inline-block" />
          {product.categories?.name}
        </span>

        {product.description && (
          <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {product.fabric && (
          <div className="bg-[#f8f5f0] rounded-xl px-4 py-3 mb-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Fabric</span>
              <span className="font-medium text-[#0F3D2E]">{product.fabric}</span>
            </div>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mb-5 mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Wholesale Price</p>
            <p className="text-xl font-bold text-[#0F3D2E]">{product.price}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Min. Order</p>
            <p className="text-xs font-medium text-gray-600">Contact us</p>
          </div>
        </div>

        {/* WhatsApp button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1db954] active:scale-95 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md hover:shadow-green-200"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Enquire on WhatsApp
        </a>
      </div>
    </div>
  )
}
