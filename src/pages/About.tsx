import { Link } from "wouter"

export default function About() {
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
        <h1 className="text-[#0F3D2E] font-display text-3xl sm:text-4xl mb-6">About Us</h1>
        <p>
          Welcome to Sharvatex. We are dedicated to bringing you the finest selection of premium silk and cotton sarees directly from the weavers.
        </p>
        <p>
          Based in the heart of traditional textile hubs, we cut out the middlemen to offer you wholesale prices without compromising on quality. Every piece in our collection tells a story of heritage, craftsmanship, and elegance.
        </p>
        <h2>Our Mission</h2>
        <p>
          To empower local weavers while providing retailers and individuals across the globe with access to authentic Indian ethnic wear.
        </p>
      </div>

      <footer className="bg-[#0B3023] text-center py-6">
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Sharvatex. All rights reserved.</p>
      </footer>
    </div>
  )
}
