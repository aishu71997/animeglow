import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../data/products';
import ThreeProductCanvas from './ThreeProductCanvas';
import { X, Heart, Star, ShoppingCart, Check, Info } from 'lucide-react';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isLiked = wishlist.includes(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="quick-view-modal-backdrop">
      
      {/* Container Box */}
      <div 
        className="relative w-full max-w-4xl border border-purple-500/20 rounded-3xl bg-slate-950 p-6 sm:p-8 shadow-2xl shadow-pink-500/10 overflow-y-auto max-h-[90vh] md:max-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-8"
        onClick={(e) => e.stopPropagation()}
        id={`quick-view-modal-${product.id}`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-900 hover:text-pink-500 transition z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: 3D Scene */}
        <div className="relative aspect-square md:aspect-auto md:h-full min-h-[280px] rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900/60 border border-slate-900 overflow-hidden flex flex-col justify-between p-4">
          
          {/* Neon Grid Layer in 3D Box background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
          
          <div className="z-10 flex justify-between items-start">
            <span className="rounded bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 font-mono text-[9px] font-bold text-pink-400 uppercase tracking-widest">
              3D Hologram Stage
            </span>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`rounded-full p-2 backdrop-blur-md transition ${isLiked ? 'bg-pink-500 text-slate-950' : 'bg-slate-900/80 text-slate-300 hover:text-pink-500'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="flex-1 w-full relative">
            <ThreeProductCanvas
              threedType={product.threedType}
              primaryColor={product.category === 'skincare' ? '#FF4FA3' : '#6A5CFF'}
              secondaryColor="#00E5FF"
              imageUrl={product.images?.[0]}
            />
          </div>

          <div className="z-10 text-center font-mono text-[10px] text-slate-500">
            USE CORNER METADATA CHRONICLES FOR INFO
          </div>
        </div>

        {/* Right Side: Product Customizations */}
        <div className="flex flex-col justify-between">
          <div>
            
            {/* Category */}
            <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-widest">
              {product.category} &gt; {product.subCategory}
            </span>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1 leading-tight">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-xs text-slate-100 font-bold ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-500">({product.reviewsCount} verified reviews)</span>
            </div>

            {/* Pricing */}
            <div className="mt-4 flex items-baseline gap-2.5 font-mono">
              <span className="text-xl font-extrabold text-cyan-400">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm text-slate-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="rounded bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-400">
                    SAVE {product.discount}% IN REWARD FLASH
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 mt-4 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Ingredients for Skincare */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mt-4 p-3 bg-slate-900/40 rounded-xl border border-purple-500/10">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black flex items-center gap-1.5 mb-1.5">
                  <Info className="h-3.5 w-3.5" />
                  <span>Bio-Active Infused Ingredients:</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            )}

            {/* Variant Selector */}
            <div className="mt-6">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                Choose Relic Variant:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      selectedVariant === v
                        ? 'bg-pink-500 border-pink-500 text-slate-950'
                        : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
                  Mana Quantity:
                </span>
                <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900/30 p-1 w-28">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono text-xs text-slate-100 font-extrabold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Warning */}
              <div className="flex flex-col justify-end h-full pt-6 font-mono text-[10px]">
                <span className="text-slate-500 uppercase">Apothecary Availability:</span>
                <span className={product.stock <= 15 ? 'text-rose-500 animate-pulse font-bold' : 'text-emerald-400 font-bold'}>
                  {product.stock <= 15 ? `⚠️ CRITICAL CORES: ${product.stock} PIECES` : `✅ STABLE CACHE: ${product.stock} IN INVENTORY`}
                </span>
              </div>
            </div>

          </div>

          {/* Add To Cart Trigger */}
          <div className="mt-8 pt-4 border-t border-slate-900">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-2xl text-xs font-black tracking-widest uppercase transition duration-200 ${
                added
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-pink-500 hover:bg-pink-600 text-slate-950 shadow-lg shadow-pink-500/10'
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="h-4 w-4" /> SECURED IN COGNITIVE TOTE!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <ShoppingCart className="h-4 w-4" /> ADD TO BAG • ${(discountedPrice * quantity).toFixed(2)}
                </span>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
