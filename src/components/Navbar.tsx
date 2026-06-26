import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Heart, ShoppingBag, User, Bell, Menu, X, Sparkles, Flame, Eye } from 'lucide-react';

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    cart,
    wishlist,
    user,
    points,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    selectedCategory
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory('all');
    setCurrentPage('shop');
    setShowSearchBox(false);
  };

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
          <div className="relative">
            {showSearchBox ? (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-slate-900 border border-pink-500/40 rounded-full py-1 px-3 w-48 sm:w-64 animate-slide-in">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 outline-none"
                  autoFocus
                />
                <button type="submit" className="text-pink-400 hover:text-pink-300">
                  <Search className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setShowSearchBox(false)} className="text-slate-400 ml-1">
                  <X className="h-3 w-3" />
                </button>
              </form>
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
