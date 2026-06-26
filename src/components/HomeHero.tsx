import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import ThreeProductCanvas from './ThreeProductCanvas';
import { Sparkles, ShoppingBag, Wand2, ArrowRight } from 'lucide-react';

export default function HomeHero() {
  const { setCurrentPage, setSelectedCategory } = useApp();
  const [sakuraPetals, setSakuraPetals] = useState<{ id: number; left: number; delay: number; scale: number; speed: number }[]>([]);

  // Generate fluttering sakura petals
  useEffect(() => {
    const petals = Array.from({ length: 15 }).map((_, idx) => ({
      id: idx,
      left: Math.random() * 100, // percentage
      delay: Math.random() * 8, // seconds
      scale: 0.5 + Math.random() * 0.8,
      speed: 6 + Math.random() * 8 // seconds
    }));
    setSakuraPetals(petals);
  }, []);

  return (
    <div className="relative w-full bg-[#0A0715] overflow-hidden border-b border-white/10 min-h-[92vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" id="chrono-hero-sanctuary">
      
      {/* Background neon city overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=1600&auto=format&fit=crop&q=80" 
          alt="Neon Tokyo streets background" 
          className="w-full h-full object-cover opacity-20 filter saturate-150 brightness-[0.4]"
        />
        {/* Soft magical vignetting & glowing radial gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0715] via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0715] via-transparent to-[#0A0715]/90"></div>
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* Floating Sakura Petals Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" id="sakura-particle-vortex">
        {sakuraPetals.map((petal) => (
          <div
            key={petal.id}
            className="absolute top-[-5%] w-3.5 h-2 rounded-full bg-pink-400/60 shadow-[0_0_10px_#f472b6] rotate-12"
            style={{
              left: `${petal.left}%`,
              animation: `sakura-drift ${petal.speed}s linear infinite`,
              animationDelay: `${petal.delay}s`,
              transform: `scale(${petal.scale})`,
              opacity: 0.7
            }}
          />
        ))}
      </div>

      {/* Hero Core Content */}
      <div className="relative z-20 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Copywriter & Call-To-Action */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 font-mono text-[10px] font-bold text-pink-400 uppercase tracking-[0.3em] animate-pulse">
            <Sparkles className="h-3 w-3" />
            <span>THE DIGITAL SKIN REVOLUTION</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] text-white uppercase font-sans">
            CYBER<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 drop-shadow-sm">
              RADIANZ
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Step into a futuristic apothecary where Japanese botanicals meet cyberpunk anime collectibles. Formulated especially for teenagers and active gaming lifestyles—100% cruelty-free, bio-active, and legally secure original character creations.
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setCurrentPage('shop');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-pink-500/20 hover:scale-[1.03] transition duration-200 flex items-center justify-center gap-2 group"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>SHOP THE MATRIX</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => setCurrentPage('quiz')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-cyan-500/30 hover:border-cyan-400 bg-slate-950/40 hover:bg-cyan-500/10 text-cyan-400 text-xs font-black tracking-widest uppercase transition duration-200 flex items-center justify-center gap-2"
            >
              <Wand2 className="h-4 w-4 animate-spin-slow" />
              <span>ALIGNMENT QUIZ (+100 GP)</span>
            </button>
          </div>

          {/* Features checkoff bar */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0 font-mono text-[9px] uppercase tracking-wider text-slate-500 text-center lg:text-left">
            <div>
              <span className="text-cyan-400 font-bold block text-sm">🧪 BIO-ACTIVE</span>
              Snail Mucin & Cherry extracts
            </div>
            <div>
              <span className="text-pink-400 font-bold block text-sm">🦊 ORIGINAL IP</span>
              Legally Safe Mascot Relics
            </div>
            <div>
              <span className="text-yellow-400 font-bold block text-sm">🎡 GAMIFIED</span>
              Spin for daily coupon codes
            </div>
          </div>

        </div>

        {/* Right Side: Holographic Interactive 3D Potion Stage */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          
          <div className="relative w-full max-w-[380px] aspect-square rounded-[40px] bg-white/5 border border-white/20 shadow-2xl p-6 flex flex-col justify-between overflow-hidden group">
            {/* Neon scanner lines inside 3D frame */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30 animate-scan"></div>
            
            <div className="z-10 flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> STAGE READY</span>
              <span>ITEM_ID: BOTTLE_COSMOS</span>
            </div>

            {/* Interactive 3D Canvas */}
            <div className="flex-1 w-full min-h-[220px] relative">
              <ThreeProductCanvas
                threedType="crystal"
                primaryColor="#FF4FA3"
                secondaryColor="#00E5FF"
                imageUrl="https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80"
              />
            </div>

            <div className="z-10 text-center text-[10px] font-mono text-slate-500">
              CLICK AND DRAG TO ALIGN ORBITAL COORDINATES
            </div>
          </div>

          {/* Quick Stats banner */}
          <div className="mt-4 flex items-center gap-2 bg-white/5 border border-white/10 py-1.5 px-3.5 rounded-full text-[10px] font-mono font-bold text-yellow-400 shadow-lg">
            <span>🔥 NEW CORE INSTALLED:</span>
            <span className="text-white">KITSUNE CRYSTAL SHIELD</span>
            <span className="text-emerald-400 font-black">99.8% GLOW SYNC</span>
          </div>

        </div>

      </div>

      {/* Simple style additions inside index.css can support these animations, but we can write basic keyframes directly in styled components if needed or in index.css */}
    </div>
  );
}
