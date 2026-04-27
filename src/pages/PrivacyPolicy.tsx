import { Link } from "wouter"

export default function PrivacyPolicy() {
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
        <h1 className="text-[#0F3D2E] font-display text-3xl sm:text-4xl mb-6">Privacy Policy</h1>
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
        <p>
          At Sharvatex, your privacy is our priority. We are committed to protecting your personal information and being transparent about what we do with it.
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you interact with our website to browse our collection or contact us via WhatsApp, we may collect information regarding your device, browser, and navigation patterns to improve our service.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to bulk inquiries effectively via WhatsApp.</li>
          <li>To personalize your shopping experience.</li>
          <li>To improve website performance.</li>
        </ul>

        <p>
          We do not sell, rent, or trade your personal information to third parties. 
        </p>
      </div>

      <footer className="bg-[#0B3023] text-center py-6 mt-auto">
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Sharvatex. All rights reserved.</p>
      </footer>
    </div>
  )
}
