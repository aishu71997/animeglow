import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../data/products';
import { Heart, ShoppingCart, Star, Check, Eye, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onQuickView: (product: Product) => void;
  onImageClick?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView, onImageClick }: ProductCardProps) {
  const { cart, wishlist, toggleWishlist, addToCart, setCurrentPage, setSelectedProductId } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });

  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; rotation: number }[]>([]);

  const isLiked = wishlist.includes(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use first variant by default
    addToCart(product, product.variants[0], 1);
    setAdded(true);

    // Generate sparkle particle burst
    const sparkles = Array.from({ length: 14 }).map((_, i) => {
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = Math.random() * 55 + 25; // radius of burst
      return {
        id: Date.now() + i + Math.random(),
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: ['#EC4899', '#06B6D4', '#EAB308', '#A855F7', '#10B981'][Math.floor(Math.random() * 5)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360
      };
    });
    setParticles(sparkles);

    setTimeout(() => {
      setParticles([]);
    }, 900);

    setTimeout(() => setAdded(false), 2000);
  };

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentPage('details');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const width = box.width;
    const height = box.height;
    
    const normX = (x / width) - 0.5;
    const normY = (y / height) - 0.5;
    
    // Smooth high-contrast tilt up to 18 degrees
    const maxRotate = 18;
    const rotateY = normX * maxRotate; 
    const rotateX = -normY * maxRotate;
    
    const shineX = (x / width) * 100;
    const shineY = (y / height) * 100;
    
    setCoords({ rotateX, rotateY, shineX, shineY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ rotateX: 0, rotateY: 0, shineX: 50, shineY: 50 });
  };

  const cardStyle: React.CSSProperties = {
    transform: isHovered 
      ? `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(1.12, 1.12, 1.12)`
      : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: isHovered 
      ? 'transform 100ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 300ms ease-out' 
      : 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 500ms ease-out',
    transformStyle: 'preserve-3d',
    willChange: 'transform',
    boxShadow: isHovered 
      ? "0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(236, 72, 153, 0.35), inset 0 0 15px rgba(255, 255, 255, 0.05)" 
      : "0 4px 20px rgba(0, 0, 0, 0.2)",
  };

  const shineStyle: React.CSSProperties = {
    background: `radial-gradient(circle at ${coords.shineX}% ${coords.shineY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 55%)`,
    pointerEvents: 'none',
  };

  return (
    <motion.div
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={cardStyle}
      animate={isHovered ? {} : {
        y: [0, -6, 0],
        rotateX: [0.5, -0.5, 0.5],
        transition: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      className="group relative cursor-pointer flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0C081F]/70 p-4 backdrop-blur-md transition-colors duration-300 hover:border-pink-500/50 hover:bg-gradient-to-br hover:from-[#150F30]/80 hover:to-[#080514]/90"
      id={`product-card-${product.id}`}
    >
      {/* Glow border background decoration */}
      <motion.div 
        className="absolute -inset-[2px] -z-10 rounded-[25px] bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 blur-md pointer-events-none"
        initial={{ opacity: 0.15 }}
        animate={{ 
          opacity: isHovered ? 0.85 : 0.15,
          scale: isHovered ? 1.05 : 0.98,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card Content Top */}
      <div style={{ transformStyle: 'preserve-3d' }}>
        
        {/* Badges & Actions overlay */}
        <div 
          className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#06040C]/65 border border-white/10 mb-4 group/img-container transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
          style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}
        >
          
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-all duration-500 group-hover/img-container:scale-115 cursor-zoom-in contrast-[1.38] saturate-[1.42] brightness-[1.12] group-hover/img-container:contrast-[1.52] group-hover/img-container:saturate-[1.55] group-hover/img-container:brightness-[1.18]"
            loading="lazy"
            referrerPolicy="no-referrer"
            onClick={(e) => {
              if (onImageClick) {
                e.stopPropagation();
                onImageClick(product);
              }
            }}
            style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }}
          />

          {/* Premium diagonal high-gloss swipe effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent -translate-x-full group-hover/img-container:animate-shimmer pointer-events-none z-10" />

          {/* Glare / Shine reflection overlay */}
          <div 
            className="absolute inset-0 z-20 mix-blend-overlay opacity-0 group-hover/img-container:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={shineStyle}
          />

          {/* Glowing inner border and holo glow overlay */}
          <div className="absolute inset-0 rounded-2xl border-2 border-pink-500/20 group-hover/img-container:border-pink-500/50 shadow-[inset_0_0_18px_rgba(236,72,153,0.25)] group-hover/img-container:shadow-[inset_0_0_30px_rgba(236,72,153,0.5)] pointer-events-none z-10 transition-all duration-300" />

          {/* Quick View Button on hover */}
          <div className={`absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-2.5 backdrop-blur-[2.5px] transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} z-25`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex items-center gap-1.5 rounded-full bg-cyan-400 hover:bg-cyan-500 text-slate-950 py-2 px-4 text-xs font-bold font-sans tracking-wide shadow-lg hover:scale-105 transition active:scale-95 w-40 justify-center z-30"
              id={`quickview-trigger-${product.id}`}
              style={{ transform: 'translateZ(30px)' }}
            >
              <Eye className="h-4 w-4" />
              <span>3D QUICK VIEW</span>
            </button>

            {onImageClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(product);
                }}
                className="flex items-center gap-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 text-xs font-bold font-sans tracking-wide shadow-lg hover:scale-105 transition active:scale-95 w-40 justify-center z-30"
                style={{ transform: 'translateZ(30px)' }}
              >
                <Maximize2 className="h-4 w-4" />
                <span>ZOOM LIGHTBOX</span>
              </button>
            )}
          </div>

          {/* Discount Tag */}
          {product.discount > 0 && (
            <span 
              className="absolute top-2.5 left-2.5 rounded-md bg-gradient-to-r from-pink-500 to-rose-600 px-2 py-0.5 font-mono text-[9px] font-black text-white uppercase tracking-wider z-20 shadow-[0_2px_8px_rgba(236,72,153,0.4)]"
              style={{ transform: 'translateZ(25px)' }}
            >
              {product.discount}% OFF
            </span>
          )}

          {/* Flash Sale Tag */}
          {product.isFlashSale && (
            <span 
              className="absolute top-2.5 right-2.5 rounded-md bg-yellow-500 px-2 py-0.5 font-mono text-[9px] font-black text-slate-950 uppercase tracking-wider animate-pulse z-20 shadow-[0_2px_8px_rgba(234,179,8,0.4)]"
              style={{ transform: 'translateZ(25px)' }}
            >
              FLASH
            </span>
          )}

          {/* Best Seller / New Tag */}
          {product.isBestSeller && !product.isFlashSale && (
            <span 
              className="absolute top-2.5 right-2.5 rounded-md bg-purple-600 px-2 py-0.5 font-mono text-[9px] font-black text-white uppercase tracking-wider z-20 shadow-[0_2px_8px_rgba(147,51,234,0.4)]"
              style={{ transform: 'translateZ(25px)' }}
            >
              BEST
            </span>
          )}

          {product.isNewArrival && !product.isBestSeller && !product.isFlashSale && (
            <span 
              className="absolute top-2.5 right-2.5 rounded-md bg-cyan-500 px-2 py-0.5 font-mono text-[9px] font-black text-slate-950 uppercase tracking-wider z-20 shadow-[0_2px_8px_rgba(6,182,212,0.4)]"
              style={{ transform: 'translateZ(25px)' }}
            >
              NEW
            </span>
          )}

          {/* Liked trigger overlay */}
          <button
            onClick={handleLike}
            className={`absolute bottom-2.5 right-2.5 rounded-full p-2 backdrop-blur-md transition z-20 shadow-lg ${
              isLiked 
                ? 'bg-pink-500 text-slate-950 shadow-pink-500/30' 
                : 'bg-slate-900/80 text-slate-300 hover:text-pink-500'
            }`}
            title="Add to Wishlist"
            style={{ transform: 'translateZ(25px)' }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

        </div>

        {/* Category & Rating */}
        <div 
          className="flex items-center justify-between mb-1.5 font-mono"
          style={{ transform: 'translateZ(20px)' }}
        >
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
            {product.subCategory}
          </span>
          <div className="flex items-center gap-0.5 text-yellow-400">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-[10px] text-slate-300 font-bold">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="text-sm font-black text-slate-100 line-clamp-2 uppercase group-hover:text-pink-400 transition tracking-wide leading-snug"
          style={{ transform: 'translateZ(20px)' }}
        >
          {product.name}
        </h3>

        {/* Description Snippet */}
        <p 
          className="text-[11px] text-slate-400 mt-1 line-clamp-2 font-medium"
          style={{ transform: 'translateZ(10px)' }}
        >
          {product.description}
        </p>

      </div>

      {/* Card Content Bottom */}
      <div 
        className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between"
        style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
      >
        
        {/* Pricing */}
        <div className="flex flex-col">
          {product.discount > 0 ? (
            <>
              <span className="font-mono text-sm font-bold text-cyan-400">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="font-mono text-[10px] text-slate-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-mono text-sm font-bold text-cyan-400">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Trigger */}
        <button
          onClick={handleAddToCart}
          className={`relative overflow-visible rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
            added
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-pink-500 hover:bg-pink-600 text-slate-950 active:scale-95 hover:shadow-pink-500/20 hover:shadow-lg'
          }`}
          title="Quick add item to bag"
        >
          {/* Sparkle particle overlay */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, scale: [1, 0.8, 0], opacity: [1, 1, 0], rotate: p.rotation }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${p.color}, 0 0 4px #ffffff`,
                zIndex: 60,
                pointerEvents: 'none',
              }}
            />
          ))}

          {added ? (
            <>
              <Check className="h-4 w-4" />
              <span>ADDED!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>BUY</span>
            </>
          )}
        </button>

      </div>

    </motion.div>
  );
}
