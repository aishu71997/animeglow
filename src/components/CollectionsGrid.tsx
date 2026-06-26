import { useApp } from '../context/AppContext';
import { ArrowUpRight, Flame, Heart, Sparkles, Star } from 'lucide-react';

export default function CollectionsGrid() {
  const { setCurrentPage, setSelectedCategory } = useApp();

  const handleCollectionClick = (category: 'skincare' | 'merchandise') => {
    setSelectedCategory(category);
    setCurrentPage('shop');
  };

  const collections = [
    {
      title: "SAKURA GLOW APOTHECARY",
      desc: "Rice distillates and cherry blossom elixirs to level up dry and sensitive skin. 🧪",
      image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80",
      category: 'skincare' as const,
      size: "md:col-span-2",
      badge: "SKINCARE REGIMENS",
      color: "from-pink-500/10 to-violet-600/10 border-pink-500/25",
      badgeColor: "text-pink-400 border-pink-500/30 bg-pink-500/10"
    },
    {
      title: "RGB BATTLESTATION",
      desc: "Glowing Oni lamps, heavy natural rubber mouse mats, and alloy keychains. 🎮",
      image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop&q=80",
      category: 'merchandise' as const,
      size: "md:col-span-1",
      badge: "DESK UPGRADES",
      color: "from-cyan-500/10 to-purple-600/10 border-cyan-500/25",
      badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
    },
    {
      title: "NEO TOKYO STREETWEAR",
      desc: "Oversized cotton fleece hoodies with custom Kanji sleeve prints. 👕",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80",
      category: 'merchandise' as const,
      size: "md:col-span-1",
      badge: "COZY MERCH",
      color: "from-violet-500/10 to-pink-600/10 border-violet-500/25",
      badgeColor: "text-violet-400 border-violet-500/30 bg-violet-500/10"
    },
    {
      title: "GACHA STAR BLIND BOXES",
      desc: "Unbox mysterious vinyl figurines, rare elements, and holographic mascot pets! 🎡",
      image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80",
      category: 'merchandise' as const,
      size: "md:col-span-2",
      badge: "COLLECTIBLES",
      color: "from-yellow-500/10 to-pink-600/10 border-yellow-500/25",
      badgeColor: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="curated-collections-block">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            <Star className="h-3.5 w-3.5 animate-spin-slow" />
            <span>Curated Relic Archives</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
            Curated Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Choose your faction or loadout. These curated bundles align your personal style and skin defenses with synergistic gear.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory('all');
            setCurrentPage('shop');
          }}
          className="text-xs font-mono font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1.5 uppercase shrink-0 border border-pink-500/20 px-4 py-2 rounded-xl bg-pink-500/5 hover:bg-pink-500/10 transition"
        >
          <span>View All Archives</span>
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Curated Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((col, idx) => (
          <div
            key={idx}
            onClick={() => handleCollectionClick(col.category)}
            className={`group relative rounded-[32px] border border-white/10 bg-[#0A0715]/40 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-end min-h-[280px] overflow-hidden cursor-pointer hover:scale-[1.01] hover:border-pink-500/30 transition-all duration-300 shadow-xl ${col.size}`}
            id={`collection-card-${idx}`}
          >
            {/* Background image */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img 
                src={col.image} 
                alt={col.title}
                className="w-full h-full object-cover opacity-25 filter brightness-75 group-hover:scale-105 transition duration-500"
              />
              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0715] via-[#0A0715]/40 to-transparent"></div>
            </div>

            {/* Curated Badge */}
            <div className="mb-4">
              <span className={`inline-block border rounded-full px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${col.badgeColor}`}>
                {col.badge}
              </span>
            </div>

            {/* Title & Info */}
            <h3 className="text-xl font-black text-white uppercase tracking-wide">
              {col.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 max-w-md font-medium leading-relaxed">
              {col.desc}
            </p>

            {/* Hover Arrow indicator */}
            <div className="absolute top-6 right-6 h-10 w-10 rounded-full border border-slate-800 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-slate-300 group-hover:text-pink-400 group-hover:border-pink-500/40 transition duration-300">
              <ArrowUpRight className="h-5 w-5 transform group-hover:rotate-45 transition duration-300" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
