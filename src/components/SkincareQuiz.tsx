import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, Product } from '../data/products';
import { Sparkles, RefreshCw, ShoppingCart, Check, Shield, Star, Flame, Sun, Droplet } from 'lucide-react';

interface QuizStep {
  title: string;
  subtitle: string;
  options: {
    value: string;
    label: string;
    desc: string;
    icon: any;
  }[];
}

export default function SkincareQuiz() {
  const { user, updateUserSkinType, addPoints, addToCart } = useApp();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [results, setResults] = useState<{
    className: string;
    description: string;
    recommendedSkin: Product[];
    recommendedMerch: Product;
  } | null>(null);

  const steps: QuizStep[] = [
    {
      title: "IDENTIFY YOUR ELEMENTAL SKIN DEFENSE",
      subtitle: "Which of these environmental vulnerabilities matches your skin state?",
      options: [
        { value: "oily", label: "FLAME EMBER (Oily / Sebum)", desc: "Excess shine, clogged pores, and heat breakouts.", icon: Flame },
        { value: "dry", label: "FROST RIME (Dry / Sensitive)", desc: "Flakiness, dry spots, redness, and tight feeling.", icon: Droplet },
        { value: "dehydrated", label: "VOID MIST (Dehydrated)", desc: "Dull texture from late-night screens and study.", icon: Shield },
        { value: "balanced", label: "HARMONY DEW (Balanced)", desc: "Smooth skin with minor occasional concerns.", icon: Star }
      ]
    },
    {
      title: "CHOOSE YOUR LEGENDARY GLOW QUEST",
      subtitle: "What is your absolute highest priority cosmetic achievement?",
      options: [
        { value: "acne", label: "BANISH BREAKOUTS", desc: "Purge impurities and heal blemishes immediately.", icon: Flame },
        { value: "glass", label: "UNLOCK GLASS SKIN", desc: "Ultimate deep hydration and luminous translucent bounce.", icon: Droplet },
        { value: "shield", label: "SCREEN BLUE LIGHT ARMOR", desc: "Defend against radiation from late-night anime gaming.", icon: Shield },
        { value: "smooth", label: "REFINE SKIN VELVET", desc: "Smooth pores, even tone, and rich, supple texture.", icon: Star }
      ]
    },
    {
      title: "DECLARE YOUR ANIME LIFESTYLE STYLE",
      subtitle: "Which of these physical relics represents your aesthetic desk style?",
      options: [
        { value: "hoodie", label: "STREETWEAR TECHWEAR", desc: "Oversized cozy black hoodies with neon decals.", icon: Shield },
        { value: "figurine", label: "COLLECTOR STANDS & PLUSHIES", desc: "Articulated chibis and super squishy fox familiars.", icon: Star },
        { value: "lamp", label: "RGB CHROMA LEDS", desc: "Glowing 16-color laser engraved Oni masks.", icon: Flame },
        { value: "gacha", label: "MYSTERY GACHA BOXES", desc: "The pure thrill of unboxing limited-run blind figures.", icon: Droplet }
      ]
    }
  ];

  const handleSelect = (value: string) => {
    const nextSelections = { ...selections, [step]: value };
    setSelections(nextSelections);

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      calculateResults(nextSelections);
    }
  };

  const calculateResults = (finalSelections: Record<number, string>) => {
    const skinType = finalSelections[0];
    const quest = finalSelections[1];
    const merchStyle = finalSelections[2];

    // Determine anime class
    let className = "";
    let description = "";
    let skinRecommendations: Product[] = [];
    let merchRecommendation: Product;

    // 1. Filter skin items
    if (skinType === 'oily' || quest === 'acne') {
      className = "KITSUNE FLAME EXORCIST";
      description = "Your skin possesses high energetic power but generates excess heat, causing spots. Your quest requires lightweight, non-comedogenic clearing solutions.";
      skinRecommendations = PRODUCTS.filter(p => 
        p.id === 'skin-02' || p.id === 'skin-08' || p.id === 'skin-11' || p.id === 'skin-22'
      ).slice(0, 3);
    } else if (skinType === 'dry' || quest === 'glass') {
      className = "GLASS GLOW WATER CLERIC";
      description = "Your skin is a delicate spiritual garden that thrives on deep moisture. Your quest demands nutrient-rich elixirs to lock in that glassy translucency.";
      skinRecommendations = PRODUCTS.filter(p => 
        p.id === 'skin-01' || p.id === 'skin-12' || p.id === 'skin-09' || p.id === 'skin-19'
      ).slice(0, 3);
    } else if (skinType === 'dehydrated' || quest === 'shield') {
      className = "SOLAR BARRIER SHIELD SENTRY";
      description = "Your skin undergoes intense high-frequency radiation from late-night screen time. You require soothing, blue-light filtering, and skin-barrier reinforcing items.";
      skinRecommendations = PRODUCTS.filter(p => 
        p.id === 'skin-03' || p.id === 'skin-06' || p.id === 'skin-05' || p.id === 'skin-17'
      ).slice(0, 3);
    } else {
      className = "SACRED HARMONY ZEN DRUID";
      description = "Your skin is balanced and peaceful. You benefit from pure organic tea, rosewater hydrosols, and light botanical scrubs to maintain your perfect skin state.";
      skinRecommendations = PRODUCTS.filter(p => 
        p.id === 'skin-07' || p.id === 'skin-16' || p.id === 'skin-25' || p.id === 'skin-15'
      ).slice(0, 3);
    }

    // 2. Filter merchandise item
    if (merchStyle === 'hoodie') {
      merchRecommendation = PRODUCTS.find(p => p.id === 'merch-01') || PRODUCTS[25];
    } else if (merchStyle === 'figurine') {
      merchRecommendation = PRODUCTS.find(p => p.id === 'merch-05') || PRODUCTS[29];
    } else if (merchStyle === 'lamp') {
      merchRecommendation = PRODUCTS.find(p => p.id === 'merch-04') || PRODUCTS[28];
    } else {
      merchRecommendation = PRODUCTS.find(p => p.id === 'merch-25') || PRODUCTS[49];
    }

    // Save results
    setResults({
      className,
      description,
      recommendedSkin: skinRecommendations,
      recommendedMerch: merchRecommendation
    });

    // Update user profile skin type
    updateUserSkinType(
      skinType === 'oily' ? 'Oily / Breakout Prone' : skinType === 'dry' ? 'Dry / Sensitive' : skinType === 'dehydrated' ? 'Dehydrated Screen-Exposed' : 'Normal / Balanced',
      [className, quest === 'acne' ? 'Acne Banish' : 'Glass Hydration', merchRecommendation.name]
    );

    // Award 100 Glow Points!
    addPoints(100);
  };

  const resetQuiz = () => {
    setStep(0);
    setSelections({});
    setResults(null);
  };

  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: Product) => {
    addToCart(product, product.variants[0], 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="skincare-quiz-main-container">
      
      {/* Title Card */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 font-mono text-xs font-bold text-pink-400 uppercase tracking-widest mb-3 animate-pulse">
          <Sparkles className="h-3 w-3" />
          <span>Interactive Alchemical Quiz</span>
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400">
          Unlock Your Skin Stats
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Answer 3 simple questions. Our magical apothecary will calculate your skin elemental class, recommend the perfect skincare regimen, and award you <span className="text-yellow-400 font-bold">+100 GLOW POINTS</span>!
        </p>
      </div>

      {/* Main Panel */}
      <div className="border border-purple-500/20 rounded-3xl bg-slate-950/80 backdrop-blur-md p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Neon decorative background light grids */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {!results ? (
          /* Step View */
          <div>
            {/* Progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 mb-8">
              <div 
                className="bg-gradient-to-r from-pink-500 to-cyan-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>

            <div className="text-center sm:text-left mb-6">
              <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
                Step {step + 1} of {steps.length}
              </span>
              <h3 className="text-xl font-extrabold text-slate-100 tracking-wide mt-1 uppercase">
                {steps[step].title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {steps[step].subtitle}
              </p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {steps[step].options.map((option, idx) => {
                const IconComp = option.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option.value)}
                    className="group relative w-full text-left p-4 rounded-2xl border border-purple-500/20 bg-slate-900/40 hover:bg-gradient-to-br hover:from-slate-900 hover:to-purple-950/30 hover:border-pink-500/40 transition duration-300 hover:shadow-xl hover:shadow-pink-500/5 focus:outline-none"
                    id={`quiz-option-${step}-${option.value}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-500 group-hover:text-slate-950 transition duration-300 shrink-0">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider block group-hover:text-pink-400 transition">
                          {option.label}
                        </span>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="animate-fade-in" id="quiz-results-view">
            
            <div className="text-center pb-6 border-b border-purple-500/20 mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 animate-bounce mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-mono text-xs text-cyan-400 tracking-widest uppercase font-black">
                Cosmic Skin Alignment Calculated!
              </h3>
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 mt-1 uppercase">
                {results.className}
              </h2>
              <div className="mt-2 text-xs font-mono text-yellow-400 font-bold bg-yellow-500/10 inline-block px-3 py-1 rounded-full border border-yellow-500/20">
                ⭐ {user ? user.name : 'Sakura'} GAINED +100 GLOW POINTS!
              </div>
              <p className="text-xs text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
                {results.description}
              </p>
            </div>

            {/* Recommendations Grid */}
            <div>
              <h4 className="text-xs font-bold text-cyan-400 font-mono tracking-wider uppercase mb-4 text-center sm:text-left">
                🧪 Recommended Apothecary Regimen:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.recommendedSkin.map((product) => (
                  <div 
                    key={product.id}
                    className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4 flex flex-col justify-between hover:border-pink-500/30 transition group"
                  >
                    <div>
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 text-[8px] font-mono font-bold bg-pink-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                          {product.subCategory}
                        </span>
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-100 line-clamp-2 uppercase min-h-[32px] tracking-wide">
                        {product.name}
                      </h5>
                      <div className="mt-2 flex items-baseline gap-1.5 font-mono">
                        <span className="text-sm font-bold text-cyan-400">
                          ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-[10px] text-slate-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full mt-4 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition duration-200 ${
                        addedItems[product.id]
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-pink-500 hover:bg-pink-600 text-slate-950'
                      }`}
                    >
                      {addedItems[product.id] ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>ADDED TO BAG!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-3.5 w-3.5" />
                          <span>ADD ITEM</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Recommended Merch Callout */}
              <div className="mt-8 p-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 flex flex-col md:flex-row items-center gap-6">
                <div className="relative h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-slate-950 border border-cyan-500/30">
                  <img 
                    src={results.recommendedMerch.images[0]} 
                    alt={results.recommendedMerch.name} 
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[8px] font-mono font-bold bg-cyan-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                    Aesthetic Relic
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                    Aesthetic Relic Match
                  </span>
                  <h4 className="text-base font-black text-slate-100 uppercase tracking-wide mt-0.5">
                    {results.recommendedMerch.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 max-w-xl">
                    {results.recommendedMerch.description}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2 font-mono justify-center md:justify-start">
                    <span className="text-sm font-bold text-cyan-400">
                      ${(results.recommendedMerch.price * (1 - results.recommendedMerch.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded ml-2">
                      EXCLUSIVE STYLING RELIC
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(results.recommendedMerch)}
                  className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition duration-200 shrink-0 ${
                    addedItems[results.recommendedMerch.id]
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-cyan-400 hover:bg-cyan-500 text-slate-950'
                  }`}
                >
                  {addedItems[results.recommendedMerch.id] ? (
                    <span className="flex items-center gap-1.5 justify-center"><Check className="h-4 w-4" /> ADDED!</span>
                  ) : (
                    <span className="flex items-center gap-1.5 justify-center"><ShoppingCart className="h-4 w-4" /> RECLAIM RELIC</span>
                  )}
                </button>
              </div>

            </div>

            {/* Footer controls */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-900">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                STAT UPDATE: Skin profile registered in secure holo-cache.
              </span>
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 text-xs font-mono text-pink-400 hover:text-pink-300 border border-pink-500/20 px-4 py-2 rounded-xl bg-pink-500/5 hover:bg-pink-500/10 transition duration-150 uppercase"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Recalculate Alignment</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
