import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Sparkles, AlertCircle, Smile, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Dialogue {
  trigger: string;
  response: string;
}

export default function MascotWidget() {
  const { currentPage, user, points } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [speech, setSpeech] = useState("Konnichiwa! I'm Hiku, your Magical Skincare Kitsune! 🦊 How can I level up your glow stats today?");
  const [unread, setUnread] = useState(true);

  // Chibi animation states
  const [animationState, setAnimationState] = useState<'idle' | 'blink' | 'wave' | 'bounce' | 'sparkle'>('idle');
  const [mascotLabel, setMascotLabel] = useState<string>('');

  // Chibi animation variants
  const emojiVariants = {
    idle: {
      y: [0, -4, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    blink: {
      scaleY: [1, 0.2, 1, 0.2, 1],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    wave: {
      rotate: [0, -18, 18, -18, 18, 0],
      x: [0, -3, 3, -3, 3, 0],
      transition: {
        duration: 1.2,
        ease: "easeInOut"
      }
    },
    bounce: {
      y: [0, -25, 0, -10, 0],
      scaleY: [1, 0.7, 1.2, 0.9, 1],
      transition: {
        duration: 1.0,
        ease: "easeOut"
      }
    },
    sparkle: {
      scale: [1, 1.25, 0.95, 1.1, 1],
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 1.2,
        ease: "backInOut"
      }
    }
  };

  useEffect(() => {
    // Timer to trigger random chibi animations periodically
    let activeTimer: NodeJS.Timeout;

    const triggerRandomAnimation = () => {
      const states: ('blink' | 'wave' | 'bounce' | 'sparkle')[] = ['blink', 'wave', 'bounce', 'sparkle'];
      const randomState = states[Math.floor(Math.random() * states.length)];
      
      setAnimationState(randomState);

      // Associated status labels
      if (randomState === 'blink') {
        setMascotLabel('*blink blink* ✨');
      } else if (randomState === 'wave') {
        setMascotLabel('Konnichiwa! 👋');
      } else if (randomState === 'bounce') {
        setMascotLabel('Hop! Hop! 🎉');
      } else if (randomState === 'sparkle') {
        setMascotLabel('Feel the glow! 💖');
      }

      // Reset to idle after animation finishes
      setTimeout(() => {
        setAnimationState('idle');
        setMascotLabel('');
      }, 2500);

      // Schedule next random trigger between 20 and 50 seconds
      const nextDelay = Math.random() * 30000 + 20000; // 20s to 50s
      activeTimer = setTimeout(triggerRandomAnimation, nextDelay);
    };

    // First trigger after 12 seconds
    activeTimer = setTimeout(triggerRandomAnimation, 12000);

    return () => {
      clearTimeout(activeTimer);
    };
  }, []);

  // Dynamic dialogue depending on the active page
  useEffect(() => {
    if (isOpen) return; // don't disrupt active chat

    let pageLines: string[] = [];
    switch (currentPage) {
      case 'home':
        pageLines = [
          "Welcome to the sanctuary of glow! ✨ Check out our 3D product previews - they are super cool!",
          "Did you know? Taking our Glow Quiz awards you bonus loyalty points! 📝",
          "Konnichiwa! Feeling like a legendary main character today? 🌟"
        ];
        break;
      case 'shop':
        pageLines = [
          "So many choices! Skincare or awesome merch? Why not both! 🛍️",
          "You can filter by category or price to find your perfect magical match!",
          "Hover over any product to see its 3D model orbit! Drag to inspect details!"
        ];
        break;
      case 'quiz':
        pageLines = [
          "Time to unlock your skin stats! Answer honestly so I can recommend the perfect mana-restorers! 🔮",
          "No pressure! It takes less than a minute and reveals your perfect skincare routine!"
        ];
        break;
      case 'rewards':
        pageLines = [
          "The Lucky Wheel is waiting! Spin to win real Glow Points! 🎡",
          "Earn points with every purchase and rank up from 'Glow Cadet' to 'Elite Otaku'!"
        ];
        break;
      case 'cart':
        pageLines = [
          "Ooh, excellent haul! 🛒 Remember, use coupon code 'GLOW20' for a lovely 20% discount!",
          "Your skin is going to thank you! Ready to complete your quest?"
        ];
        break;
      case 'user':
        pageLines = [
          `Welcome to your cockpit, ${user ? user.name : 'recruit'}! Check your active quests and items here! 🎯`,
          `You have ${points} Glow Points! That is extremely impressive!`
        ];
        break;
      default:
        pageLines = ["Hiku is always here to guide you through the magical glow lands! 🦊"];
    }

    const randomLine = pageLines[Math.floor(Math.random() * pageLines.length)];
    setSpeech(randomLine);
    setUnread(true);

    // Auto flash notice after 3 seconds on page transition
    const timer = setTimeout(() => {
      if (!isOpen) {
        // Just wiggle/pulse mascot
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentPage, isOpen, user]);

  const hikuResponses = [
    {
      q: "✨ Skin Help: Fighting Acne",
      a: "No worries, warrior! My kitsune fire recommends our 'Holographic Star-Shape Acne Patches' and 'Lunar Tea Tree night cream'! They calm redness overnight without drying your skin! 🌟"
    },
    {
      q: "🌸 How to get 'Glass Skin'",
      a: "The secret is deep, multi-layered hydration! Use our 'Sakura Dew Glowing Hydration Toner' twice daily, followed by the 'Mana Restore Snail Mucin Serum'. Finish with the whipped 'Mochi Skin Moisturizer'! So plump! 🍡"
    },
    {
      q: "🛡️ Screen Light Protection?",
      a: "Gamers and binge-watchers, beware! Blue light drains your skin's vitality. Apply our 'Magical Shield SPF 50+ Sunscreen' daily - it acts as a magical forcefield against sun and screens alike! 🖥️"
    },
    {
      q: "🎁 How do I earn Glow Points?",
      a: "So many ways! You get 300 GP just for signing up, 5 GP for adding products, and 10 GP for every dollar spent on purchases! Plus, spin the lucky wheel daily! 🎡"
    }
  ];

  const handleQuestionClick = (answer: string) => {
    setSpeech(answer);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3" id="mascot-widget-wrapper">
      
      {/* Speech Bubble */}
      {isOpen ? (
        <div 
          className="w-80 sm:w-96 rounded-[32px] border border-white/20 bg-[#0A0715]/90 p-4 shadow-2xl shadow-pink-500/10 backdrop-blur-xl animate-scale-up"
          id="mascot-chat-bubble"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🦊</span>
              <div>
                <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 font-mono tracking-wider">HIKU THE GLOW MASCOT</h4>
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Apothecary Tier 5 Guardian</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-pink-500 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Dialogue text */}
          <div className="bg-white/5 rounded-2xl p-3 border border-white/10 mb-4 max-h-40 overflow-y-auto">
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
              {speech}
            </p>
          </div>

          {/* FAQ Prompts */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">Glow Advice Presets:</span>
            {hikuResponses.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item.a)}
                className="w-full text-left text-[11px] font-medium text-pink-400 hover:text-slate-100 hover:bg-pink-500/10 border border-pink-500/20 rounded-lg py-1.5 px-3 transition duration-150 flex items-center gap-2"
              >
                <HelpCircle className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <span>{item.q}</span>
              </button>
            ))}
          </div>

          {/* Points Footer inside Chat */}
          <div className="mt-4 pt-2 border-t border-slate-900 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>STATS: LEVEL 18 CUTE KITSUNE</span>
            <span className="text-pink-500 animate-pulse">❤ ACTIVE REGEN ACTIVE</span>
          </div>

        </div>
      ) : (
        /* Expand notification preview */
        unread && (
          <div 
            onClick={() => { setIsOpen(true); setUnread(false); }}
            className="hidden sm:flex max-w-xs items-center gap-2 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-3 shadow-xl backdrop-blur-md cursor-pointer animate-bounce hover:border-pink-500/40 group"
          >
            <span className="text-xl">🦊</span>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-cyan-400 font-mono tracking-wider block uppercase">Hiku has a tip!</span>
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-tight">
                {speech}
              </p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setUnread(false); }}
              className="text-slate-500 hover:text-slate-300 p-0.5 rounded"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )
      )}

      {/* Floating dynamic label bubble when doing chibi animations */}
      <AnimatePresence>
        {mascotLabel && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="bg-[#090616]/95 border border-pink-500/30 px-3 py-1 rounded-full text-[10px] font-mono font-black text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.25)] flex items-center gap-1.5 z-50 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse" />
            <span>{mascotLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with chibi animations */}
      <motion.button
        onClick={() => { setIsOpen(!isOpen); setUnread(false); }}
        animate={animationState}
        variants={emojiVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 p-0.5 shadow-2xl shadow-pink-500/20 transition-all duration-300 group cursor-pointer"
        id="mascot-floating-trigger"
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 group-hover:bg-transparent transition-all duration-300">
          <span className="text-2xl transition duration-300 select-none">
            {animationState === 'idle' && '🦊'}
            {animationState === 'blink' && '🦊✨'}
            {animationState === 'wave' && '🦊👋'}
            {animationState === 'bounce' && '🦊🎉'}
            {animationState === 'sparkle' && '🦊💖'}
          </span>
        </div>
        {/* Luminous orbiting ring */}
        <span className="absolute inset-0 rounded-full border border-pink-500/40 group-hover:scale-125 group-hover:opacity-0 transition duration-500"></span>
        {/* Glow indicator */}
        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center text-[8px] font-mono font-bold text-slate-950">
          !
        </span>
      </motion.button>
      
    </div>
  );
}
