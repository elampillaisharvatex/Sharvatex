import { Link } from "wouter"

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#f8f5f0] flex flex-col">
      <nav className="bg-[#0B3023]/96 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#C9A44C] to-[#e8c76a] flex items-center justify-center text-sm sm:text-base shadow">
              🧵
            </div>
            <span className="font-display text-white font-semibold text-base sm:text-lg tracking-wide">Sharvatex</span>
          </Link>
          <Link href="/" className="text-[#C9A44C] text-sm font-medium hover:text-white transition-colors">
            &larr; Back to Shop
          </Link>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 prose prose-stone lg:prose-lg max-w-none w-full">
        <h1 className="text-[#0F3D2E] font-display text-3xl sm:text-4xl mb-6">Terms & Conditions</h1>
        
        <h2>1. Welcome to Sharvatex</h2>
        <p>By accessing our website and engaging in business with us, you agree to be bound by these Terms & Conditions.</p>

        <h2>2. Wholesale Orders</h2>
        <p>
          We are primarily a wholesale provider. All products shown on the site are subject to minimum order quantities unless otherwise specified via our WhatsApp sales channel. Pricing shown is exclusive of shipping, taxes, and handling fees unless explicitly stated.
        </p>

        <h2>3. Shipping & Delivery</h2>
        <p>
          Shipping timelines depend on the order volume and destination. We partner with reliable courier services for Pan-India delivery. Dispatch times are estimates and may vary.
        </p>

        <h2>4. Returns & Exchanges</h2>
        <p>
          Given the wholesale nature of our business, returns are only accepted in cases of manufacturing defects. Claims must be raised within 48 hours of receiving the parcel, accompanied by an unpacking video.
        </p>

      </div>

      <footer className="bg-[#0B3023] text-center py-6 mt-auto">
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Sharvatex. All rights reserved.</p>
      </footer>
    </div>
  )
}
