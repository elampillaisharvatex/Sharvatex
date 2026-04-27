import { useState, useEffect } from 'react'
import { getProducts, getSiteSettings, getCategories, type Product, type Category } from '../utils/supabaseClient'
import { testConnection } from '../lib/testConnection'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'
import { Link } from 'wouter'
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog'

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [whatsappNumber, setWhatsappNumber] = useState("8925677774")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLogoOpen, setIsLogoOpen] = useState(false)

  // Helper to ensure 10 digit numbers get a country code
  const getWhatsAppUrl = () => {
    let cln = (whatsappNumber || "8925677774").replace(/\D/g, '');
    if (cln.length === 10) cln = `91${cln}`;
    return `https://wa.me/${cln}`;
  };

  const sliderImages = [
    '/images/saree.webp',
    '/images/weaver.webp'
  ]

  useEffect(() => {
    // Slider interval
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [sliderImages.length])

  useEffect(() => {
    // Load data from Supabase
    async function loadData() {
      try {
        await testConnection(); // Test connection first

        const [productsData, catsData, settings] = await Promise.all([
          getProducts(),
          getCategories(),
          getSiteSettings()
        ]);
        setProducts(productsData)
        setCategories(catsData)
        if (settings?.whatsapp_number) {
          setWhatsappNumber(settings.whatsapp_number)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (category === 'All') setFiltered(products)
    else setFiltered(products.filter((p) => p.categories?.name === category))
  }, [category, products])

  return (
    <div className="min-h-screen bg-[#f8f5f0]">

      {/* ── Sticky Navbar ── */}
      <nav className="bg-[#0B3023]/96 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Dialog open={isLogoOpen} onOpenChange={setIsLogoOpen}>
              <DialogTrigger asChild>
                <img src="/images/logo.jpeg" alt="Sharvatex Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shadow cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="p-0 bg-transparent border-0 max-w-md">
                <img src="/images/logo.jpeg" alt="Sharvatex Logo" className="w-full h-auto rounded-lg" />
              </DialogContent>
            </Dialog>
            <Link href="/">
              <a className="font-display text-white font-semibold text-base sm:text-lg tracking-wide cursor-pointer">Sharvatex</a>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1db954] text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm"
            >
              <span className="w-4 h-4"><WhatsAppIcon /></span>
              WhatsApp
            </a>
            <Link
              href="/admin/login"
              className="text-[#C9A44C] hover:text-white text-sm font-medium transition-colors px-2 py-1"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="hero-pattern relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A44C]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/3 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center px-5 py-14 sm:py-20 lg:py-28">
          <div className="gold-divider w-16 sm:w-24 mx-auto mb-6 sm:mb-8 opacity-60" />

          <p className="text-[#C9A44C] text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-3 sm:mb-4">
            Premium Saree Wholesale
          </p>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-5 leading-tight">
            Sharvatex
          </h1>

          <p className="text-white/55 text-sm sm:text-base lg:text-lg max-w-md sm:max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8">
            Finest quality sarees — Elampillai Soft Silk, Arani Silk, Kalyani Cotton & Maheswari Cotton — directly from the weaver.
          </p>

          <div className="gold-divider w-16 sm:w-24 mx-auto mb-6 sm:mb-8 opacity-60" />

          {/* Trust badges — single row on all sizes */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap">
            {['Wholesale Prices', 'Bulk Orders', 'Fast Dispatch'].map((label) => (
              <div key={label} className="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm">
                <span className="text-[#C9A44C] text-[10px]">✦</span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-8 sm:mt-10">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C9A44C] hover:bg-[#b8923e] text-white font-semibold px-6 sm:px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-xl hover:shadow-[#C9A44C]/30 text-sm sm:text-base"
            >
              <span className="w-4 h-4"><WhatsAppIcon /></span>
              Enquire Now
            </a>
          </div>
        </div>
      </div>

      {/* ── Feature Strip ── */}
      <div className="bg-white border-y border-[#e8e0d0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: '🥻', title: 'Pure Silk', desc: 'Authentic weaves' },
              { icon: '🏭', title: 'Direct from Mill', desc: 'No middleman' },
              { icon: '📦', title: 'Bulk Orders', desc: 'Min. qty flexible' },
              { icon: '🚚', title: 'Pan India', desc: 'Fast shipping' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-[#0F3D2E] font-semibold text-sm leading-tight">{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Image Slider ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="slider-container" style={{ aspectRatio: '21/9' }}>
          {sliderImages.map((src, idx) => (
            <div
              key={src}
              className={`slider-slide ${idx === currentSlide ? 'active' : ''}`}
            >
              <img src={src} alt={`Sharvatex showcase ${idx + 1}`} loading={idx === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-2xl" />
          {/* Navigation dots */}
          <div className="slider-dots">
            {sliderImages.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Collection ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-[#C9A44C] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-2">Browse</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F3D2E]">Our Collection</h2>
          <div className="gold-divider w-12 sm:w-16 mx-auto mt-3 sm:mt-4" />
        </div>

        <div className="mb-6 sm:mb-8">
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        <ProductGrid products={filtered} loading={loading} error={error} whatsappNumber={whatsappNumber} />
      </div>

      {/* ── Contact Banner ── */}
      <div className="bg-gradient-to-r from-[#0F3D2E] to-[#1a5c42] mx-4 sm:mx-6 lg:mx-8 rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-12 sm:mb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A44C' fill-opacity='1'%3E%3Ccircle cx='5' cy='5' r='1.5'/%3E%3Ccircle cx='25' cy='25' r='1.5'/%3E%3C/g%3E%3C/svg%3E")` }}
        />
        <div className="relative">
          <p className="text-[#C9A44C] text-xs font-bold tracking-widest uppercase mb-2">Wholesale Inquiries</p>
          <h3 className="font-display text-white text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Ready to Order?</h3>
          <p className="text-white/50 text-sm sm:text-base mb-5 sm:mb-6 max-w-sm mx-auto">
            Chat with us on WhatsApp for pricing, bulk discounts & samples.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1db954] text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all shadow-lg hover:shadow-green-900/40 text-sm sm:text-base"
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5"><WhatsAppIcon /></span>
            +{whatsappNumber}
          </a>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#0B3023] text-white">
        <div className="gold-divider opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <img src="/images/logo.jpeg" alt="Sharvatex Logo" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-display text-[#C9A44C] font-semibold text-lg">Sharvatex</span>
              </div>
              <p className="text-white/30 text-xs">Premium Saree Wholesale</p>
            </div>

            {/* Categories */}
            <div className="text-center sm:text-left">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Categories</p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-hide">
                {categories.length > 0 ? categories.map(cat => (
                  <p 
                    key={cat.id} 
                    className="text-white/30 text-xs hover:text-[#C9A44C] transition-colors cursor-pointer"
                    onClick={() => {
                      setCategory(cat.name);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                  >
                    {cat.name}
                  </p>
                )) : (
                  <p className="text-white/30 text-xs">Loading categories...</p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left mt-6 sm:mt-0">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Quick Links</p>
              <div className="space-y-1.5 flex flex-col items-center sm:items-start">
                <Link href="/about" className="text-white/30 text-xs hover:text-[#C9A44C] transition-colors">About Us</Link>
                <Link href="/contact" className="text-white/30 text-xs hover:text-[#C9A44C] transition-colors">Contact Us</Link>
                <Link href="/privacy" className="text-white/30 text-xs hover:text-[#C9A44C] transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-white/30 text-xs hover:text-[#C9A44C] transition-colors">Terms & Conditions</Link>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center sm:text-left">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Contact</p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-2 text-[#25D366] hover:text-white transition-colors text-sm font-medium"
              >
                <span className="w-4 h-4"><WhatsAppIcon /></span>
                +{whatsappNumber}
              </a>
            </div>
          </div>

          <div className="gold-divider w-full mt-8 mb-4 opacity-20" />
          <p className="text-center text-white/20 text-xs">&copy; {new Date().getFullYear()} Sharvatex. All rights reserved.</p>
        </div>
      </footer>

      {/* ── Floating WhatsApp Button (mobile only) ── */}
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden fixed bottom-5 right-4 z-50 flex items-center gap-2 bg-[#25D366] text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-green-900/40 hover:bg-[#1db954] transition-all active:scale-95"
        style={{ boxShadow: '0 4px 24px rgba(37,211,102,0.45)' }}
      >
        <span className="w-5 h-5"><WhatsAppIcon /></span>
        <span className="text-sm">Chat Now</span>
      </a>
    </div>
  )
}
