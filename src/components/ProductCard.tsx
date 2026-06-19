import { useState } from 'react'
import type { Product } from '../utils/supabaseClient'
import { Dialog, DialogContent, DialogTitle, DialogClose } from './ui/dialog'

type Props = {
  product: Product
  whatsappNumber?: string
}

export default function ProductCard({ product, whatsappNumber = "9994466665" }: Props) {
  // Strip all non-numeric characters just in case it has spaces or '+' inside
  let cleanNumber = (whatsappNumber || "9994466665").replace(/\D/g, '');
  
  // If it's exactly 10 digits (no country code), prepend 91 (India)
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  
  const images = product.product_images && product.product_images.length > 0 
    ? product.product_images.map(img => img.image_url) 
    : (product.image_url ? [product.image_url] : [])

  const message = `Hello! 👋 I am interested in this product from your catalog:

*${product.name}*
Price: ${product.price}

📸 *Product Image:*
${product.image_url ? product.image_url : 'No image available'}

Could you please provide more details about availability and bulk pricing?`;

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setCurrentImageIndex(0) }}>
      <div 
        className="bg-white rounded-2xl overflow-hidden flex flex-col border border-[#e8e0d0]/80 card-hover shadow-sm cursor-pointer"
        onClick={() => setIsOpen(true)}
      >

        {/* ── Image / Emoji banner ── */}
        {images.length > 0 ? (
          <div className="relative overflow-hidden group" style={{ height: '200px' }}>
            <img
              src={images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            {images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm shadow flex items-center gap-1 z-10">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                1/{images.length}
              </div>
            )}
            {product.badge && (
              <span className="absolute top-3 left-3 text-xs font-bold bg-[#C9A44C] text-white px-2.5 py-1 rounded-full shadow-md badge-glow z-10">
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
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1db954] active:scale-95 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-sm hover:shadow-md hover:shadow-green-200"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Enquire on WhatsApp
          </a>
        </div>
      </div>

      {/* The Dialog Content (rendered when isOpen is true) */}
      <DialogContent aria-describedby={undefined} className="p-0 bg-[#f8f5f0] border-none w-[95vw] max-w-md sm:max-w-xl h-[90vh] flex flex-col shadow-2xl overflow-hidden rounded-2xl gap-0">
        <DialogTitle className="sr-only">Product Details: {product.name}</DialogTitle>
        
        {/* Top Close Button */}
        <div className="absolute top-4 right-4 z-50">
          <DialogClose className="bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur shadow-lg transition-colors focus:outline-none">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </DialogClose>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Image Area */}
          <div className="relative w-full aspect-[4/5] sm:aspect-square bg-[#0F3D2E]">
             {images.length > 0 ? (
               <div className="w-full h-full relative cursor-zoom-in group/zoom" onClick={(e) => { e.stopPropagation(); setIsZoomed(true); }}>
                 <img src={images[currentImageIndex]} className="w-full h-full object-contain" alt={product.name} />
                 <div className="absolute top-4 left-4 bg-black/40 text-white p-2 rounded-full backdrop-blur opacity-0 group-hover/zoom:opacity-100 transition-opacity">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                 </div>
               </div>
             ) : (
               <div className="w-full h-full flex items-center justify-center text-7xl">{product.emoji || '🧵'}</div>
             )}
             
             {images.length > 1 && (
              <>
                <button 
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur shadow-lg transition-colors" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1)); 
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur shadow-lg transition-colors" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1)); 
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full backdrop-blur shadow text-xs font-semibold tracking-widest">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
             )}
          </div>

          {/* Product Info */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-[#C9A44C]/10 text-[#C9A44C] text-xs font-bold rounded-full uppercase tracking-wider">
                {product.categories?.name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F3D2E] leading-tight">
                {product.name}
              </h2>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-500 uppercase tracking-wide">Wholesale Price</span>
              <p className="text-3xl font-bold text-[#0F3D2E]">{product.price}</p>
            </div>

            {product.fabric && (
              <div className="bg-white rounded-xl px-5 py-4 border border-[#e8e0d0] shadow-sm flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Fabric</span>
                <span className="font-bold text-[#0F3D2E]">{product.fabric}</span>
              </div>
            )}

            {product.description && (
              <div className="pt-2">
                <h3 className="text-sm font-bold text-[#0F3D2E] uppercase tracking-wider mb-3">Product Description</h3>
                <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
           <a 
             href={whatsappUrl} 
             target="_blank" 
             rel="noopener noreferrer"
             className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1db954] active:scale-[0.98] text-white font-bold py-3.5 sm:py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
           >
             <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
             </svg>
             Enquire Now
           </a>
        </div>
        {/* Zoom Overlay (Inside DialogContent) */}
        {isZoomed && images.length > 0 && (
          <div 
            className="absolute inset-0 z-[200] bg-black/95 overflow-auto touch-pan-x touch-pan-y flex items-center justify-center cursor-zoom-out"
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
          >
            <img 
              src={images[currentImageIndex]} 
              className="w-auto h-auto min-w-[150vw] sm:min-w-[100vw] object-contain max-w-none" 
              alt={`Zoomed ${product.name}`} 
              onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            />
            <button 
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center backdrop-blur z-50 cursor-pointer transition-colors"
              onClick={(e) => { 
                e.stopPropagation(); 
                setIsZoomed(false);
                setIsOpen(false); 
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
