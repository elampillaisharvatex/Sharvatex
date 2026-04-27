import { Link } from "wouter"
import { useState, useEffect } from "react"
import { getSiteSettings } from "../utils/supabaseClient"

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function Contact() {
  const [whatsappNumber, setWhatsappNumber] = useState("8925677774")

  useEffect(() => {
    async function fetchNumber() {
      const settings = await getSiteSettings()
      if (settings?.whatsapp_number) setWhatsappNumber(settings.whatsapp_number)
    }
    fetchNumber()
  }, [])

  // Helper to ensure 10 digit numbers get a country code
  const getWhatsAppUrl = () => {
    let cln = (whatsappNumber || "8925677774").replace(/\D/g, '');
    if (cln.length === 10) cln = `91${cln}`;
    return `https://wa.me/${cln}`;
  };

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

      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full flex flex-col items-center min-h-[500px] justify-center">
        <h1 className="text-[#0F3D2E] font-display text-3xl sm:text-4xl mb-4 font-bold">Contact Us</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">Our team is available to assist you with bulk orders, pricing, and shipping inquiries.</p>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#e8e0d0]/50 text-center">
          <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6">
            <WhatsAppIcon />
          </div>
          <h2 className="text-xl font-bold text-[#0F3D2E] mb-2">WhatsApp Support</h2>
          <p className="text-gray-500 text-sm mb-6">Fastest way to get answers.</p>
          
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1db954] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-900/10"
          >
            Chat Support (+{whatsappNumber})
          </a>
        </div>
      </div>

      <footer className="bg-[#0B3023] text-center py-6 mt-auto">
        <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} Sharvatex. All rights reserved.</p>
      </footer>
    </div>
  )
}
