import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp, CartItem } from './context/AppContext';
import { PRODUCTS, Product } from './data/products';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeHero from './components/HomeHero';
import CollectionsGrid from './components/CollectionsGrid';
import MascotWidget from './components/MascotWidget';
import SkincareQuiz from './components/SkincareQuiz';
import LuckyWheel from './components/LuckyWheel';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import ThreeProductCanvas from './components/ThreeProductCanvas';
import UserProfileDashboard from './components/UserProfileDashboard';

import { 
  Heart, ShoppingCart, Star, Check, ArrowRight, Sparkles, Flame, Clock, 
  MapPin, Gift, ShieldCheck, Mail, Send, Compass, User, Key, UserPlus, 
  HelpCircle, ChevronDown, ChevronUp, FileText, Search, Play, Award, 
  Truck, ArrowLeft, RefreshCw, Smartphone, Share2, Copy, X, ChevronLeft, ChevronRight
} from 'lucide-react';

function AppContent() {
  const {
    currentPage,
    setCurrentPage,
    selectedProductId,
    setSelectedProductId,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    user,
    loginUser,
    registerUser,
    logoutUser,
    recentViews,
    addRecentView,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    points,
    orders,
    placeOrder,
    cancelOrder,
    lastOrderSuccess,
    dailyRewardClaimed,
    luckySpinUsedToday,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    
    // Voice preferences and setters
    voiceStyle,
    voiceVolume,
    voiceMuted,
    voiceSpeed,
    setVoiceStyle,
    setVoiceVolume,
    setVoiceMuted,
    setVoiceSpeed,

    // Secure authentication procedures
    loginUserSecure,
    registerUserSecure,
    socialLogin,
    forgotPassword,
    resetPassword
  } = useApp();

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [expandedManifestItem, setExpandedManifestItem] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');

  const [activeAnimeVoicePopup, setActiveAnimeVoicePopup] = useState<{
    type: 'success' | 'cancel';
    text: string;
    id: string;
    style: 'hero' | 'heroine';
  } | null>(null);

  // Secure Auth State variables
  const [loginPassword, setLoginPassword] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regGender, setRegGender] = useState('Prefer not to say');
  const [authError, setAuthError] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'none' | 'email' | 'reset'>('none');
  const [rememberMe, setRememberMe] = useState(true);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [showCheckoutAuthModal, setShowCheckoutAuthModal] = useState(false);

  const [playedVoiceOrders, setPlayedVoiceOrders] = useState<string[]>(() => {
    const saved = localStorage.getItem('animeglow_played_voices');
    return saved ? JSON.parse(saved) : [];
  });

  const [showVoiceControlPanel, setShowVoiceControlPanel] = useState(false);

  const prevOrdersRef = useRef<any[]>([]);

  // HIGH-QUALITY CHIP-TUNE CHIME SYNTHESIS (Web Audio API)
  const playAnimeChime = (type: 'success' | 'cancel', volume: number) => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    try {
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      if (type === 'success') {
        // Cheerful digital arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          
          gain.gain.setValueAtTime(volume * 0.15, now + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.3);
        });
      } else {
        // Soft comforting tone
        const notes = [440.00, 493.88, 587.33]; // A4, B4, D5 (warm minor/major third)
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + index * 0.12);
          
          gain.gain.setValueAtTime(volume * 0.12, now + index * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 0.4);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + index * 0.12);
          osc.stop(now + index * 0.12 + 0.4);
        });
      }
    } catch (err) {
      console.error("Audio synth error", err);
    }
  };

  const speakAnime = (text: string, volume: number, isMuted: boolean, overrideStyle?: 'cute_heroine' | 'elegant_heroine' | 'confident_hero' | 'calm_hero') => {
    if (isMuted) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const styleToUse = overrideStyle || (voiceStyle === 'random' ? (['cute_heroine', 'elegant_heroine', 'confident_hero', 'calm_hero'][Math.floor(Math.random() * 4)] as any) : voiceStyle);
    
    // Trigger digital chiptune intro right before voice synthesis
    const chimeType = text.toLowerCase().includes('cancel') || text.toLowerCase().includes('sorry') ? 'cancel' : 'success';
    playAnimeChime(chimeType, volume);

    // Filter emojis and format phonetic pronunciation to maintain realistic voice flow
    const cleanText = text
      .replace(/🎉/g, '')
      .replace(/💖/g, '')
      .replace(/😢/g, '')
      .replace(/💙/g, '')
      .replace(/Arigato!/g, 'Ah-ree-gah-toh!')
      .replace(/Yay!/g, 'Yay, ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.volume = volume;

    // Set expressive pitch & rate guidelines according to the selected archetype
    if (styleToUse === 'cute_heroine') {
      utterance.pitch = 1.55; // Kawaii pitch
      utterance.rate = voiceSpeed * 1.15; // Energetic velocity
    } else if (styleToUse === 'elegant_heroine') {
      utterance.pitch = 1.22; // Elegant warm pitch
      utterance.rate = voiceSpeed * 0.95; // Flowing polite velocity
    } else if (styleToUse === 'confident_hero') {
      utterance.pitch = 0.85; // Bold lower hero range
      utterance.rate = voiceSpeed * 1.05; // Quick enthusiast velocity
    } else if (styleToUse === 'calm_hero') {
      utterance.pitch = 0.76; // Calm deep hero range
      utterance.rate = voiceSpeed * 0.88; // Comforting slow velocity
    }

    const voices = window.speechSynthesis.getVoices();
    let preferredVoice = null;

    if (styleToUse.includes('heroine')) {
      preferredVoice = voices.find(v => 
        (v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('hazel') || v.name.toLowerCase().includes('google us english')) && 
        v.lang.toLowerCase().includes('en')
      ) || voices.find(v => v.lang.toLowerCase().includes('en'));
    } else {
      preferredVoice = voices.find(v => 
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('mark') || v.name.toLowerCase().includes('george')) && 
        v.lang.toLowerCase().includes('en')
      ) || voices.find(v => v.lang.toLowerCase().includes('en'));
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Delay slightly to prevent overlapping with initial digital chime sequence
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 150);
  };

  const triggerVoiceFeedback = (type: 'success' | 'cancel', orderId: string) => {
    const key = type === 'success' ? orderId : `${orderId}-cancelled`;
    
    setPlayedVoiceOrders(prev => {
      if (prev.includes(key)) return prev;
      const updated = [...prev, key];
      localStorage.setItem('animeglow_played_voices', JSON.stringify(updated));
      return updated;
    });

    const styleToUse = voiceStyle === 'random' ? (['cute_heroine', 'elegant_heroine', 'confident_hero', 'calm_hero'][Math.floor(Math.random() * 4)] as any) : voiceStyle;

    const text = type === 'success' 
      ? "Yay! Your order has been placed successfully! Thank you so much for shopping with us! We can't wait for you to receive your package. Have an amazing day!"
      : "We're really sorry your order was cancelled. We hope we'll have another chance to serve you. Thank you for visiting our store, and we hope to see you again soon.";

    setActiveAnimeVoicePopup({
      type,
      text,
      id: orderId,
      style: styleToUse.includes('heroine') ? 'heroine' : 'hero'
    });

    speakAnime(text, voiceVolume, voiceMuted, styleToUse);
  };

  const handleToggleMute = () => {
    const newVal = !voiceMuted;
    setVoiceMuted(newVal);
    if (newVal) {
      window.speechSynthesis?.cancel();
    } else {
      const styleToUse = voiceStyle === 'random' ? 'cute_heroine' : voiceStyle;
      speakAnime(styleToUse.includes('hero') ? "Systems active, ready to roll! 🔥" : "Arigato! Hiku voice link connected! 💖", voiceVolume, false, styleToUse);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setVoiceVolume(vol);
  };

  const handleSpeedChange = (speed: number) => {
    setVoiceSpeed(speed);
  };

  const handleStyleChange = (style: 'cute_heroine' | 'elegant_heroine' | 'confident_hero' | 'calm_hero' | 'random') => {
    setVoiceStyle(style);
    
    const styleToUse = style === 'random' ? 'cute_heroine' : style;
    const previewText = styleToUse.includes('hero') 
      ? "Voice link authorized. Tactical systems online and synchronized. 🔥"
      : "Kawaii voice core activated! Arigato gozaimasu! 🌸";
    speakAnime(previewText, voiceVolume, voiceMuted, styleToUse);
  };

  const handleTestVoice = () => {
    const styleToUse = voiceStyle === 'random' ? 'cute_heroine' : voiceStyle;
    const testText = styleToUse.includes('hero')
      ? "Voice Link check. All grids are fully functional and ready to launch. 🔥"
      : "Voice Link check. Woohoo! Everything sounds super cute and perfect! 🌸";
    speakAnime(testText, voiceVolume, false, styleToUse);
  };

  // Keep track of orders across renders to detect placement and cancellation
  useEffect(() => {
    if (prevOrdersRef.current.length === 0 && orders.length > 0) {
      prevOrdersRef.current = orders;
      return;
    }

    if (prevOrdersRef.current.length > 0) {
      // 1. Detect new order placement
      const newOrders = orders.filter(o => !prevOrdersRef.current.some(p => p.id === o.id));
      newOrders.forEach(order => {
        if (!playedVoiceOrders.includes(order.id)) {
          triggerVoiceFeedback('success', order.id);
        }
      });

      // 2. Detect order cancellation
      orders.forEach(order => {
        const prevOrder = prevOrdersRef.current.find(p => p.id === order.id);
        if (prevOrder && prevOrder.status === 'Processing' && order.status === 'Cancelled') {
          const cancelKey = `${order.id}-cancelled`;
          if (!playedVoiceOrders.includes(cancelKey)) {
            triggerVoiceFeedback('cancel', order.id);
          }
        }
      });
    }

    prevOrdersRef.current = orders;
  }, [orders]);

  const getReceiptText = (order: any) => {
    if (!order) return '';
    const itemsText = order.items.map((item: any) => `- ${item.name} x${item.quantity} (${item.variant || 'Standard'}): $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    return `⚡ NEOTOPIC GLOW CARGO RECEIPT ⚡
-----------------------------------------
MANIFEST ID: #${order.id}
TIMESTAMP: ${order.date}
SECURED RECIPIENT: ${order.address.fullName}
DESTINATION: ${order.address.street}, ${order.address.city}
LOYALTY REWARD: +${Math.floor(order.total * 10)} GP ⭐

CARGO CONTENTS:
${itemsText}

NET TRANSACTION VALUE: $${order.total.toFixed(2)}
-----------------------------------------
🛰️ Quantum telemetry scan verified. Thank you, Pilot!`;
  };

  const handleCopyReceipt = (order: any) => {
    const text = getReceiptText(order);
    navigator.clipboard.writeText(text).then(() => {
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    }).catch(err => {
      console.error("Failed to copy receipt: ", err);
    });
  };

  const handleShareReceipt = (order: any) => {
    const text = getReceiptText(order);
    if (navigator.share) {
      navigator.share({
        title: `Neotopic Glow Manifest #${order.id}`,
        text: text,
      }).catch(err => console.error("Web Share failed:", err));
    } else {
      handleCopyReceipt(order);
    }
  };
  const [priceRange, setPriceRange] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [minRating, setMinRating] = useState<number>(0);

  // Quick state details
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regSkin, setRegSkin] = useState('Normal');

  // Checkout Fields
  const [checkName, setCheckName] = useState(user ? user.name : '');
  const [checkAddress, setCheckAddress] = useState('');
  const [checkCity, setCheckCity] = useState('');
  const [checkZip, setCheckZip] = useState('');
  const [checkCard, setCheckCard] = useState('');
  const [checkExpiry, setCheckExpiry] = useState('');
  const [checkCvv, setCheckCvv] = useState('');

  // Contact Fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Order Tracking State
  const [trackInput, setTrackInput] = useState('AG-9081');
  const [searchedTrackOrder, setSearchedTrackOrder] = useState<any>(null);

  // FAQ Accordion Toggle States
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });

  // Flash Sale Countdown timers
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 }; // reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync track search to first order initially
  useEffect(() => {
    if (orders.length > 0) {
      const match = orders.find(o => o.id === trackInput);
      if (match) setSearchedTrackOrder(match);
    }
  }, [orders]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!lightboxProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxProduct(null);
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        setLightboxImageIndex(prev => 
          prev === lightboxProduct.images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        setLightboxImageIndex(prev => 
          prev === 0 ? lightboxProduct.images.length - 1 : prev - 1
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxProduct]);

  // Handle viewing a product detail
  const handleViewProduct = (product: Product) => {
    addRecentView(product.id);
    setSelectedProductId(product.id);
    setCurrentPage('details');
  };

  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId);

  // Filter and sort catalog
  const filteredProducts = PRODUCTS.filter(p => {
    // 1. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q) && !p.subCategory.toLowerCase().includes(q)) {
        return false;
      }
    }

    // 2. Main Category Filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // 3. Sub Category Filter
    if (selectedSubCategory !== 'all' && p.subCategory !== selectedSubCategory) {
      return false;
    }

    // 4. Price range Filter
    const discounted = p.price * (1 - p.discount / 100);
    if (discounted > priceRange) {
      return false;
    }

    // 5. Rating Filter
    if (p.rating < minRating) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const aPrice = a.price * (1 - a.discount / 100);
    const bPrice = b.price * (1 - b.discount / 100);

    if (sortBy === 'price-low') return aPrice - bPrice;
    if (sortBy === 'price-high') return bPrice - aPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discount - a.discount;
    return 0; // featured/default
  });

  // Extract all available subcategories dynamically depending on category selection
  const subCategories = ['all', ...Array.from(new Set(
    PRODUCTS.filter(p => selectedCategory === 'all' || p.category === selectedCategory).map(p => p.subCategory)
  ))];

  // Confetti Canvas generation on successful order checkout
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (currentPage !== 'success' || !confettiCanvasRef.current) return;
    const canvas = confettiCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF4FA3', '#6A5CFF', '#00E5FF', '#FFD93D', '#10B981'];
    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0
    }));

    let animationId: number;
    const drawConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      animationId = requestAnimationFrame(drawConfetti);
    };

    drawConfetti();
    return () => cancelAnimationFrame(animationId);
  }, [currentPage]);

  // Handle active coupon apply
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    const success = applyCoupon(couponInput);
    if (success) {
      setCouponSuccess(true);
      setCouponInput('');
    } else {
      setCouponError('⚠️ INVALID DECAL DECRYPT KEY! TRY GLOW20, SAKURA30 OR NEON15');
    }
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => {
    const discounted = item.product.price * (1 - item.product.discount / 100);
    return sum + discounted * item.quantity;
  }, 0);

  let discountPercentage = 0;
  if (activeCoupon === 'GLOW20') discountPercentage = 20;
  else if (activeCoupon === 'SAKURA30') discountPercentage = 30;
  else if (activeCoupon === 'NEON15') discountPercentage = 15;

  const discountAmount = subtotal * (discountPercentage / 100);
  const shippingCost = subtotal > 0 ? 4.99 : 0;
  const grandTotal = subtotal - discountAmount + shippingCost;

  // Blog Posts Data
  const blogPosts = [
    {
      id: 1,
      title: "THE MOCHI GLOW STATS: HYDRATION LEVELING GUIDE",
      date: "June 25, 2026",
      desc: "Unlock the secrets of traditional fermented rice water extracts and pure hyaluronic elixirs. Learn how to layer our Cherry Dew Toner with Mochi Whip to score 100% bounce metrics.",
      image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80",
      author: "Hiku Fox Specialist",
      readTime: "4 min read"
    },
    {
      id: 2,
      title: "RGB CODES AND NEON AMBIENT SYNC CODES",
      date: "June 18, 2026",
      desc: "Want your battle desk to feel like a high-tech Neo-Tokyo corridor? Discover how we design custom acrylic Oni lamps and LED Stitch desks mats to map beautifully with your gaming keycaps.",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
      author: "Neon Samurai",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "BLUE LIGHT PROTECTION: SHIELDING GAMING SKIN CORES",
      date: "June 10, 2026",
      desc: "Staring at screens all night drains your skin's defensive barriers. We break down how zinc-oxide fluid blocks act as an impenetrable active firewall for screen radiation.",
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
      author: "Valkyrie Medic",
      readTime: "3 min read"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#0A0715] text-slate-100 flex flex-col font-sans antialiased selection:bg-pink-500 selection:text-slate-950 overflow-hidden">
      
      {/* Ambient Background Elements */}
      <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-[#FF4FA3] opacity-[0.12] rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#6A5CFF] opacity-[0.12] rounded-full blur-[110px] pointer-events-none z-0"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none z-0 hidden lg:block"></div>
      
      {/* Custom Scroll/Interface Accents */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40 pointer-events-none hidden lg:flex">
        <div className="w-1 h-8 bg-[#FF4FA3] rounded-full"></div>
        <div className="w-1 h-2 bg-white/20 rounded-full"></div>
        <div className="w-1 h-2 bg-white/20 rounded-full"></div>
        <div className="w-1 h-2 bg-white/20 rounded-full"></div>
      </div>
      
      {/* Dynamic top bar */}
      <div className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 py-1 text-center font-mono text-[9px] font-extrabold text-slate-950 uppercase tracking-widest animate-pulse z-50">
        ✨ USE PROTOCOL CODE &apos;SAKURA30&apos; FOR 30% OFF ALL CORE ANIME RELICS & SKINCARE ✨
      </div>

      <Navbar />

      {/* Main page state coordinator */}
      <main className="flex-grow">
        
        {/* PAGE: HOME */}
        {currentPage === 'home' && (
          <div className="space-y-16 pb-16 animate-fade-in" id="page-home-layout">
            <HomeHero />

            {/* Curated Bento Grid */}
            <CollectionsGrid />

            {/* Flash Sale Countdown Banner */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border-2 border-rose-500/30 rounded-3xl bg-gradient-to-r from-slate-950 via-rose-950/15 to-slate-950 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                {/* Glowing alert aura */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 rounded bg-rose-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-400 border border-rose-500/30 uppercase tracking-widest">
                    <Flame className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                    <span>TEMPORARY OVERCLOCK CODES</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    APOTHECARY FLASH OVERCLOCK
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg">
                    Secure critical serum supplies and limited-edition dragon pendants at maximum discounts before the system cooldown triggers!
                  </p>
                </div>

                {/* Ticking timer clock */}
                <div className="flex items-center gap-3 font-mono">
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-900 border border-rose-500/40 rounded-xl h-14 w-14 flex items-center justify-center text-xl font-black text-rose-400">
                      0{timeLeft.hours}
                    </div>
                    <span className="text-[8px] text-slate-500 uppercase mt-1">Hours</span>
                  </div>
                  <span className="text-xl font-black text-rose-500 animate-ping">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-900 border border-rose-500/40 rounded-xl h-14 w-14 flex items-center justify-center text-xl font-black text-rose-400">
                      {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                    </div>
                    <span className="text-[8px] text-slate-500 uppercase mt-1">Minutes</span>
                  </div>
                  <span className="text-xl font-black text-rose-500 animate-ping">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-900 border border-rose-500/40 rounded-xl h-14 w-14 flex items-center justify-center text-xl font-black text-rose-400">
                      {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                    </div>
                    <span className="text-[8px] text-slate-500 uppercase mt-1">Seconds</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSubCategory('all');
                    setSelectedCategory('all');
                    setSortBy('discount');
                    setCurrentPage('shop');
                  }}
                  className="px-6 py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-slate-950 font-black tracking-widest text-xs uppercase shadow-lg shadow-rose-500/10 shrink-0"
                >
                  LOADOUT OFFERS
                </button>
              </div>
            </div>

            {/* Best Sellers Showcase Grid */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center sm:text-left mb-8">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 font-mono text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3">
                  <Award className="h-3.5 w-3.5" />
                  <span>Verified S-Rank Favorites</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  High-Rank Best Sellers
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  The absolute highest rated potions and original toys loved by our global vanguard clan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => p.isBestSeller).slice(0, 4).map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onQuickView={setQuickViewProduct} 
                    onImageClick={(prod) => {
                      setLightboxProduct(prod);
                      setLightboxImageIndex(0);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Smart Skincare Quiz Callout Banner */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="border border-cyan-500/20 rounded-3xl bg-slate-950/80 p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative h-44 w-full lg:w-72 shrink-0 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80" 
                    alt="Skincare tools and cosmetics" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] text-cyan-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/20">
                    🔬 SECURE APOTHECARY DIAGNOSIS
                  </span>
                </div>

                <div className="flex-1 space-y-2 text-center lg:text-left">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest block uppercase">GAMIFIED RECOMMENDER</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-tight">
                    Which Skincare Faction Are You?
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Don&apos;t guess your loadout stats. Complete our interactive alchemical questionnaire to register your skin profile, unlock custom recommended regimens, and instantly claim <span className="text-yellow-400 font-bold">+100 GLOW POINTS</span> to your profile wallet!
                  </p>
                  <button
                    onClick={() => setCurrentPage('quiz')}
                    className="mt-4 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 text-xs font-black tracking-widest uppercase transition"
                  >
                    LAUNCH ASSESSMENT PROTOCOL
                  </button>
                </div>
              </div>
            </div>

            {/* New Arrivals Section */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center sm:text-left mb-8">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 font-mono text-xs font-bold text-pink-400 uppercase tracking-widest mb-3">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Fresh Matrix Core Updates</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  New Relic Arrivals
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Freshly loaded alchemical ingredients and high-profile merch drops hot out of the forge.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => p.isNewArrival).slice(0, 4).map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onQuickView={setQuickViewProduct} 
                    onImageClick={(prod) => {
                      setLightboxProduct(prod);
                      setLightboxImageIndex(0);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Daily Spin Reminders Teaser Grid */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="border border-yellow-500/20 rounded-3xl bg-slate-950/80 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
                <div className="space-y-1.5 text-center md:text-left">
                  <span className="text-[10px] font-mono text-yellow-400 font-black tracking-widest uppercase block">FREE DAILY CODES</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
                    The Lucky Fortune Wheel Awaits!
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Claim your daily login points and spin our interactive arcade wheel to win points, double spins, or instant checkout discount keys.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('rewards')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-950 font-black text-xs tracking-widest uppercase transition shrink-0 shadow-lg shadow-yellow-500/15"
                >
                  CLAIM DAILY PROTOCOL
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PAGE: SHOP / CATALOG */}
        {currentPage === 'shop' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="page-shop-layout">
            
            {/* Filter Section & Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Sidebar Filters */}
              <div className="lg:col-span-3 border border-purple-500/15 rounded-3xl bg-slate-950 p-6 shadow-xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="text-sm font-black text-cyan-400 font-mono tracking-wider uppercase">Filter Matrices</h3>
                  <button 
                    onClick={() => {
                      setSelectedSubCategory('all');
                      setPriceRange(100);
                      setMinRating(0);
                      setSortBy('featured');
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-[9px] font-mono text-pink-500 font-bold uppercase hover:text-pink-400"
                  >
                    Clear Decals
                  </button>
                </div>

                {/* Major Category Faction Selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Faction Division:</span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', label: '🌐 ALL DIVISIONS' },
                      { id: 'skincare', label: '🧪 APOTHECARY (SKINCARE)' },
                      { id: 'merchandise', label: '🎮 REPOSITORY (ANIME MERCH)' },
                      { id: 'stationery', label: '🌸 STATIONERY (KAWAII)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id as any);
                          setSelectedSubCategory('all');
                        }}
                        className={`w-full text-left px-3.5 py-2 rounded-xl text-[10px] font-black border font-mono uppercase tracking-widest transition duration-300 ${
                          selectedCategory === cat.id
                            ? 'bg-pink-500 border-pink-500 text-slate-950 shadow-[0_0_12px_rgba(244,63,94,0.4)] font-black'
                            : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory selectors */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Relic Category:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {subCategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubCategory(sub)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border font-mono uppercase tracking-wide transition ${
                          selectedSubCategory === sub
                            ? 'bg-pink-500 border-pink-500 text-slate-950'
                            : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Sort Protocol:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 outline-none font-mono focus:border-pink-500/40"
                  >
                    <option value="featured">🔥 FEATURED PROTOCOLS</option>
                    <option value="price-low">💰 PRICE: LOW &gt; HIGH</option>
                    <option value="price-high">💎 PRICE: HIGH &gt; LOW</option>
                    <option value="rating">⭐ RATING: HIGHEST S-RANK</option>
                    <option value="discount">🔥 MAX DISCOUNT PERCENTAGE</option>
                  </select>
                </div>

                {/* Price range selector */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span className="uppercase">Maximum Mana Cost:</span>
                    <span className="text-cyan-400 font-bold">${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-pink-500 h-1 bg-slate-900 rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-mono text-slate-600">
                    <span>$5</span>
                    <span>$100+</span>
                  </div>

                  {/* Quick price sort protocol buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider shrink-0">PRICE SORT:</span>
                    <div className="flex gap-1 w-full justify-end">
                      <button
                        onClick={() => setSortBy('price-low')}
                        className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono transition uppercase ${
                          sortBy === 'price-low'
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        Low-to-High
                      </button>
                      <button
                        onClick={() => setSortBy('price-high')}
                        className={`px-2.5 py-1 rounded text-[9px] font-bold font-mono transition uppercase ${
                          sortBy === 'price-high'
                            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        High-to-Low
                      </button>
                    </div>
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Minimum Rank Rating:</span>
                  <div className="flex items-center gap-1.5">
                    {[0, 4.5, 4.7, 4.8, 4.9].map((ratingVal) => (
                      <button
                        key={ratingVal}
                        onClick={() => setMinRating(ratingVal)}
                        className={`flex-1 py-1 rounded text-[10px] font-mono font-bold border transition ${
                          minRating === ratingVal
                            ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                            : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {ratingVal === 0 ? 'ALL' : `${ratingVal}⭐`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Faction description summary */}
                <div className="border-t border-slate-900 pt-4 font-mono text-[9px] text-slate-500 space-y-1 uppercase">
                  <div>ACTIVE FACTION: {selectedCategory === 'all' ? 'DUAL MATRIX (ALL)' : selectedCategory}</div>
                  <div>VERIFIED RELICS DISPLAYED: {filteredProducts.length} CORES</div>
                </div>

              </div>

              {/* Product Catalog Grid */}
              <div className="lg:col-span-9 space-y-8">
                
                {/* Search summary header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-4">
                  <h2 className="text-xl font-black text-white uppercase tracking-wider font-sans">
                    {selectedCategory === 'all' ? 'ALL POTIONS & MERCH' : selectedCategory === 'skincare' ? 'Apothecary Skincare Core' : 'Aesthetic Merchandise Relics'}
                  </h2>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full uppercase">
                    SHOWING {filteredProducts.length} FORCES IN LOADOUT
                  </span>
                </div>

                {/* Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onQuickView={setQuickViewProduct} 
                        onImageClick={(prod) => {
                          setLightboxProduct(prod);
                          setLightboxImageIndex(0);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-purple-500/15 rounded-3xl p-12 text-center">
                    <span className="text-3xl block">🏮</span>
                    <h4 className="text-sm font-bold text-slate-200 mt-2 uppercase tracking-widest font-mono">NO CORES FOUND IN MATRIX INDEX</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Hiku cannot find any items matching those criteria. Adjust your search parameters or filter matrices to reload product entries!
                    </p>
                    <button
                      onClick={() => {
                        setSelectedSubCategory('all');
                        setPriceRange(100);
                        setMinRating(0);
                        setSortBy('featured');
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl border border-pink-500/20 text-xs font-mono text-pink-400 hover:bg-pink-500/10 uppercase font-bold"
                    >
                      REBOOT INDEX PROTOCOLS
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* PAGE: PRODUCT DETAILS */}
        {currentPage === 'details' && selectedProduct && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in" id="page-details-layout">
            
            {/* Back button */}
            <button
              onClick={() => setCurrentPage('shop')}
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-pink-400 transition uppercase mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>RETURN TO ARCHIVE GRID</span>
            </button>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Side: 3D Scene Viewer */}
              <div className="lg:col-span-5 relative aspect-square rounded-3xl bg-slate-950 border-2 border-purple-500/20 shadow-2xl p-6 flex flex-col justify-between overflow-hidden">
                {/* Glowing neon scanner decorative border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-40 animate-scan"></div>
                
                <div className="z-10 flex items-center justify-between text-[10px] font-mono font-bold text-pink-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
                    INTERACTIVE 3D ORBIT
                  </span>
                  <span>CORE_ID: {selectedProduct.id}</span>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 w-full relative min-h-[300px]">
                  <ThreeProductCanvas
                    threedType={selectedProduct.threedType}
                    primaryColor={selectedProduct.category === 'skincare' ? '#FF4FA3' : '#6A5CFF'}
                    secondaryColor="#00E5FF"
                    imageUrl={selectedProduct.images?.[0]}
                  />
                </div>

                <div className="z-10 text-center text-[10px] font-mono text-slate-500">
                  DRAG CORNER TO RE-ALIGN PERSPECTIVES
                </div>
              </div>

              {/* Right Side: Product Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="font-mono text-xs font-bold text-pink-400 uppercase tracking-widest block mb-1">
                    {selectedProduct.category} &gt; {selectedProduct.subCategory}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                    {selectedProduct.name}
                  </h1>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center text-yellow-400 text-xs font-bold">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      <span>{selectedProduct.rating} (S-Rank)</span>
                    </div>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs text-slate-400 font-mono font-bold">{selectedProduct.reviewsCount} CLAN REVIEWS</span>
                  </div>
                </div>

                {/* Price display */}
                <div className="flex items-baseline gap-3 font-mono">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                    ${(selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(2)}
                  </span>
                  {selectedProduct.discount > 0 && (
                    <>
                      <span className="text-sm text-slate-500 line-through">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                      <span className="rounded bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 text-xs text-pink-400 font-bold">
                        -{selectedProduct.discount}% MATRIX VOUCHER DISCOUNTED
                      </span>
                    </>
                  )}
                </div>

                {/* Product Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {selectedProduct.description}
                </p>

                {/* Ingredients panel for Skincare */}
                {selectedProduct.ingredients && selectedProduct.ingredients.length > 0 && (
                  <div className="border border-purple-500/15 rounded-2xl bg-slate-900/30 p-4">
                    <h4 className="text-[10px] font-mono text-cyan-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-400" />
                      <span>Bio-Active Botanical Infusion Ingredients:</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {selectedProduct.ingredients.join(', ')}
                    </p>
                  </div>
                )}

                {/* Variant picker and quantities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  
                  {/* Variants */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Relic Variant Loadout:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.variants.map((v) => (
                        <button
                          key={v}
                          onClick={() => {}}
                          className="px-3.5 py-2 border-2 border-pink-500/40 bg-pink-500/5 text-pink-400 text-xs font-bold rounded-xl"
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Mana Quantity:</span>
                    <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900/30 p-1 w-28">
                      <button className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center font-bold">-</button>
                      <span className="flex-grow text-center font-mono text-xs font-extrabold text-slate-200">1</span>
                      <button className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white flex items-center justify-center font-bold">+</button>
                    </div>
                  </div>

                </div>

                {/* Primary Add to Tote Trigger */}
                <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, selectedProduct.variants[0], 1);
                      alert(`🌸 ${selectedProduct.name} successfully secure in your bag!`);
                    }}
                    className="w-full sm:flex-grow py-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-black tracking-widest uppercase shadow-xl shadow-pink-500/10 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>ADD ITEM TO SATCHEL BAG</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`w-full sm:w-auto px-5 py-4 rounded-2xl border-2 transition flex items-center justify-center gap-2 ${
                      wishlist.includes(selectedProduct.id)
                        ? 'border-pink-500 bg-pink-500/10 text-pink-400'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Love Core</span>
                  </button>
                </div>

                {/* Clan Review Section */}
                <div className="border-t border-slate-900 pt-6 space-y-4">
                  <h3 className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
                    💬 Clan Transmissions (Reviews)
                  </h3>

                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {selectedProduct.reviews.map((r) => (
                        <div key={r.id} className="border border-purple-500/10 rounded-2xl bg-slate-900/30 p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{r.avatar}</span>
                              <span className="font-bold text-slate-200">{r.user}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">{r.date}</span>
                          </div>
                          <div className="flex items-center text-yellow-400 text-xs">
                            {Array.from({ length: r.rating }).map((_, idx) => (
                              <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-300 leading-normal font-medium">
                            {r.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500 font-mono uppercase border border-dashed border-slate-900 rounded-2xl">
                      🔮 NO RECENT CHRONICLE TRANSMISSIONS ON THIS COGNITIVE DECAL
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* PAGE: WISHLIST */}
        {currentPage === 'wishlist' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="page-wishlist-layout">
            
            <div className="text-center mb-10">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3 animate-pulse">
                <Heart className="h-5 w-5 fill-current" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                Favorite Love Cores
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your personally bookmarked elixirs and original desk toys.
              </p>
            </div>

            {!user && (
              <div className="mb-8 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left font-sans">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">💾 Wishlist Synchronization Mode: Offline</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-mono">Sign in to sync your favorite items across all cognitive terminal links.</p>
                </div>
                <button
                  onClick={() => {
                    setRedirectAfterLogin('wishlist');
                    setCurrentPage('login');
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-black uppercase tracking-wider transition whitespace-nowrap"
                >
                  Sync Wishlist
                </button>
              </div>
            )}

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRODUCTS.filter(p => wishlist.includes(p.id)).map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onQuickView={setQuickViewProduct} 
                    onImageClick={(prod) => {
                      setLightboxProduct(prod);
                      setLightboxImageIndex(0);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-purple-500/15 rounded-3xl p-12 text-center max-w-md mx-auto">
                <span className="text-3xl block">💖</span>
                <h4 className="text-sm font-bold text-slate-200 mt-2 uppercase tracking-widest font-mono">LOVED CORES INDEX EMPTY</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Bookmarked items will populate here. Take your time to discover our procedural 3D models and add your favorites!
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-black uppercase tracking-wider transition"
                >
                  DISCOVER RELICS
                </button>
              </div>
            )}

          </div>
        )}

        {/* PAGE: CART */}
        {currentPage === 'cart' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="page-cart-layout">
            
            <div className="text-center sm:text-left mb-8 border-b border-slate-900 pb-4">
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
                Apothecary Satchel Bag
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Verify your loadout item counts before transmitting the secure purchase protocol.
              </p>
            </div>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                  {cart.map((item, idx) => {
                    const product = item.product;
                    const discounted = product.price * (1 - product.discount / 100);
                    return (
                      <div 
                        key={idx}
                        className="border border-purple-500/10 rounded-2xl bg-slate-950 p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-pink-500/30 transition"
                      >
                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        </div>

                        {/* Name and Variant */}
                        <div className="flex-1 text-center sm:text-left">
                          <span className="font-mono text-[9px] text-pink-400 font-bold uppercase block">{product.subCategory}</span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-100 uppercase tracking-wide">{product.name}</h4>
                          <span className="text-[10px] font-mono text-slate-500 block">VARIANT: {item.selectedVariant}</span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center border border-slate-900 rounded-lg p-0.5 bg-slate-900/40">
                          <button
                            onClick={() => updateCartQuantity(product.id, item.selectedVariant, item.quantity - 1)}
                            className="w-6 h-6 rounded text-slate-500 hover:text-white"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono text-xs font-bold text-slate-200">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(product.id, item.selectedVariant, item.quantity + 1)}
                            className="w-6 h-6 rounded text-slate-500 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* Cost */}
                        <div className="text-right font-mono text-xs">
                          <span className="text-cyan-400 font-bold block">${(discounted * item.quantity).toFixed(2)}</span>
                          <span className="text-[9px] text-slate-500">(${discounted.toFixed(2)} ea)</span>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeFromCart(product.id, item.selectedVariant)}
                          className="text-[10px] font-mono text-rose-500 hover:text-rose-400 font-bold uppercase sm:ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Right Side: Order Summary Panel */}
                <div className="lg:col-span-4 border border-purple-500/15 rounded-3xl bg-slate-950 p-6 shadow-xl space-y-6">
                  
                  <h3 className="text-sm font-black text-cyan-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-3">
                    Holo-Summary Core
                  </h3>

                  {/* Calculations breakdown */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal Cost:</span>
                      <span className="text-slate-200 font-bold">${subtotal.toFixed(2)}</span>
                    </div>

                    {discountPercentage > 0 && (
                      <div className="flex justify-between text-pink-400 font-bold">
                        <span>Active Coupon (-{discountPercentage}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400">
                      <span>Standard Shipping Cost:</span>
                      <span className="text-slate-200 font-bold">${shippingCost.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-slate-900 pt-3 flex justify-between text-sm font-black text-white">
                      <span>Grand Total:</span>
                      <span className="text-cyan-400">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Coupon entry form */}
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Decrypt Promo Code:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. SAKURA30"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 outline-none uppercase font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-purple-900 hover:bg-purple-800 text-slate-200 text-xs font-mono font-bold px-4 py-2 rounded-xl transition uppercase"
                      >
                        Apply
                      </button>
                    </div>

                    {couponError && <p className="text-[9px] font-mono text-rose-500">{couponError}</p>}
                    {couponSuccess && <p className="text-[9px] font-mono text-emerald-400">⭐ CODE ACCEPTED! PROTOCOL DISCOUNT APPLIED.</p>}
                  </form>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      if (!user) {
                        setRedirectAfterLogin('checkout');
                        setShowCheckoutAuthModal(true);
                      } else {
                        setCurrentPage('checkout');
                      }
                    }}
                    className="w-full py-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-black tracking-widest uppercase shadow-xl shadow-pink-500/10 transition"
                  >
                    INITIATE CHECKOUT PROTOCOL
                  </button>

                  <div className="flex items-center gap-1.5 justify-center text-[10px] text-slate-500 font-mono uppercase">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>SECURE TRANSACTION CODES GUARANTEED</span>
                  </div>

                </div>

              </div>
            ) : (
              <div className="border-2 border-dashed border-purple-500/15 rounded-3xl p-12 text-center max-w-md mx-auto">
                <span className="text-3xl block">🎒</span>
                <h4 className="text-sm font-bold text-slate-200 mt-2 uppercase tracking-widest font-mono">BAG CORES DEPLOYED</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Your physical satchel bag is completely empty. Take our quiz or browse our 3D product catalog to gear up!
                </p>
                <button
                  onClick={() => setCurrentPage('shop')}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-black uppercase tracking-wider transition"
                >
                  SHOP ARCHIVES
                </button>
              </div>
            )}

          </div>
        )}

        {/* PAGE: CHECKOUT */}
        {currentPage === 'checkout' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="page-checkout-layout">
            
            <div className="text-center sm:text-left mb-8 border-b border-slate-900 pb-4">
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-sans">
                Transaction Cockpit
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your physical coordinates and secure billing decoders to finalize the transmission.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Checkout Form */}
              <div className="lg:col-span-8 border border-purple-500/15 rounded-3xl bg-slate-950 p-6 sm:p-8 shadow-xl space-y-6">
                
                <h3 className="text-sm font-black text-cyan-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-2">
                  🗺️ Faction Delivery Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Pilot Full Name:</label>
                    <input
                      type="text"
                      required
                      value={checkName}
                      onChange={(e) => setCheckName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="e.g. Haru Sakura"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Street Coordinates:</label>
                    <input
                      type="text"
                      required
                      value={checkAddress}
                      onChange={(e) => setCheckAddress(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="e.g. 123 Shibuya Way, Apt 4C"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Metropolitan City:</label>
                    <input
                      type="text"
                      required
                      value={checkCity}
                      onChange={(e) => setCheckCity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="e.g. Neo Shibuya"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Matrix Zip Code:</label>
                    <input
                      type="text"
                      required
                      value={checkZip}
                      onChange={(e) => setCheckZip(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="e.g. 150-0002"
                    />
                  </div>
                </div>

                <h3 className="text-sm font-black text-cyan-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-2 pt-4">
                  💳 Secure Billing Decoders (Payment info)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-3">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Credit Card Number:</label>
                    <input
                      type="text"
                      required
                      value={checkCard}
                      onChange={(e) => setCheckCard(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="4111 • 2222 • 3333 • 4444"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Expiry Code:</label>
                    <input
                      type="text"
                      required
                      value={checkExpiry}
                      onChange={(e) => setCheckExpiry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="MM/YY"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Secure CVV:</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={checkCvv}
                      onChange={(e) => setCheckCvv(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      placeholder="•••"
                    />
                  </div>
                </div>

              </div>

              {/* Order Summary Panel */}
              <div className="lg:col-span-4 border border-purple-500/15 rounded-3xl bg-slate-950 p-6 shadow-xl space-y-6">
                
                <h3 className="text-sm font-black text-cyan-400 font-mono tracking-wider uppercase border-b border-slate-900 pb-3">
                  Transmitting Summary
                </h3>

                {/* Sub-items list */}
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium line-clamp-1 flex-1 uppercase">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-cyan-400 font-mono font-bold ml-2">
                        ${(item.product.price * (1 - item.product.discount / 100) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-900 pt-3 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-pink-400 font-bold">
                      <span>Voucher Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-900 pt-2 flex justify-between text-sm font-black text-white">
                    <span>Grand Total:</span>
                    <span className="text-cyan-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Checkout */}
                <button
                  onClick={() => {
                    if (!checkName || !checkAddress || !checkCity) {
                      alert('⚠️ PLEASE FILL IN ALL TRANSACTION COORDINATES!');
                      return;
                    }
                    placeOrder({
                      fullName: checkName,
                      address: checkAddress,
                      city: checkCity,
                      zipCode: checkZip
                    });
                    setCurrentPage('success');
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-pink-500/20"
                >
                  TRANSMIT DECRYPTERS (PLACE ORDER)
                </button>

                <div className="text-[9px] font-mono text-center text-slate-500 leading-normal uppercase">
                  By clicking TRANSMIT, you execute a secured, mock sandbox transaction. Loyalty points will instantly award on successful clearance.
                </div>

              </div>

            </div>

          </div>
        )}

        {/* PAGE: ORDER SUCCESS */}
        {currentPage === 'success' && lastOrderSuccess && (() => {
          const getMilestoneDates = (baseDateStr?: string) => {
            const baseDate = baseDateStr ? new Date(baseDateStr) : new Date();
            
            const formatDate = (d: Date) => {
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            };
            
            const dPlaced = new Date(baseDate);
            const dForging = new Date(baseDate);
            dForging.setDate(dForging.getDate() + 1);
            const dTransit = new Date(baseDate);
            dTransit.setDate(dTransit.getDate() + 3);
            const dDelivered = new Date(baseDate);
            dDelivered.setDate(dDelivered.getDate() + 5);
            
            return {
              placed: formatDate(dPlaced),
              forging: formatDate(dForging),
              transit: formatDate(dTransit),
              delivered: formatDate(dDelivered)
            };
          };

          const milestoneDates = getMilestoneDates(lastOrderSuccess.date);

          const containerVariants = {
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          };

          const itemVariants = {
            hidden: { opacity: 0, y: 15 },
            show: { 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
              }
            }
          };

          return (
            <div className="relative w-full overflow-hidden py-16 animate-fade-in" id="page-success-layout">
              
              {/* Native Confetti Canvas Layer */}
              <canvas ref={confettiCanvasRef} className="absolute inset-0 pointer-events-none z-0" />

              <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* Header Section */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-bounce">
                    <Check className="h-8 w-8" />
                  </div>

                  <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] block">
                    TRANSMISSION COMPLETE • SECURED
                  </span>

                  <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight leading-[0.9]">
                    Glow Order Cleared!
                  </h2>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                    Congratulations, pilot! Your order <span className="text-pink-400 font-bold font-mono">#{lastOrderSuccess.id}</span> has been broadcast to our Neo Shibuya fulfillment center. Standard teleport shipping is preparing custom cargo.
                  </p>
                </div>

                {/* Two-Column Bento Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Order details & Products List (Cargo Manifest) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Order Details box */}
                    <div className="border border-white/10 rounded-3xl bg-[#0A0715]/60 backdrop-blur-md p-6 font-mono space-y-4 shadow-xl">
                      <h3 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2 border-b border-white/10 pb-3">
                        <span>📡</span> SYSTEM TRANSMISSION METADATA
                      </h3>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                        <div className="text-slate-500">ORDER ID:</div>
                        <div className="text-slate-200 font-bold text-right">#{lastOrderSuccess.id}</div>
                        
                        <div className="text-slate-500">TIMESTAMP:</div>
                        <div className="text-slate-200 text-right">{lastOrderSuccess.date}</div>

                        <div className="text-slate-500">SHIPPING RECIPIENT:</div>
                        <div className="text-slate-200 text-right">{lastOrderSuccess.address.fullName}</div>

                        <div className="text-slate-500">TARGET FACTION COORDS:</div>
                        <div className="text-slate-200 text-right line-clamp-1">{lastOrderSuccess.address.street}, {lastOrderSuccess.address.city}</div>

                        <div className="text-slate-500">LOYALTY REWARD:</div>
                        <div className="text-pink-400 font-extrabold text-right">+{Math.floor(lastOrderSuccess.total * 10)} GP ⭐</div>
                      </div>
                    </div>

                    {/* Cargo Contents: Products List with Clean, Highly Visible Images */}
                    <div className="border border-white/10 rounded-3xl bg-[#0A0715]/60 backdrop-blur-md p-6 shadow-xl space-y-4">
                      <h3 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2 border-b border-white/10 pb-3 font-mono">
                        <span>📦</span> LOADED CARGO MANIFEST
                      </h3>
                      
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                      >
                        {lastOrderSuccess.items.map((item, idx) => {
                          const productDetails = PRODUCTS.find(p => p.id === item.productId);
                          const productImage = productDetails?.images?.[0];
                          const isExpanded = expandedManifestItem === `${idx}-${item.productId}`;
                          
                          return (
                            <motion.div 
                              key={idx} 
                              variants={itemVariants}
                              onClick={() => setExpandedManifestItem(isExpanded ? null : `${idx}-${item.productId}`)}
                              className="flex flex-col bg-white/5 border border-white/10 p-3 rounded-2xl hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-4 w-full">
                                {/* Product Image: Clean & Highly Visible */}
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#0A0715]/80 border-2 border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.35)]">
                                  {productImage ? (
                                    <img 
                                      src={productImage} 
                                      alt={item.name} 
                                      className="h-full w-full object-cover object-center contrast-[1.15] brightness-[1.10]" 
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-slate-900 flex items-center justify-center text-xs text-slate-500 font-mono">
                                      N/A
                                    </div>
                                  )}
                                </div>

                                {/* Details */}
                                <div className="flex-grow min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate font-sans uppercase tracking-tight">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                                    <span>QTY: {item.quantity}</span>
                                    {item.variant && (
                                      <>
                                        <span className="text-slate-600">•</span>
                                        <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[9px] uppercase text-pink-400 font-extrabold">
                                          {item.variant}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Price & Chevron */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <div className="text-right font-mono">
                                    <span className="text-xs font-bold text-cyan-400 block">${(item.price * item.quantity).toFixed(2)}</span>
                                    <span className="block text-[9px] text-slate-500">${item.price.toFixed(2)} ea</span>
                                  </div>
                                  <div className="text-slate-400 hover:text-white transition duration-200">
                                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                  </div>
                                </div>
                              </div>

                              {/* Expanded summary / benefits / ingredients */}
                              <AnimatePresence initial={false}>
                                {isExpanded && productDetails && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="w-full overflow-hidden border-t border-white/10 pt-3 space-y-3 text-left"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {/* Description */}
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-mono text-pink-400 font-extrabold uppercase tracking-widest block">
                                        ✨ Formula Benefits & Description
                                      </span>
                                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                        {productDetails.description}
                                      </p>
                                    </div>

                                    {/* Ingredients */}
                                    {productDetails.ingredients && productDetails.ingredients.length > 0 && (
                                      <div className="space-y-1">
                                        <span className="text-[10px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest block">
                                          🧪 Active Quantum Ingredients
                                        </span>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                          {productDetails.ingredients.map((ing, i) => (
                                            <span 
                                              key={i} 
                                              className="text-[9px] font-mono bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-md hover:border-cyan-500/20 hover:text-cyan-400 transition-colors duration-200"
                                            >
                                              {ing}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </motion.div>

                      {/* Total Bar */}
                      <div className="flex justify-between items-center bg-cyan-400/5 border border-cyan-400/20 p-4 rounded-2xl mt-4 font-mono">
                        <span className="text-xs text-slate-400 font-bold uppercase">CARGO TOTAL NET VALUE:</span>
                        <span className="text-base font-black text-cyan-400">${lastOrderSuccess.total.toFixed(2)}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Beautiful Timeline Tracking Component */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    <div className="border border-white/10 rounded-3xl bg-[#0A0715]/60 backdrop-blur-md p-6 shadow-xl">
                      
                      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                        <h3 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2 font-mono">
                          <span>🛰️</span> TELEPORT STATUS STREAM
                        </h3>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 font-mono text-[9px] font-bold text-pink-400 uppercase tracking-widest animate-pulse">
                          <span>●</span> LIVE SYNC
                        </span>
                      </div>

                      {/* Timeline Steps */}
                      <div className="relative pl-8 space-y-8">
                        {/* Progressive line */}
                        <div className="absolute left-[11px] top-1.5 bottom-1.5 w-[2px] bg-white/10"></div>
                        <div className="absolute left-[11px] top-1.5 h-1/3 w-[2px] bg-gradient-to-b from-cyan-400 to-pink-500"></div>

                        {/* Step 1: Order Placed */}
                        <div className="relative">
                          {/* Indicator node */}
                          <div className="absolute -left-[27px] top-0.5 h-5 w-5 rounded-full bg-cyan-400 border-4 border-[#0A0715] flex items-center justify-center text-[8px] text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                            ✓
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className="text-xs font-bold text-cyan-400 font-sans uppercase tracking-wide">Order Placed</h4>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">{milestoneDates.placed}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                              Transaction authorized. Quantum communication stream registered and cataloged into our secure network.
                            </p>
                          </div>
                        </div>

                        {/* Step 2: Forging */}
                        <div className="relative">
                          {/* Indicator node */}
                          <div className="absolute -left-[27px] top-0.5 h-5 w-5 rounded-full bg-pink-500 border-4 border-[#0A0715] flex items-center justify-center text-[8px] text-white font-black shadow-[0_0_10px_rgba(236,72,153,0.5)] animate-pulse">
                            ●
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className="text-xs font-bold text-pink-400 font-sans uppercase tracking-wide flex items-center gap-1">
                                Forging Formulas <span className="inline-block w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></span>
                              </h4>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">{milestoneDates.forging}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                              Neo-Shibuya synthesis labs are compounding bio-active ingredients under perfect temperature controls.
                            </p>
                          </div>
                        </div>

                        {/* Step 3: Transit */}
                        <div className="relative">
                          {/* Indicator node */}
                          <div className="absolute -left-[27px] top-0.5 h-5 w-5 rounded-full bg-slate-900 border-4 border-[#0A0715] flex items-center justify-center text-[8px] text-slate-500 font-black">
                            ○
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wide">Transit Routing</h4>
                              <span className="text-[10px] font-mono text-slate-600 font-medium">{milestoneDates.transit}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                              Super-charged high-speed mag-lev delivery stream dispatching to your coordinates.
                            </p>
                          </div>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative">
                          {/* Indicator node */}
                          <div className="absolute -left-[27px] top-0.5 h-5 w-5 rounded-full bg-slate-900 border-4 border-[#0A0715] flex items-center justify-center text-[8px] text-slate-500 font-black">
                            ○
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between">
                              <h4 className="text-xs font-bold text-slate-500 font-sans uppercase tracking-wide">Delivered & Synced</h4>
                              <span className="text-[10px] font-mono text-slate-600 font-medium">{milestoneDates.delivered}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                              Secured biometric drop-off. Cargo scan verified and unlocked for instant skin glow sync.
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Helper status text */}
                      <div className="mt-8 border-t border-white/10 pt-4 text-center">
                        <p className="text-[10px] font-mono text-slate-500 uppercase leading-normal">
                          💡 You can check live tracking updates anytime by pasting your order code in the <span className="text-cyan-400 font-bold">Track Order Terminal</span>.
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                {/* Return Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
                  <button
                    onClick={() => setCurrentPage('home')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-black tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,79,163,0.3)]"
                  >
                    RETURN TO SANCTUARY (HOME)
                  </button>

                  <button
                    onClick={() => {
                      setTrackInput(lastOrderSuccess.id);
                      setSearchedTrackOrder(lastOrderSuccess);
                      setCurrentPage('track');
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                  >
                    TRACK DELIVERY TERM
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white text-xs font-black tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    SHARE RECEIPT
                  </button>
                </div>

              </div>

            </div>
          );
        })()}

        {/* PAGE: USER PROFILE */}
        {currentPage === 'user' && (
          <UserProfileDashboard />
        )}

        {/* PAGE: LOGIN & PASSWORD RECOVERY */}
        {currentPage === 'login' && (
          <div className="mx-auto max-w-md px-4 py-16 animate-fade-in" id="page-login-layout">
            <div className="border border-purple-500/20 rounded-3xl bg-slate-950/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Header */}
              <div className="text-center mb-6">
                <span className="text-3xl block mb-2">✨</span>
                <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans">
                  {forgotStep === 'none' ? 'Sync Secure Node' : forgotStep === 'email' ? 'Forgot Password' : 'Reset Password'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  {forgotStep === 'none' 
                    ? 'Synchronize profile stats, order history, and preferences.'
                    : forgotStep === 'email' 
                    ? 'Enter your registered email to receive an authorization link.'
                    : 'Verify OTP code and create a new secure password.'
                  }
                </p>
              </div>

              {/* Error Box */}
              {authError && (
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-3 text-xs font-mono text-rose-400 mb-4 animate-fade-in flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}

              {/* Standard Login */}
              {forgotStep === 'none' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAuthError('');
                    if (!loginEmail || !loginPassword) {
                      setAuthError('Email and password fields are required.');
                      return;
                    }
                    const res = loginUserSecure(loginEmail, loginPassword);
                    if (res.success) {
                      if (redirectAfterLogin) {
                        setCurrentPage(redirectAfterLogin);
                        setRedirectAfterLogin(null);
                      } else {
                        setCurrentPage('home');
                      }
                      setLoginPassword('');
                    } else {
                      setAuthError(res.message || 'Login failed.');
                    }
                  }}
                  className="space-y-4 font-mono text-xs"
                >
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">Cognitive Email Node:</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setAuthError('');
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40 transition"
                      placeholder="e.g. pilot@shibuya.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-400 uppercase tracking-wider block">Access Cipher (Password):</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep('email');
                          setAuthError('');
                        }}
                        className="text-[10px] text-cyan-400 hover:underline hover:text-cyan-300"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setAuthError('');
                      }}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40 transition"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Remember Me Toggle */}
                  <div className="flex items-center gap-2 py-1 select-none">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-pink-500 rounded border-slate-800 bg-slate-900"
                    />
                    <label htmlFor="rememberMe" className="text-slate-400 cursor-pointer text-[11px]">
                      Keep terminal link active (Remember Me)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-slate-950 font-black tracking-widest uppercase text-xs shadow-lg shadow-pink-500/10 cursor-pointer active:scale-[0.98] transition"
                  >
                    SECURE SYNC TERMINAL
                  </button>

                  {/* Social Logins */}
                  <div className="relative my-6 border-t border-slate-900/60 pt-4 text-center">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-slate-950 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      OR COLLABORATE VIA
                    </span>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          socialLogin('Google');
                          if (redirectAfterLogin) {
                            setCurrentPage(redirectAfterLogin);
                            setRedirectAfterLogin(null);
                          } else {
                            setCurrentPage('home');
                          }
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-[11px] font-bold text-slate-300 transition"
                      >
                        <svg className="h-4 w-4 fill-current text-red-400" viewBox="0 0 24 24">
                          <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.86-3.577-7.86-8s3.53-8 7.86-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.92 1 12s4.92 11 11.24 11c6.59 0 10.97-4.63 10.97-11.1 0-.745-.08-1.32-.175-1.615H12.24z"/>
                        </svg>
                        Google
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          socialLogin('GitHub');
                          if (redirectAfterLogin) {
                            setCurrentPage(redirectAfterLogin);
                            setRedirectAfterLogin(null);
                          } else {
                            setCurrentPage('home');
                          }
                        }}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-[11px] font-bold text-slate-300 transition"
                      >
                        <svg className="h-4 w-4 fill-current text-indigo-400" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        GitHub
                      </button>
                    </div>
                  </div>

                  <div className="text-center pt-2 text-[10px]">
                    <span className="text-slate-500 mr-1.5">New pilot?</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setCurrentPage('register');
                        setAuthError('');
                      }}
                      className="text-cyan-400 font-bold hover:underline"
                    >
                      Forge Faction profile
                    </button>
                  </div>
                </form>
              )}

              {/* Forgot Password Link Request */}
              {forgotStep === 'email' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAuthError('');
                    const res = forgotPassword(forgotEmail);
                    if (res.success) {
                      setForgotStep('reset');
                      // Auto populate a fake code for easy demo
                      setForgotCode('GLOW-99X');
                    } else {
                      setAuthError(res.message);
                    }
                  }}
                  className="space-y-4 font-mono text-xs"
                >
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">Verify Account Email:</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40"
                      placeholder="pilot@shibuya.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-bold uppercase text-xs"
                  >
                    TRANSMIT OTP CODE
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep('none');
                        setAuthError('');
                      }}
                      className="text-[10px] text-slate-400 hover:underline"
                    >
                      ← Back to terminal login
                    </button>
                  </div>
                </form>
              )}

              {/* Reset Password OTP Input */}
              {forgotStep === 'reset' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAuthError('');
                    const res = resetPassword(forgotEmail, forgotCode, forgotNewPassword);
                    if (res.success) {
                      setForgotStep('none');
                      setForgotEmail('');
                      setForgotNewPassword('');
                      setForgotCode('');
                      setAuthError('');
                      // Speak success confirmation
                      speakAnime("Password reset successfully! Terminal links are updated.", voiceVolume, voiceMuted, 'elegant_heroine');
                    } else {
                      setAuthError(res.message);
                    }
                  }}
                  className="space-y-4 font-mono text-xs"
                >
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-[10px] text-emerald-400">
                    📡 Verification code sent to {forgotEmail}. Use <span className="font-bold underline">GLOW-99X</span> for demo.
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">OTP Security Code:</label>
                    <input
                      type="text"
                      required
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40"
                      placeholder="e.g. GLOW-99X"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">New Access Cipher (Password):</label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40"
                      placeholder="Min 6 characters"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 font-bold uppercase text-xs"
                  >
                    OVERWRITE ACCESS CIPHER
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotStep('email');
                        setAuthError('');
                      }}
                      className="text-[10px] text-slate-400 hover:underline"
                    >
                      ← Re-request code
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

        {/* PAGE: REGISTER */}
        {currentPage === 'register' && (
          <div className="mx-auto max-w-md px-4 py-16 animate-fade-in" id="page-register-layout">
            <div className="border border-purple-500/20 rounded-3xl bg-slate-950/85 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              
              <div className="text-center mb-6">
                <span className="text-3xl block mb-2">⚔️</span>
                <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans">Forge Faction Profile</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">Build your customizable profile stats with loyalty perks.</p>
              </div>

              {authError && (
                <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-3 text-xs font-mono text-rose-400 mb-4 animate-fade-in">
                  ⚠️ {authError}
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setAuthError('');
                  if (!regEmail || !regName || !regPassword) {
                    setAuthError('Please fill out all required fields.');
                    return;
                  }
                  
                  const finalGender = regGender === 'Custom' ? (document.getElementById('custom-gender-input') as HTMLInputElement)?.value || 'Custom' : regGender;
                  
                  const res = registerUserSecure(regEmail, regName, regPassword, regUsername, finalGender, regSkin);
                  if (res.success) {
                    if (redirectAfterLogin) {
                      setCurrentPage(redirectAfterLogin);
                      setRedirectAfterLogin(null);
                    } else {
                      setCurrentPage('home');
                    }
                    // Reset fields
                    setRegPassword('');
                    setRegUsername('');
                    setAuthError('');
                  } else {
                    setAuthError(res.message);
                  }
                }}
                className="space-y-4 font-mono text-xs"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">Pilot Full Name:</label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40 transition"
                      placeholder="e.g. Haru Sakura"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">Username ID:</label>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40 transition"
                      placeholder="e.g. haru_99"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase tracking-wider block">Cognitive Email:</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40 transition"
                    placeholder="pilot@shibuya.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase tracking-wider block">Access Cipher (Password):</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40 transition"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">Gender Identity:</label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none"
                    >
                      <option value="Prefer not to say">Prefer not to say</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Custom">Custom Text Input</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider block">Skin Element Type:</label>
                    <select
                      value={regSkin}
                      onChange={(e) => setRegSkin(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none"
                    >
                      <option value="Normal">Normal / Balanced Dew</option>
                      <option value="Dry">Dry / Frost Rime</option>
                      <option value="Oily">Oily / Flame Ember</option>
                      <option value="Combination">Combination / T-Zone</option>
                    </select>
                  </div>
                </div>

                {/* Custom Gender Option */}
                {regGender === 'Custom' && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-slate-400 uppercase tracking-wider block">Specify Custom Gender Identity:</label>
                    <input
                      type="text"
                      id="custom-gender-input"
                      required
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-cyan-500/40"
                      placeholder="e.g. Kitsune Star"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 mt-2 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black tracking-widest uppercase text-xs active:scale-[0.98] transition shadow-lg shadow-cyan-400/10 cursor-pointer"
                >
                  FORGE PROFILE PROTOCOLS
                </button>

                <div className="text-center pt-2 text-[10px]">
                  <span className="text-slate-500 mr-1.5">Already registered?</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setCurrentPage('login');
                      setAuthError('');
                    }}
                    className="text-pink-400 font-bold hover:underline"
                  >
                    Sync terminal node
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PAGE: CURATED COLLECTIONS */}
        {currentPage === 'collections' && (
          <div className="space-y-8 animate-fade-in" id="page-collections-layout">
            <CollectionsGrid />
          </div>
        )}

        {/* PAGE: REWARDS & LUCKY WHEEL */}
        {currentPage === 'rewards' && (
          <div className="animate-fade-in" id="page-rewards-layout">
            <LuckyWheel />
          </div>
        )}

        {/* PAGE: ALCHEMY SKINCARE QUIZ */}
        {currentPage === 'quiz' && (
          <div className="animate-fade-in" id="page-quiz-layout">
            <SkincareQuiz />
          </div>
        )}

        {/* PAGE: ABOUT US */}
        {currentPage === 'about' && (
          <div className="mx-auto max-w-4xl px-4 py-12 animate-fade-in" id="page-about-layout">
            <div className="text-center mb-8">
              <span className="text-3xl block">🏮</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl">
                The AnimeGlow Backstory
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-mono">APOTHECARY FACTION ORIGINS</p>
            </div>

            <div className="border border-purple-500/15 rounded-3xl bg-slate-950/80 p-6 sm:p-10 shadow-2xl leading-relaxed space-y-6 text-slate-300 text-xs sm:text-sm">
              <p>
                Established in the virtual corridors of Neo-Tokyo, **AnimeGlow** was forged by a collective of teenage chemists, designers, and anime fanatics. Our vision was to dismantle boring, clinical skincare bottles and build an interactive cosmetic realm where daily self-care feels like stepping into a premium anime campaign.
              </p>
              <p>
                Every single toner, clay mask, and oversized hoodie we craft undergoes rigorous alchemical validation. We extract high-potency Japanese cherry blossoms (Sakura), organic ceremonial green teas (Matcha), and nutrient-rich snail mucins to engineer formulations that defend teen skin from modern stressors—primarily screen-induced blue light radiation and late-night study breakouts.
              </p>
              <div className="border border-cyan-500/15 rounded-2xl bg-cyan-950/5 p-4 flex flex-col sm:flex-row gap-4 items-center">
                <span className="text-4xl shrink-0">🛡️</span>
                <p className="text-xs text-slate-400">
                  **Anti-Copyright Shield Integrity:** AnimeGlow respects and upholds intellectual property. We do NOT use copyrighted characters, brands, or designs. All kitsune mascots, Oni crests, mech concepts, and magical characters are 100% original creations generated inside our virtual apothecary.
                </p>
              </div>
              <p>
                Join our vanguard. Complete our interactive quiz, spin the lucky fortune wheel, unlock custom ranks from "Glow Cadet" to "Elite Otaku", and customize your physical desk setup with procedurally rotatable 3D collectibles. This is the new era of cosmetic lifestyle.
              </p>
            </div>
          </div>
        )}

        {/* PAGE: CONTACT TRANSMITTERS */}
        {currentPage === 'contact' && (
          <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in" id="page-contact-layout">
            <div className="text-center mb-8">
              <span className="text-3xl block">📡</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl">
                Transmit Faction Signals
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-mono">SUPPORT CORE TRANSMIT PROTOCOLS</p>
            </div>

            <div className="border border-purple-500/15 rounded-3xl bg-slate-950 p-6 sm:p-8 shadow-2xl">
              {contactSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Send className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide">SIGNAL DISPATCHED SECURELY!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Hiku has queued your coordinates. Our support vanguard will transmit an email response back to your console address in 4 hours.
                  </p>
                  <button
                    onClick={() => { setContactSubmitted(false); setContactMessage(''); }}
                    className="px-5 py-2 rounded-xl border border-pink-500/20 text-xs font-mono text-pink-400 hover:bg-pink-500/10 uppercase"
                  >
                    TRANSIT NEW SIGNAL
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }}
                  className="space-y-4 font-mono text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Pilot Call Sign:</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none"
                        placeholder="e.g. Haru Sakura"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Console Email:</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none"
                        placeholder="e.g. pilot@shibuya.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-500 uppercase tracking-wider block">Transmitting Message Body:</label>
                    <textarea
                      required
                      rows={5}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none resize-none"
                      placeholder="e.g. Looking for wholesale custom hoodies, or reporting a delivery coordinate issue..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 font-black tracking-widest uppercase text-xs shadow-lg shadow-pink-500/10"
                  >
                    DISPATCH FACTION TRANSMISSION
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* PAGE: FAQ INTEGRATIONS */}
        {currentPage === 'faq' && (
          <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in" id="page-faq-layout">
            <div className="text-center mb-10">
              <span className="text-3xl block">🔮</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl">
                Apothecary Holo-FAQs
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-mono">COGNITIVE INDEX PROTOCOLS</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "🧪 Are AnimeGlow skincare formulas safe for sensitive teenage skin?",
                  a: "Absolutely! Every item is formulated under severe chemical oversight. We omit toxic parabens, sulfates, and heavy mineral oils. We specialize in soothing, bio-active organic flora (cherry blossom, lavender distillate) and dermatologically-backed snail mucin, cica, and low-dose BHA tailored for active youth."
                },
                {
                  q: "🦊 Are the anime characters on your hoodies copyrighted?",
                  a: "No! All character emblems, mechs, and fox-spirit mascots (like Hiku and Yuki) are 100% original intellectual property designed inside our custom studio. You can wear them proudly at conventions with absolute legal security."
                },
                {
                  q: "🎡 How does the loyalty point rank program function?",
                  a: "Points (GP) represent your rank progress. You earn 300 GP on registry, 5 GP for browsing carts, and 10 GP per dollar spent on orders. Ranking up unlocks free mystery blind boxes and higher discount decoders in your profile cockpit!"
                },
                {
                  q: "📦 How do I track delivery progress of my satchel packages?",
                  a: "Easy! Once checkout triggers, you receive a transaction order ID (like AG-9081). Enter this order number in our TRACK CHRONO-ORDER tab to view a graphical real-time telemetry line!"
                }
              ].map((faq, idx) => {
                const isOpen = faqOpen[idx];
                return (
                  <div 
                    key={idx}
                    className="border border-purple-500/15 rounded-2xl bg-slate-950 p-4 transition-all hover:border-pink-500/30 cursor-pointer"
                    onClick={() => setFaqOpen({ ...faqOpen, [idx]: !isOpen })}
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-100 uppercase tracking-wide">
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 text-pink-400" /> : <ChevronDown className="h-4 w-4 text-pink-400" />}
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs text-slate-300 leading-relaxed font-medium border-t border-slate-900 pt-3 animate-fade-in font-sans">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PAGE: CHRONICLES OF GLOW (BLOG) */}
        {currentPage === 'blog' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in" id="page-blog-layout">
            <div className="text-center mb-10">
              <span className="text-3xl block">📚</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl">
                Cosmic Chronicles Blog
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-mono">COSMIC LIFESTYLE INTEL PROTOCOLS</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div 
                  key={post.id}
                  className="border border-purple-500/10 rounded-3xl bg-slate-950 p-4 space-y-4 hover:border-pink-500/30 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-3">
                      <span>{post.date}</span>
                      <span>By {post.author}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-slate-100 uppercase mt-2 tracking-wide line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed font-medium font-sans">
                      {post.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-900 flex justify-between items-center font-mono text-[10px]">
                    <span className="text-slate-500">{post.readTime}</span>
                    <button 
                      onClick={() => alert(`📚 Full transmission for ${post.title} is preparing for publishing in active matrix.`)}
                      className="text-pink-400 font-bold hover:underline"
                    >
                      READ TRANSMISSION &gt;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE: TRACK ORDER PROGRESSION */}
        {currentPage === 'track' && (
          <div className="mx-auto max-w-3xl px-4 py-12 animate-fade-in" id="page-track-layout">
            <div className="text-center mb-8">
              <span className="text-3xl block">📦</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight sm:text-4xl">
                Track Chrono-Package
              </h2>
              <p className="mt-2 text-sm text-slate-400 font-mono">REAL-TIME MOVEMENT METRICS</p>
            </div>

            <div className="border border-purple-500/15 rounded-3xl bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
              
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-slate-500 uppercase tracking-wider block">Enter Order Registry Code:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-4 py-3 outline-none uppercase font-mono"
                    placeholder="e.g. AG-9081"
                  />
                  <button
                    onClick={() => {
                      const match = orders.find(o => o.id === trackInput);
                      if (match) {
                        setSearchedTrackOrder(match);
                      } else {
                        setSearchedTrackOrder(null);
                        alert('⚠️ ORDER REPOSITORY ID NOT FOUND IN SECURE INDEX! TRY AG-9081');
                      }
                    }}
                    className="bg-cyan-400 hover:bg-cyan-500 text-slate-950 font-black px-6 py-3 rounded-xl transition uppercase font-sans text-xs"
                  >
                    Ping node
                  </button>
                </div>
              </div>

              {searchedTrackOrder ? (
                <div className="space-y-6 pt-4 animate-fade-in">
                  
                  {/* Order metrics */}
                  <div className="border border-slate-900 rounded-2xl bg-slate-900/30 p-4 font-mono text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">PING STATUS:</span>
                      <span className={`font-bold uppercase ${searchedTrackOrder.status === 'Cancelled' ? 'text-rose-500' : 'text-emerald-400'}`}>
                        {searchedTrackOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CARGO VALUE:</span>
                      <span className={`font-bold ${searchedTrackOrder.status === 'Cancelled' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        ${searchedTrackOrder.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Faction coordinates:</span>
                      <span className="text-slate-300">{searchedTrackOrder.address.fullName}, {searchedTrackOrder.address.street}</span>
                    </div>
                  </div>

                  {searchedTrackOrder.status === 'Cancelled' ? (
                    <div className="border border-rose-500/10 rounded-2xl bg-rose-500/5 p-4 font-mono text-xs text-rose-400 text-center uppercase tracking-wide">
                      🛑 Synthesis stream terminated. Order transaction cancelled.
                    </div>
                  ) : (
                    /* Progressive visual bar timeline */
                    <div className="relative py-4 font-mono text-[9px] text-slate-500 uppercase">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-900 -translate-y-1/2 rounded z-0"></div>
                      
                      {/* Fill line if shipped or delivered */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-cyan-400 -translate-y-1/2 rounded z-0 transition-all duration-500"
                        style={{ 
                          width: searchedTrackOrder.status === 'Delivered' 
                            ? '100%' 
                            : searchedTrackOrder.status === 'Out for Delivery' 
                              ? '66%' 
                              : searchedTrackOrder.status === 'Shipped' 
                                ? '33%' 
                                : '10%' 
                        }}
                      ></div>

                      <div className="relative z-10 flex justify-between">
                        <div className="flex flex-col items-center">
                          <span className="h-5 w-5 rounded-full bg-cyan-400 text-slate-950 font-black flex items-center justify-center">1</span>
                          <span className="mt-1 font-bold text-slate-300">Processing</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center font-black ${['Shipped', 'Out for Delivery', 'Delivered'].includes(searchedTrackOrder.status) ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900'}`}>2</span>
                          <span className="mt-1">Shipped</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center font-black ${['Out for Delivery', 'Delivered'].includes(searchedTrackOrder.status) ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900'}`}>3</span>
                          <span className="mt-1">Out For Delivery</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className={`h-5 w-5 rounded-full flex items-center justify-center font-black ${searchedTrackOrder.status === 'Delivered' ? 'bg-cyan-400 text-slate-950' : 'bg-slate-900'}`}>4</span>
                          <span className="mt-1">Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-900 rounded-2xl text-xs text-slate-500 font-mono uppercase">
                  📡 TRANSMIT CODE PROTOCOLS TO RETRIEVE ACTIVE STATUS
                </div>
              )}

            </div>
          </div>
        )}

        {/* PAGE: 404 FALLBACK */}
        {currentPage === '404' && (
          <div className="mx-auto max-w-md text-center py-16 space-y-6 animate-fade-in" id="page-404-layout">
            <span className="text-6xl block">😿</span>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              404 ARCHIVE LOST
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-mono max-w-sm mx-auto">
              Hiku got lost in the database corridor. This page coordinates are unregistered in our holo-cache maps matrix.
            </p>
            <button
              onClick={() => setCurrentPage('home')}
              className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-black uppercase tracking-wider transition"
            >
              RETURN TO CORE COCKPIT (HOME)
            </button>
          </div>
        )}

      </main>

      {/* Floating interactive Kitsune widget assistant */}
      <MascotWidget />

      {/* Reusable Quick View Modal overlay */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

      {/* Cancel Order Confirmation Modal overlay */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0A0715]/80 backdrop-blur-md"
            onClick={() => setOrderToCancel(null)}
          ></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0A0715] p-6 shadow-2xl z-10 animate-scale-up">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 text-xl font-bold">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider font-sans">
                  Terminate Transmission?
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
                  Are you absolutely sure you want to cancel order <span className="text-pink-400 font-bold">#{orderToCancel}</span>? 
                  This will immediately halt the synthesis queue and reverse loyalty points gained.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setOrderToCancel(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white font-mono uppercase tracking-wider transition duration-200"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => {
                    cancelOrder(orderToCancel);
                    setOrderToCancel(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-slate-950 text-xs font-black uppercase tracking-wider transition duration-200 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Receipt Modal overlay */}
      <AnimatePresence>
        {showShareModal && lastOrderSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0A0715]/90 backdrop-blur-md"
              onClick={() => setShowShareModal(false)}
            ></motion.div>
            
            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-[#0A0715] p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="text-center space-y-2">
                  <span className="text-3xl block">📡</span>
                  <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 uppercase tracking-widest font-sans">
                    Cargo Receipt Broadcast
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    Select transport vector to share cargo manifest
                  </p>
                </div>

                {/* Holographic Card Receipt */}
                <div className="relative border border-dashed border-cyan-500/30 rounded-2xl bg-slate-950 p-5 space-y-4 font-mono text-[11px] text-slate-300 shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] via-transparent to-pink-500/[0.02] pointer-events-none"></div>

                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">⚡ NEOTOPIC MANIFEST</span>
                    <span className="text-[9px] text-slate-500">REV: 06-2026</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">SECURE ID:</span>
                      <span className="text-white font-bold">#{lastOrderSuccess.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TIMESTAMP:</span>
                      <span className="text-slate-400">{lastOrderSuccess.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PILOT COGNOMEN:</span>
                      <span className="text-slate-300">{lastOrderSuccess.address.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DESTINATION:</span>
                      <span className="text-slate-300 line-clamp-1">{lastOrderSuccess.address.street}, {lastOrderSuccess.address.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GP TELEMETRY:</span>
                      <span className="text-pink-400 font-bold">+{Math.floor(lastOrderSuccess.total * 10)} GP</span>
                    </div>
                  </div>

                  {/* Items list inside receipt */}
                  <div className="border-t border-b border-white/5 py-3 space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">SHIPPED MODULES:</span>
                    {lastOrderSuccess.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between gap-4">
                        <span className="text-slate-300 truncate">
                          • {item.name} {item.variant ? `(${item.variant})` : ''} <span className="text-slate-500">x{item.quantity}</span>
                        </span>
                        <span className="text-cyan-400 font-bold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-1 font-bold">
                    <span className="text-[10px] text-slate-400 uppercase">NET CARGO VALUE:</span>
                    <span className="text-sm font-black text-cyan-400">${lastOrderSuccess.total.toFixed(2)}</span>
                  </div>

                  <div className="text-center text-[9px] text-slate-500 border-t border-white/5 pt-2 uppercase tracking-wide leading-normal">
                    🛰️ SCAN COMPLETED. QUANTUM ENVELOPE SECURED.
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCopyReceipt(lastOrderSuccess)}
                    className="px-4 py-3 rounded-xl border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-400/5 text-xs text-white font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {copiedReceipt ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-cyan-400" />
                        <span>Copy Manifest</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShareReceipt(lastOrderSuccess)}
                    className="px-4 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share Receipt</span>
                  </button>
                </div>

                {/* Close Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-white transition duration-200"
                  >
                    [ Abort Sync / Close ]
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Image Lightbox Overlay */}
      <AnimatePresence>
        {lightboxProduct && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 md:p-8">
            {/* Dark blur backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#06040C]/96 backdrop-blur-xl"
              onClick={() => setLightboxProduct(null)}
            />

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-5xl z-10 flex flex-col lg:flex-row items-center gap-6 md:gap-10 p-4 md:p-8 bg-[#0C081B]/85 border border-purple-500/20 rounded-3xl shadow-[0_0_80px_rgba(236,72,153,0.15)] max-h-[92vh] overflow-y-auto"
            >
              {/* Close Button top-right corner of card */}
              <button
                onClick={() => setLightboxProduct(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full border border-white/10 transition-all duration-200 z-30 group"
                title="Close Lightbox"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Left Column: Image Stage */}
              <div className="flex-1 w-full flex flex-col items-center justify-center relative">
                
                {/* Main Large Image frame with subtle holographic look */}
                <div className="relative aspect-square w-full max-w-md md:max-w-lg overflow-hidden rounded-2xl border-2 border-pink-500/30 bg-[#06040C]/50 flex items-center justify-center group shadow-2xl">
                  {/* Holographic scanning line effect */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-20 pointer-events-none animate-scan"></div>
                  
                  <img
                    src={lightboxProduct.images[lightboxImageIndex]}
                    alt={`${lightboxProduct.name} - View ${lightboxImageIndex + 1}`}
                    className="max-h-full max-w-full object-contain p-2 md:p-6 transition-transform duration-300 ease-out hover:scale-110 cursor-zoom-in contrast-[1.10] brightness-[1.05]"
                    referrerPolicy="no-referrer"
                  />

                  {/* Left Navigation Arrow */}
                  {lightboxProduct.images.length > 1 && (
                    <button
                      onClick={() => setLightboxImageIndex(prev => prev === 0 ? lightboxProduct.images.length - 1 : prev - 1)}
                      className="absolute left-3 p-3 rounded-full bg-slate-950/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-pink-500/40 transition-all duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}

                  {/* Right Navigation Arrow */}
                  {lightboxProduct.images.length > 1 && (
                    <button
                      onClick={() => setLightboxImageIndex(prev => prev === lightboxProduct.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-3 p-3 rounded-full bg-slate-950/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-pink-500/40 transition-all duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}

                  {/* Image Counter Badge */}
                  <span className="absolute bottom-3 right-3 font-mono text-[10px] bg-slate-950/80 border border-white/10 text-slate-300 px-2 py-1 rounded">
                    IMAGE {lightboxImageIndex + 1} / {lightboxProduct.images.length}
                  </span>
                </div>

                {/* Thumbnails list at bottom */}
                {lightboxProduct.images.length > 1 && (
                  <div className="flex justify-center gap-2.5 mt-4 w-full max-w-xs md:max-w-md overflow-x-auto pb-1">
                    {lightboxProduct.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImageIndex(i)}
                        className={`relative h-12 w-12 md:h-14 md:w-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                          i === lightboxImageIndex 
                            ? 'border-pink-500 scale-105 shadow-[0_0_10px_rgba(236,72,153,0.4)]' 
                            : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/30'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt="thumbnail" 
                          className="h-full w-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Detailed Context Information */}
              <div className="w-full lg:w-[350px] flex flex-col justify-between self-stretch text-left space-y-6 pt-2">
                <div className="space-y-4">
                  
                  {/* Category & Rating */}
                  <div className="flex items-center justify-between font-mono text-[10px] text-pink-400 font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                    <span>{lightboxProduct.subCategory}</span>
                    <span className="text-yellow-400 flex items-center gap-0.5">⭐ {lightboxProduct.rating}</span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xl font-black text-white uppercase tracking-wide leading-tight">
                    {lightboxProduct.name}
                  </h3>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-2 font-mono">
                    {lightboxProduct.discount > 0 ? (
                      <>
                        <span className="text-xl font-black text-cyan-400">
                          ${(lightboxProduct.price * (1 - lightboxProduct.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ${lightboxProduct.price.toFixed(2)}
                        </span>
                        <span className="text-[9px] bg-pink-500/10 border border-pink-500/20 text-pink-400 font-extrabold px-1.5 py-0.5 rounded">
                          {lightboxProduct.discount}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-black text-cyan-400">
                        ${lightboxProduct.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description Box */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Core Telemetry & Decals:</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans max-h-48 overflow-y-auto pr-1">
                      {lightboxProduct.description}
                    </p>
                  </div>

                  {/* Additional details list */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2 font-mono text-[10px] text-slate-400 uppercase">
                    <div className="flex justify-between">
                      <span>FORMULA CODE:</span>
                      <span className="text-white font-bold">ALCH-{lightboxProduct.id.slice(0, 5).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DELIVERY STATUS:</span>
                      <span className="text-emerald-400 font-bold">CARGO READY</span>
                    </div>
                  </div>
                </div>

                {/* Buy Trigger directly inside lightbox */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 uppercase">
                    <span>SELECT QUANTITY IN BASE</span>
                    <span className="text-pink-400 font-bold">+10% Loyalty Points</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      addToCart(lightboxProduct, lightboxProduct.variants[0], 1);
                      setLightboxProduct(null);
                    }}
                    className="w-full py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 active:scale-95 text-slate-950 font-black text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/15"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>LOAD INTO CARGO BAG</span>
                  </button>

                  <p className="text-[9px] text-center text-slate-500 uppercase font-mono leading-none pt-1">
                    [ Click anywhere outside card or press ESC to exit ]
                  </p>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Anime Voice Notification Popup */}
      <AnimatePresence>
        {activeAnimeVoicePopup && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Dark glass backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#06040C]/85 backdrop-blur-md"
              onClick={() => {
                window.speechSynthesis?.cancel();
                setActiveAnimeVoicePopup(null);
              }}
            />

            {/* Glowing Popup Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -50 }}
              transition={{ type: "spring", damping: 15 }}
              className={`relative w-full max-w-lg p-6 sm:p-8 rounded-[36px] border-2 bg-[#090616]/95 z-[130] flex flex-col items-center text-center space-y-6 ${
                activeAnimeVoicePopup.type === 'success' 
                  ? activeAnimeVoicePopup.style === 'hero'
                    ? 'border-orange-500 shadow-[0_0_80px_rgba(249,115,22,0.35)]'
                    : 'border-pink-500 shadow-[0_0_80px_rgba(236,72,153,0.35)]'
                  : 'border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.35)]'
              }`}
            >
              {/* Floating indicators and particles based on character selected */}
              {activeAnimeVoicePopup.type === 'success' ? (
                activeAnimeVoicePopup.style === 'hero' ? (
                  <>
                    <div className="absolute -top-10 left-1/4 text-4xl animate-bounce">🔥</div>
                    <div className="absolute -top-6 right-1/4 text-4xl animate-bounce delay-100">💥</div>
                    <div className="absolute bottom-10 left-6 text-3xl animate-pulse">⚡</div>
                    <div className="absolute top-1/2 right-6 text-3xl animate-pulse delay-150">⭐</div>
                  </>
                ) : (
                  <>
                    <div className="absolute -top-10 left-1/4 text-4xl animate-bounce">🎉</div>
                    <div className="absolute -top-6 right-1/4 text-4xl animate-bounce delay-100">💖</div>
                    <div className="absolute bottom-10 left-6 text-3xl animate-pulse">✨</div>
                    <div className="absolute top-1/2 right-6 text-3xl animate-pulse delay-150">🌸</div>
                  </>
                )
              ) : (
                <>
                  <div className="absolute -top-10 left-1/4 text-4xl animate-bounce">😢</div>
                  <div className="absolute bottom-10 left-6 text-3xl animate-pulse">💧</div>
                  <div className="absolute top-1/2 right-6 text-3xl animate-pulse">🌧️</div>
                </>
              )}

              {/* Character Illustration Badge */}
              <div className="relative">
                {activeAnimeVoicePopup.type === 'success' ? (
                  activeAnimeVoicePopup.style === 'hero' ? (
                    <div className="relative h-28 w-28 bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
                      <span className="text-5xl animate-bounce">🦸‍♂️</span>
                      <span className="absolute -bottom-2 bg-orange-500 text-white text-[9px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-widest border border-white whitespace-nowrap">
                        ⚡ HERO MODE
                      </span>
                    </div>
                  ) : (
                    <div className="relative h-28 w-28 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
                      <span className="text-5xl animate-bounce">🦊</span>
                      <span className="absolute -bottom-2 bg-pink-500 text-white text-[9px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-widest border border-white whitespace-nowrap">
                        🌸 KAWAII MODE
                      </span>
                    </div>
                  )
                ) : (
                  <div className="relative h-28 w-28 bg-gradient-to-tr from-slate-700 via-cyan-700 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <span className="text-5xl filter grayscale-[30%] animate-pulse">😢</span>
                    <span className="absolute -bottom-2 bg-cyan-500 text-slate-950 text-[9px] font-black font-mono px-3 py-1 rounded-full uppercase tracking-widest border border-white whitespace-nowrap">
                      💧 GOMEN NASAI
                    </span>
                  </div>
                )}
              </div>

              {/* Header */}
              <div className="space-y-2">
                <span className={`font-mono text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                  activeAnimeVoicePopup.type === 'success' 
                    ? activeAnimeVoicePopup.style === 'hero'
                      ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                      : 'bg-pink-500/15 border border-pink-500/30 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]'
                    : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                }`}>
                  {activeAnimeVoicePopup.type === 'success' 
                    ? activeAnimeVoicePopup.style === 'hero'
                      ? '⚡ HERO PROTOCOL SECURED ⚡' 
                      : '✨ KAWAII TRANSMISSION COMPLETE ✨' 
                    : '😢 COURIER QUEUE SUSPENDED 😢'}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-wider font-sans pt-2">
                  {activeAnimeVoicePopup.type === 'success' 
                    ? activeAnimeVoicePopup.style === 'hero'
                      ? 'IKUZO! ORDER DISPATCHED!' 
                      : 'ARIGATO GOZAIMASU!' 
                    : 'HIKU SAYS SOFTLY:'}
                </h3>
              </div>

              {/* Message Block */}
              <div className="w-full bg-[#05030A] border border-white/10 rounded-2xl p-4 md:p-6 shadow-inner relative">
                <p className="text-xs text-slate-200 leading-relaxed font-semibold font-sans">
                  "{activeAnimeVoicePopup.text}"
                </p>
              </div>

              {/* Action buttons */}
              <div className="w-full pt-1">
                <button
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setActiveAnimeVoicePopup(null);
                  }}
                  className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all duration-300 w-48 ${
                    activeAnimeVoicePopup.type === 'success'
                      ? activeAnimeVoicePopup.style === 'hero'
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95'
                        : 'bg-pink-500 hover:bg-pink-600 text-slate-950 shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95'
                      : 'bg-cyan-400 hover:bg-cyan-500 text-slate-950 shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95'
                  }`}
                >
                  Close Waveform
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Anime Voice Controller Widget */}
      <div className="fixed bottom-6 left-6 z-[90] flex flex-col items-start gap-2.5 font-mono" id="voice-control-widget">
        
        {/* Expanded Panel */}
        <AnimatePresence>
          {showVoiceControlPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-72 rounded-3xl border border-pink-500/30 bg-slate-950/95 p-5 shadow-[0_0_35px_rgba(236,72,153,0.25)] backdrop-blur-xl space-y-4 text-slate-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 uppercase tracking-widest">
                  🔊 Hiku Voice Cockpit
                </span>
                <button 
                  onClick={() => setShowVoiceControlPanel(false)}
                  className="text-slate-400 hover:text-white text-[9px] font-bold"
                >
                  HIDE
                </button>
              </div>

              {/* Mute toggle button */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-black">Link Status:</span>
                <button
                  onClick={handleToggleMute}
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                    voiceMuted 
                      ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' 
                      : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  }`}
                >
                  {voiceMuted ? '🤐 MUTED' : '🔊 ONLINE'}
                </button>
              </div>

              {/* Style Preference Select */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black">
                  <span>Voice Archetype:</span>
                  <span className="text-pink-400 font-bold uppercase text-[9px]">
                    {voiceStyle === 'cute_heroine' ? 'Cute Fox' : 
                     voiceStyle === 'elegant_heroine' ? 'Elegant Lady' :
                     voiceStyle === 'confident_hero' ? 'Confident Hero' :
                     voiceStyle === 'calm_hero' ? 'Calm Hermit' : 'Random Voice'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[8px]">
                  <button
                    onClick={() => handleStyleChange('cute_heroine')}
                    className={`py-1 rounded-lg font-black uppercase border transition-all ${
                      voiceStyle === 'cute_heroine'
                        ? 'bg-pink-500/25 border-pink-500 text-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.2)]'
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Cute 🦊
                  </button>
                  <button
                    onClick={() => handleStyleChange('elegant_heroine')}
                    className={`py-1 rounded-lg font-black uppercase border transition-all ${
                      voiceStyle === 'elegant_heroine'
                        ? 'bg-purple-500/25 border-purple-500 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Elegant 🌸
                  </button>
                  <button
                    onClick={() => handleStyleChange('confident_hero')}
                    className={`py-1 rounded-lg font-black uppercase border transition-all ${
                      voiceStyle === 'confident_hero'
                        ? 'bg-orange-500/25 border-orange-500 text-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.2)]'
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Bold 🦸‍♂️
                  </button>
                  <button
                    onClick={() => handleStyleChange('calm_hero')}
                    className={`py-1 rounded-lg font-black uppercase border transition-all ${
                      voiceStyle === 'calm_hero'
                        ? 'bg-emerald-500/25 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Calm 🍃
                  </button>
                </div>
                <button
                  onClick={() => handleStyleChange('random')}
                  className={`w-full py-1 mt-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider border transition-all ${
                    voiceStyle === 'random'
                      ? 'bg-cyan-500/25 border-cyan-500 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                      : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                  }`}
                >
                  Randomize Voice Core 🌀
                </button>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black">
                  <span>Volume Level:</span>
                  <span className="text-cyan-400 font-bold">{Math.round(voiceVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  disabled={voiceMuted}
                  className="w-full accent-pink-500 h-1 bg-slate-900 rounded cursor-pointer disabled:opacity-40"
                />
              </div>

              {/* Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 uppercase font-black">
                  <span>Voice speed:</span>
                  <span className="text-cyan-400 font-bold">{voiceSpeed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  disabled={voiceMuted}
                  className="w-full accent-cyan-500 h-1 bg-slate-900 rounded cursor-pointer disabled:opacity-40"
                />
              </div>

              {/* Test Trigger Button */}
              <button
                onClick={handleTestVoice}
                disabled={voiceMuted}
                className="w-full py-2 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 disabled:opacity-40 text-slate-950 font-black text-[9px] tracking-widest uppercase rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>⚡ Test Voice Core</span>
              </button>

              {/* Core technical telemetry readout for anime-vibe layout */}
              <div className="text-[8px] text-slate-500 leading-none pt-1.5 border-t border-white/5 flex justify-between uppercase">
                <span>PITCH: {voiceStyle === 'cute_heroine' ? '1.55 Kawaii' : voiceStyle === 'elegant_heroine' ? '1.22 Elegant' : voiceStyle === 'confident_hero' ? '0.85 Bold' : voiceStyle === 'calm_hero' ? '0.76 Calm' : 'Dynamic'}</span>
                <span>SPEED: {voiceSpeed.toFixed(2)}x</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <button
          onClick={() => setShowVoiceControlPanel(prev => !prev)}
          className={`h-11 w-11 rounded-full border flex items-center justify-center transition-all duration-300 relative group shadow-lg ${
            showVoiceControlPanel
              ? 'bg-pink-500 border-white text-slate-950 scale-105 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
              : 'bg-[#0E0B24]/90 border-pink-500/30 text-pink-400 hover:border-pink-500 hover:bg-pink-500/10'
          }`}
          title="Toggle Anime Voice Cockpit"
        >
          {/* Pulsing visual glow overlay if unmuted */}
          {!voiceMuted && (
            <span className="absolute inset-0 rounded-full border border-pink-500/50 animate-ping opacity-60 pointer-events-none" />
          )}
          
          <span className="text-lg font-bold group-hover:scale-110 transition-transform">
            {voiceMuted ? '🦊💤' : '🦊💬'}
          </span>
        </button>

      </div>

      {/* Checkout Authentication Modal */}
      {showCheckoutAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="border border-purple-500/30 rounded-3xl bg-[#0c081f]/95 p-6 max-w-sm w-full shadow-[0_20px_50px_rgba(236,72,153,0.3)] text-center relative font-sans">
            <button 
              onClick={() => setShowCheckoutAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto mb-4">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Checkout Authentication</h3>
            <p className="text-xs text-slate-300 mt-2 font-mono leading-relaxed">
              Please sign in or create an account to authorize secure checkout.
            </p>
            <div className="space-y-3 mt-6">
              <button
                onClick={() => {
                  setShowCheckoutAuthModal(false);
                  setForgotStep('none');
                  setCurrentPage('login');
                }}
                className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 font-black tracking-wider uppercase text-xs transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowCheckoutAuthModal(false);
                  setCurrentPage('register');
                }}
                className="w-full py-3 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 text-slate-300 font-bold uppercase text-xs transition cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
