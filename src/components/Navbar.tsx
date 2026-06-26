import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, ShoppingBag, User, Bell, Menu, X, Sparkles, Flame, Eye, Trash2, Clock, TrendingUp, Check, Star, ShoppingCart } from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    cart,
    addToCart,
    wishlist,
    user,
    points,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    selectedCategory,
    setSelectedProductId
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const notifications = [
    { id: 1, text: "🔥 FLASH SALE: 25% OFF Lunar Tea Tree Cream!", unread: true },
    { id: 2, text: "✨ Daily Reward available! Spin the lucky wheel.", unread: true },
    { id: 3, text: "📦 Your order #AG-9081 has been delivered!", unread: false }
  ];

  const searchRef = useRef<HTMLDivElement>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('glow_recent_searches');
      return saved ? JSON.parse(saved) : ["Sakura Toner", "Hoodie", "Cica", "Oni Desk Lamp"];
    } catch {
      return ["Sakura Toner", "Hoodie", "Cica", "Oni Desk Lamp"];
    }
  });
  
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const TRENDING_SEARCHES = ["Sakura Dew", "Neon Oni Lamp", "Acne Patches", "Plush Kitsune", "Mochi Cream"];

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const next = [trimmed, ...prev.filter(q => q !== trimmed)].slice(0, 5);
      localStorage.setItem('glow_recent_searches', JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.setItem('glow_recent_searches', JSON.stringify([]));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchBox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
    }
    setSelectedCategory('all');
    setCurrentPage('shop');
    setShowSearchBox(false);
  };

  // Fuzzy search implementation matching Name, Anime Series, Character, Category, SubCategory, Description, Ingredients, SKU
  const getFuzzyMatches = (query: string): Product[] => {
    if (!query) return [];
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];

    const scoredProducts = PRODUCTS.map(product => {
      let score = 0;
      
      const id = (product.id || '').toLowerCase();
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const subCategory = (product.subCategory || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const ingredients = (product.ingredients || []).map(i => i.toLowerCase()).join(' ');

      // 1. Direct SKU (id) match
      if (id === cleanQuery) score += 200;
      else if (id.includes(cleanQuery)) score += 100;

      // 2. Name matches
      if (name === cleanQuery) score += 150;
      else if (name.startsWith(cleanQuery)) score += 100;
      else if (name.includes(cleanQuery)) score += 60;

      // 3. SubCategory/Category matches
      if (subCategory.includes(cleanQuery)) score += 40;
      if (category.includes(cleanQuery)) score += 25;

      // 4. Description match (handles character names and anime references)
      if (description.includes(cleanQuery)) score += 30;

      // 5. Ingredients matches
      if (ingredients.includes(cleanQuery)) score += 20;

      // 6. Split query terms matching (fuzzy spelling helper)
      const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 1);
      queryWords.forEach(word => {
        if (name.includes(word)) score += 25;
        if (description.includes(word)) score += 10;
        // Simple letter-containment ratio (jaccard-like overlap for small typos)
        if (word.length >= 4) {
          let matchesCount = 0;
          for (let i = 0; i < word.length; i++) {
            if (name.includes(word[i])) matchesCount++;
          }
          if (matchesCount / word.length > 0.8) {
            score += 15; // Typo correction score bonus
          }
        }
      });

      return { product, score };
    });

    return scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) 
            ? <span key={i} className="text-pink-400 font-extrabold underline decoration-pink-500/40 bg-pink-500/10 px-0.5 rounded">{part}</span> 
            : <span key={i}>{part}</span>
        )}
      </span>
    );
  };

  const suggestions = getFuzzyMatches(searchQuery);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'shop', label: 'SHOP ALL' },
    { id: 'skincare', label: 'SKINCARE' },
    { id: 'merch', label: 'ANIME MERCH' },
    { id: 'collections', label: 'COLLECTIONS' },
    { id: 'quiz', label: 'GLOW QUIZ' },
    { id: 'rewards', label: 'REWARDS & SPIN' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0715]/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex cursor-pointer items-center gap-2 group"
          id="nav-logo-container"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-pink-500 to-violet-600 shadow-lg shadow-pink-500/20">
            <span className="text-white font-extrabold text-sm tracking-tighter">AG</span>
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-tr from-pink-500 to-cyan-400 opacity-0 blur group-hover:opacity-100 transition duration-500"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 font-sans">
              ANIMEGLOW
            </span>
            <span className="text-[8px] font-mono tracking-widest text-cyan-400">NEO-TOKYO APOTHECARY</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6" id="nav-desktop-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'skincare') {
                  setSelectedCategory('skincare');
                  setCurrentPage('shop');
                } else if (item.id === 'merch') {
                  setSelectedCategory('merchandise');
                  setCurrentPage('shop');
                } else {
                  setCurrentPage(item.id);
                }
              }}
              className={`relative py-2 text-xs font-bold tracking-widest uppercase transition-colors hover:text-pink-400 ${
                (currentPage === item.id || 
                 (item.id === 'skincare' && currentPage === 'shop' && searchQuery === '' && selectedCategory === 'skincare') ||
                 (item.id === 'merch' && currentPage === 'shop' && searchQuery === '' && selectedCategory === 'merchandise')
                ) ? 'text-pink-500' : 'text-slate-300'
              }`}
              id={`nav-item-${item.id}`}
            >
              {item.label}
              {(currentPage === item.id) && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-pink-500 to-cyan-400 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-3 sm:gap-4" id="nav-action-icons">
          
          {/* Quick Search */}
          <div className="relative" ref={searchRef}>
            {showSearchBox ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-pink-500/60 rounded-full py-1.5 px-3.5 w-48 sm:w-72 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                  <input
                    type="text"
                    placeholder="Search name, anime, character..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 outline-none pr-1"
                    autoFocus
                  />
                  <button type="submit" className="text-pink-400 hover:text-pink-300 mr-1.5 transition">
                    <Search className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => { setShowSearchBox(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-200 transition">
                    <X className="h-3 w-3" />
                  </button>
                </form>

                {/* ADVANCED SUGGESTIONS DROPDOWN PANEL */}
                <div className="absolute right-0 top-full mt-3 w-[330px] sm:w-[480px] md:w-[560px] bg-[#0A0718] border border-pink-500/30 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-fade-in z-50 overflow-hidden font-sans">
                  
                  {/* Top Badges (Recent and Trending) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-white/5 pb-3.5 mb-3 text-left">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black flex items-center gap-1">
                          <Clock className="h-3 w-3 text-pink-400" /> Recent Searches
                        </span>
                        {recentSearches.length > 0 && (
                          <button 
                            type="button" 
                            onClick={clearRecentSearches} 
                            className="text-[9px] font-mono text-pink-400 hover:underline hover:text-pink-300"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {recentSearches.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSearchQuery(term)}
                              className="text-[10px] font-mono bg-slate-900 hover:bg-pink-500/15 border border-white/5 hover:border-pink-500/30 text-slate-300 px-2.5 py-1 rounded-md transition"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-600 block italic">No search history logs found.</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black flex items-center gap-1 mb-2">
                        <TrendingUp className="h-3 w-3 text-cyan-400" /> Trending Searches
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {TRENDING_SEARCHES.map((term, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSearchQuery(term)}
                            className="text-[10px] font-mono bg-slate-900 hover:bg-cyan-500/15 border border-white/5 hover:border-cyan-500/30 text-slate-300 px-2.5 py-1 rounded-md transition"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Results List Section */}
                  <div className="text-left">
                    {searchQuery.trim() ? (
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">
                            Search Suggestions ({suggestions.length})
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            Instant Real-Time Results
                          </span>
                        </div>

                        {suggestions.length > 0 ? (
                          <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            {suggestions.slice(0, 5).map((product) => {
                              const discPrice = product.price * (1 - product.discount / 100);
                              const isAdded = addedMap[product.id];
                              
                              return (
                                <div 
                                  key={product.id}
                                  onClick={() => {
                                    addRecentSearch(searchQuery);
                                    setSelectedProductId(product.id);
                                    setCurrentPage('details');
                                    setShowSearchBox(false);
                                  }}
                                  className="group flex items-center justify-between gap-3 p-2 bg-[#120D2C]/40 hover:bg-[#1A143D]/60 border border-white/5 hover:border-pink-500/30 rounded-xl transition-all duration-200 cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-lg overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover contrast-110 saturate-110" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-[11px] font-black text-slate-100 group-hover:text-pink-400 transition truncate uppercase max-w-[150px] sm:max-w-[220px]">
                                        {highlightText(product.name, searchQuery)}
                                      </h4>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[9px] font-mono font-bold text-pink-400 uppercase">
                                          {product.subCategory}
                                        </span>
                                        <div className="flex items-center gap-0.5 text-yellow-400">
                                          <Star className="h-2.5 w-2.5 fill-current" />
                                          <span className="text-[9px] text-slate-300 font-bold">{product.rating}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <div className="text-right flex flex-col font-mono">
                                      {product.discount > 0 ? (
                                        <>
                                          <span className="text-[11px] font-bold text-cyan-400">${discPrice.toFixed(2)}</span>
                                          <span className="text-[8px] text-slate-500 line-through">${product.price.toFixed(2)}</span>
                                        </>
                                      ) : (
                                        <span className="text-[11px] font-bold text-cyan-400">${product.price.toFixed(2)}</span>
                                      )}
                                      <span className={`text-[8px] font-bold uppercase mt-0.5 ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      disabled={product.stock <= 0}
                                      onClick={(e) => {
                                        addToCart(product, product.variants[0], 1);
                                        setAddedMap(prev => ({ ...prev, [product.id]: true }));
                                        setTimeout(() => {
                                          setAddedMap(prev => ({ ...prev, [product.id]: false }));
                                        }, 2000);
                                      }}
                                      className={`p-2 rounded-lg transition-all duration-200 ${
                                        isAdded 
                                          ? 'bg-emerald-500 text-slate-950 scale-105'
                                          : 'bg-pink-500 text-slate-950 hover:bg-pink-600 disabled:bg-slate-800 disabled:text-slate-500'
                                      }`}
                                    >
                                      {isAdded ? <Check className="h-3 w-3" /> : <ShoppingCart className="h-3 w-3" />}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-6 text-center border border-white/5 bg-[#120D2C]/20 rounded-xl">
                            <span className="text-2xl block mb-1">🤖</span>
                            <span className="text-[11px] font-mono text-slate-400 block font-bold uppercase tracking-wider text-center">No matching codes found (T_T)</span>
                            <span className="text-[10px] font-mono text-slate-500 block mt-1 text-center">Try another keyword or search term.</span>
                            
                            {/* RECOMMENDED BEST SELLERS AS ALTERNATIVES */}
                            <div className="mt-4 border-t border-white/5 pt-3 px-3">
                              <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest block mb-2 font-black text-left">Highly Rated Recommendations:</span>
                              <div className="grid grid-cols-2 gap-2">
                                {PRODUCTS.filter(p => p.isBestSeller).slice(0, 2).map(p => (
                                  <div 
                                    key={p.id}
                                    onClick={() => {
                                      setSelectedProductId(p.id);
                                      setCurrentPage('details');
                                      setShowSearchBox(false);
                                    }}
                                    className="flex items-center gap-2 p-1.5 bg-[#1A143D]/20 hover:bg-[#1A143D]/40 rounded-lg cursor-pointer transition border border-white/5 hover:border-pink-500/20"
                                  >
                                    <img src={p.images[0]} alt={p.name} className="h-7 w-7 rounded object-cover" />
                                    <div className="min-w-0 text-left">
                                      <p className="text-[9px] font-bold text-slate-200 truncate uppercase">{p.name}</p>
                                      <p className="text-[8px] font-mono text-cyan-400 font-bold">${p.price.toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-6 text-center border border-white/5 bg-[#120D2C]/20 rounded-xl">
                        <span className="text-xl block mb-1">🔍</span>
                        <span className="text-[11px] font-mono text-slate-400 block font-black uppercase tracking-widest text-center">Awaiting Command Node</span>
                        <span className="text-[9px] font-mono text-slate-500 block mt-0.5 text-center">Type to query full Neo-Tokyo catalog archives.</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              <button 
                onClick={() => setShowSearchBox(true)}
                className="rounded-full p-2 text-slate-300 hover:bg-slate-900 hover:text-pink-400 transition"
                title="Search"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>

          {/* Points display */}
          {user && (
            <div 
              onClick={() => setCurrentPage('user')}
              className="hidden md:flex cursor-pointer items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 font-mono text-[10px] font-bold text-yellow-400 hover:bg-yellow-500/20 transition"
              title="Glow Points Balance"
            >
              <Sparkles className="h-3 w-3 animate-spin" />
              <span>{points} GP</span>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-full p-2 text-slate-300 hover:bg-slate-900 hover:text-pink-400 transition"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 animate-ping"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-purple-500/30 bg-slate-950 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">System Intel</h4>
                  <span className="text-[9px] text-pink-400 font-bold uppercase cursor-pointer">Mark read</span>
                </div>
                <div className="space-y-3">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.id === 1) {
                          setSelectedCategory('skincare');
                          setCurrentPage('shop');
                        } else if (n.id === 2) {
                          setCurrentPage('rewards');
                        } else if (n.id === 3) {
                          setCurrentPage('user');
                        }
                      }}
                      className={`text-[11px] p-2 rounded cursor-pointer transition ${n.unread ? 'bg-purple-950/30 border-l-2 border-pink-500 text-slate-100' : 'bg-slate-900/40 text-slate-400'}`}
                    >
                      {n.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <button 
            onClick={() => setCurrentPage('wishlist')}
            className="relative rounded-full p-2 text-slate-300 hover:bg-slate-900 hover:text-pink-400 transition"
            title="Wishlist"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[8px] font-black text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Link */}
          <button 
            onClick={() => setCurrentPage('cart')}
            className="relative rounded-full p-2 text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition"
            title="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[8px] font-black text-slate-950">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <button 
            onClick={() => setCurrentPage(user ? 'user' : 'login')}
            className="rounded-full p-2 text-slate-300 hover:bg-slate-900 hover:text-pink-400 transition flex items-center justify-center"
            title={user ? 'Profile' : 'Log In'}
          >
            {user ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500/20 text-xs border border-pink-500/40 font-bold">
                {user.avatar}
              </div>
            ) : (
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-2 text-slate-300 hover:bg-slate-900 lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-purple-500/20 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'skincare') {
                  setSelectedCategory('skincare');
                  setCurrentPage('shop');
                } else if (item.id === 'merch') {
                  setSelectedCategory('merchandise');
                  setCurrentPage('shop');
                } else {
                  setCurrentPage(item.id);
                }
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 text-sm font-bold uppercase tracking-widest ${
                currentPage === item.id ? 'text-pink-400 bg-pink-500/10 rounded-lg' : 'text-slate-300 hover:text-pink-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {user && (
            <div className="border-t border-slate-900 pt-3 flex items-center justify-between px-3">
              <span className="text-xs text-slate-400 font-mono">Glow Level: {user.level}</span>
              <div className="flex items-center gap-1 rounded bg-yellow-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-yellow-400">
                <Sparkles className="h-3 w-3" />
                <span>{points} GP</span>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
