import { useApp } from '../context/AppContext';
import { Mail, Github, Heart, MessageSquare, Shield, HelpCircle, FileText } from 'lucide-react';

export default function Footer() {
  const { setCurrentPage, setSelectedCategory } = useApp();

  const currentYear = new Date().getFullYear();

  const handleFooterNav = (page: string, category?: 'skincare' | 'merchandise') => {
    if (category) {
      setSelectedCategory(category);
    }
    setCurrentPage(page);
  };

  return (
    <footer className="border-t border-white/10 bg-[#0A0715]/90 pt-16 pb-8" id="store-main-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Intro Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-pink-500 to-violet-600 text-white font-extrabold text-xs">
              AG
            </div>
            <span className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
              ANIMEGLOW
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Step into the holographic anime apothecary. We blend standard Japanese cherry blossom extracts and snail mucin formulas with premium original streetwear and LED collectibles for the ultimate youth lifestyle brand.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 hover:text-pink-400 hover:border-pink-500/30 transition">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 hover:text-pink-400 hover:border-pink-500/30 transition">
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">APOTHECARY SECRETS</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleFooterNav('shop', 'skincare')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Teen Skincare Regimens
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('shop', 'merchandise')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Anime Hoodies & Oversized
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('shop', 'merchandise')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                LED Oni Lamps & Acrylics
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('quiz')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Skin Elemental Quiz Match
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('rewards')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Lucky Spin rewards
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">PILOT COCKPIT</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleFooterNav('faq')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Hologram FAQs
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('track')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Track Chrono-Order
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('about')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                About AnimeGlow Clan
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('contact')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Transmit Signal (Contact)
              </button>
            </li>
            <li>
              <button onClick={() => handleFooterNav('blog')} className="text-slate-400 hover:text-pink-400 transition font-medium">
                Cosmic Chronicles (Blog)
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter Transmissions */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-cyan-400 font-mono tracking-widest uppercase">CHRONO TRANSMISSIONS</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Transmit your holo-address to secure secret discount codes and anime-themed gacha event notices before anyone else.
          </p>
          <form 
            onSubmit={(e) => { e.preventDefault(); alert("Transmissions online! Verified protocol registered."); }}
            className="flex items-center gap-1.5 border border-white/10 bg-white/5 p-1.5 rounded-xl backdrop-blur"
          >
            <input
              type="email"
              placeholder="Enter terminal email..."
              required
              className="flex-1 bg-transparent px-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-slate-950 font-black font-sans text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
            >
              Sign Up
            </button>
          </form>
        </div>

      </div>

      {/* Sub-Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-1">
          <span>© {currentYear} AnimeGlow. Styled in Tokyo-Cyber Matrix.</span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <span className="flex items-center gap-1 text-pink-500">
            <Heart className="h-3 w-3 fill-current" /> Made by anime fans for anime fans
          </span>
          <span className="text-slate-600">No copyrighted assets. Custom procedural artwork assets active.</span>
        </div>
      </div>
    </footer>
  );
}
