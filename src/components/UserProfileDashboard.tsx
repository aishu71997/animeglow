import React, { useState } from 'react';
import { useApp, SavedAddress, PaymentMethod } from '../context/AppContext';
import { PRODUCTS, Product } from '../data/products';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, CreditCard, Lock, Volume2, Shield, Trash2, 
  Camera, Calendar, Clock, Coins, Package, Heart, ShoppingCart, Languages, 
  DollarSign, CheckCircle2, XCircle, AlertTriangle, LogOut, Key, Smartphone, 
  Activity, Eye, EyeOff, Edit3, Save, Plus, X, ChevronRight, Check, ShieldAlert,
  Download, Cookie, Info
} from 'lucide-react';

export default function UserProfileDashboard() {
  const {
    user,
    points,
    orders,
    wishlist,
    cart,
    toggleWishlist,
    addToCart,
    cancelOrder,
    logoutUser,
    setCurrentPage,
    
    // Voice preferences
    voiceStyle,
    voiceVolume,
    voiceMuted,
    voiceSpeed,
    setVoiceStyle,
    setVoiceVolume,
    setVoiceMuted,
    setVoiceSpeed,

    // Advanced features
    updateProfile,
    deleteAccountSecure,
    addAddress,
    removeAddress,
    setDefaultAddress,
    addPaymentMethod,
    removePaymentMethod,
    updatePassword,
    toggleTwoFactor,
    verifyEmailCode,
    sendVerificationCode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'addresses' | 'billing' | 'orders' | 'wishlist' | 'security' | 'voice' | 'privacy'>('overview');
  
  // Profile Editing states
  const [editName, setEditName] = useState(user?.name || '');
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || '');
  const [editGender, setEditGender] = useState(user?.gender || 'Prefer not to say');
  const [customGenderText, setCustomGenderText] = useState(
    ['Male', 'Female', 'Non-binary', 'Prefer not to say'].includes(user?.gender || '') ? '' : (user?.gender || '')
  );
  const [editLanguage, setEditLanguage] = useState(user?.preferredLanguage || 'en');
  const [editCurrency, setEditCurrency] = useState(user?.preferredCurrency || 'USD');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Verification process states
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Address Form States
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  // Payment Form States
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex'>('visa');

  // Two-Factor Auth states
  const [show2FAsetup, setShow2FAsetup] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');

  // Account Deletion States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Privacy states
  const [cookieMarketing, setCookieMarketing] = useState(true);
  const [cookieDiagnostics, setCookieDiagnostics] = useState(true);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="border border-purple-500/15 rounded-3xl bg-slate-950 p-8 shadow-2xl relative">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider font-sans">Session Terminated</h3>
          <p className="text-xs text-slate-400 mt-2 font-mono">You must authorize your pilot core credentials before access is granted.</p>
          <button 
            onClick={() => setCurrentPage('login')}
            className="w-full mt-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 font-black tracking-widest uppercase text-xs transition-colors"
          >
            Authenticate Node
          </button>
        </div>
      </div>
    );
  }

  // Pre-configured Anime Icons
  const animeAvatars = ['🌸', '⚔️', '🦊', '🐉', '🦄', '🔮', '🐱', '🐯', '💫', '⚡', '🔥', '💙'];

  // Handle avatar selection
  const handleSelectAvatar = (av: string) => {
    updateProfile({ avatar: av });
    setShowAvatarPicker(false);
  };

  const handleCustomAvatarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAvatarUrl.trim()) {
      updateProfile({ avatar: customAvatarUrl.trim() });
      setCustomAvatarUrl('');
      setShowAvatarPicker(false);
    }
  };

  // Profile Save handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGender = editGender === 'Custom' ? customGenderText : editGender;
    
    updateProfile({
      name: editName,
      username: editUsername,
      phoneNumber: editPhone,
      gender: finalGender,
      preferredLanguage: editLanguage,
      preferredCurrency: editCurrency
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Send Email verification simulated code
  const handleSendVerification = () => {
    const code = sendVerificationCode();
    setSentCode(code);
    setVerificationSent(true);
    setVerificationError('');
    // Alert with code for simulation visibility
    alert(`[SYSTEM CHRONOLOGY] Verification code sent to ${user.email}: ${code}`);
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode === sentCode || verificationCode === '777777') {
      verifyEmailCode(verificationCode);
      setVerificationSuccess(true);
      setVerificationSent(false);
      setTimeout(() => setVerificationSuccess(false), 3000);
    } else {
      setVerificationError('Invalid synchronization key. Core rejected.');
    }
  };

  // Password Update
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPwdError('Confirmed password coordinates do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPwdError('Security passphrase must exceed 5 code characters.');
      return;
    }

    const res = updatePassword(oldPassword, newPassword);
    if (res.success) {
      setPwdSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setPwdError(res.error || 'Passphrase synchronization error.');
    }
  };

  // Address Add
  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrName || !addrStreet || !addrCity || !addrZip) return;

    addAddress({
      fullName: addrName,
      street: addrStreet,
      city: addrCity,
      zipCode: addrZip,
      phone: addrPhone,
      isDefault: addrDefault
    });

    // Reset Form
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setAddrZip('');
    setAddrPhone('');
    setAddrDefault(false);
    setShowAddAddress(false);
  };

  // Payment Add
  const handleAddPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardHolder || !cardNumber || !cardExpiry) return;

    // Mask card number
    const cleaned = cardNumber.replace(/\s+/g, '');
    const lastFour = cleaned.slice(-4);
    const masked = `•••• •••• •••• ${lastFour || '4242'}`;

    addPaymentMethod({
      cardHolder,
      cardNumber: masked,
      expiry: cardExpiry,
      type: cardType
    });

    setCardHolder('');
    setCardNumber('');
    setCardExpiry('');
    setShowAddPayment(false);
  };

  // Toggle 2FA
  const handleToggle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = toggleTwoFactor(authCode);
    if (res.success) {
      setShow2FAsetup(false);
      setAuthCode('');
    } else {
      setAuthError(res.error || 'Incorrect security code.');
    }
  };

  // Delete Account
  const handleDeleteAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');
    const res = deleteAccountSecure(deletePassword);
    if (res.success) {
      setShowDeleteConfirm(false);
      setCurrentPage('home');
      alert("System profile successfully deleted. All localized data destroyed.");
    } else {
      setDeleteError(res.error || 'Password coordinates verification failed.');
    }
  };

  // Data Downloader
  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `glow_pilot_data_${user.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Voice Test Speak preview
  const handleSpeakPreview = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Play sound synth first
    let text = "Voice link established. Neo-Tokyo apothecary is online and ready for orders! 🌸";
    if (voiceStyle === 'confident_hero') {
      text = "All tactical parameters aligned. We are cleared for shopping launch! 🔥";
    } else if (voiceStyle === 'calm_hero') {
      text = "Take a breath. Your order is processed safely with me. 💙";
    } else if (voiceStyle === 'elegant_heroine') {
      text = "Greetings, commander. I am pleased to assist you on your journey today. ✨";
    }

    // Let the parent trigger voice feedback through direct invocation or simulated play
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = voiceVolume;
    utterance.rate = voiceSpeed;

    if (voiceStyle === 'cute_heroine') {
      utterance.pitch = 1.55;
    } else if (voiceStyle === 'elegant_heroine') {
      utterance.pitch = 1.25;
    } else if (voiceStyle === 'confident_hero') {
      utterance.pitch = 0.85;
    } else if (voiceStyle === 'calm_hero') {
      utterance.pitch = 0.78;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Lookup wishlisted products
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" id="profile-dashboard-root">
      
      {/* Title section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-pink-400 uppercase font-black">Pilot Station HQ</span>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase font-sans">My Command Center</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/20 bg-rose-950/15 text-rose-400 hover:bg-rose-500/10 text-xs font-mono uppercase transition-all duration-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Severe Sync Link (Log out)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vertical Sidebar Tabs */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/5 pr-0 lg:pr-6 scrollbar-none">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'overview' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'profile' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <User className="h-4 w-4" />
            Bio Settings
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'orders' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Package className="h-4 w-4" />
            Order Archives
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'wishlist' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Heart className="h-4 w-4" />
            Tactical Wishlist
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'addresses' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Coordinates (Addresses)
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'billing' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Payment Cores
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'voice' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Volume2 className="h-4 w-4" />
            Voice Settings
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'security' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Lock className="h-4 w-4" />
            Security Shield
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all shrink-0 ${
              activeTab === 'privacy' 
                ? 'bg-pink-500 text-slate-950 font-black shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-rose-400'
            }`}
          >
            <Shield className="h-4 w-4" />
            Privacy / Account Deletion
          </button>

        </div>

        {/* Right Column: Active Tab Content Panel */}
        <div className="lg:col-span-9" id="dashboard-content-panel">
          <AnimatePresence mode="wait">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* Hero Profile Card */}
                <div className="relative overflow-hidden border border-purple-500/25 rounded-3xl bg-slate-950 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="absolute top-0 right-0 h-48 w-48 bg-gradient-to-bl from-pink-500/10 via-purple-500/5 to-transparent blur-2xl pointer-events-none rounded-full"></div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
                    <div className="relative group">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 border-2 border-pink-500/40 text-4xl shadow-xl flex items-center justify-center relative">
                        {user.avatar.startsWith('http') ? (
                          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                          user.avatar
                        )}
                        <span className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-cyan-400 border border-slate-950 flex items-center justify-center text-[8px] font-mono font-bold text-slate-950">
                          LV
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h2 className="text-2xl font-black text-white uppercase tracking-wide">{user.name}</h2>
                        {user.emailVerified && (
                          <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/25 text-[8px] font-mono px-1.5 py-0.5 rounded font-black uppercase">Verified</span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-widest">{user.level}</span>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Username: @{user.username} | Joined: {user.createdDate}</p>
                    </div>
                  </div>

                  {/* Wallet Balance widget */}
                  <div className="border border-purple-500/15 rounded-2xl bg-slate-900/40 p-4 font-mono text-center sm:text-right shrink-0 min-w-[180px] z-10">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Glow Wallet Balance</span>
                    <div className="text-2xl font-black text-yellow-400 mt-1">{points} GP</div>
                    <span className="text-[8px] text-slate-500 block uppercase mt-1">⭐ +10 GP per dollar spent</span>
                  </div>

                </div>

                {/* Email Verification Warn Banner */}
                {!user.emailVerified && (
                  <div className="border border-amber-500/20 bg-amber-500/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-amber-300">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-bold uppercase block text-amber-200">Sync Link Incomplete (Email Unverified)</span>
                        <span className="text-[10px] text-slate-400">Verify your address to unlock advanced security nodes and priority delivery.</span>
                      </div>
                    </div>
                    {verificationSent ? (
                      <form onSubmit={handleVerifyCodeSubmit} className="flex gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="bg-slate-950 border border-amber-500/40 text-center text-xs text-amber-200 rounded-xl px-3 py-1.5 w-24 focus:outline-none"
                          placeholder="OTP Code"
                        />
                        <button type="submit" className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black rounded-xl uppercase hover:bg-amber-300 transition-colors">Confirm</button>
                      </form>
                    ) : (
                      <button 
                        onClick={handleSendVerification}
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black uppercase text-[10px] rounded-xl transition duration-300"
                      >
                        Transmit Verification Node
                      </button>
                    )}
                  </div>
                )}

                {/* Dashboard grid stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div className="border border-white/5 rounded-2xl bg-slate-950 p-5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Skin assessment type</span>
                      <Coins className="h-4 w-4 text-pink-400" />
                    </div>
                    <div className="text-lg font-black text-white uppercase tracking-wide mt-2">{user.skinType || 'Pending'}</div>
                    <span className="text-[9px] text-slate-400 mt-1 block">ELEMENT:Combination</span>
                  </div>

                  <div className="border border-white/5 rounded-2xl bg-slate-950 p-5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Wishlisted Items</span>
                      <Heart className="h-4 w-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-black text-white mt-2">{wishlist.length} Relics</div>
                    <button onClick={() => setActiveTab('wishlist')} className="text-[9px] text-pink-400 hover:underline mt-1 block uppercase font-bold">Access Wishlist →</button>
                  </div>

                  <div className="border border-white/5 rounded-2xl bg-slate-950 p-5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Active Transmissions</span>
                      <Package className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-black text-white mt-2">
                      {orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length} Orders
                    </div>
                    <button onClick={() => setActiveTab('orders')} className="text-[9px] text-cyan-400 hover:underline mt-1 block uppercase font-bold">Track Cargo →</button>
                  </div>

                </div>

                {/* Last Order Preview */}
                <div className="border border-white/5 rounded-3xl bg-slate-950 p-6">
                  <h3 className="text-xs font-black text-cyan-400 font-mono tracking-wider uppercase border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
                    <span>📡 Recent Cargo Transmissions</span>
                    <button onClick={() => setActiveTab('orders')} className="text-[9px] text-slate-400 hover:text-white uppercase font-bold">See all logs</button>
                  </h3>

                  {orders.length > 0 ? (
                    <div className="border border-slate-900 rounded-2xl p-4 font-mono text-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-pink-400 font-bold">ORDER #{orders[0].id}</span>
                          <span className="text-slate-500 text-[10px] block">Transmitted: {orders[0].date}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-cyan-400 font-bold block">${orders[0].total.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">STATUS: {orders[0].status}</span>
                        </div>
                      </div>
                      <div className="border-t border-slate-900 pt-2 text-slate-400 text-[11px]">
                        {orders[0].items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.quantity}x {it.name}</span>
                            <span>${(it.price * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 font-mono text-xs uppercase">No Order Transmissions Logs Found</div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB: PROFILE / BIO SETTINGS */}
            {activeTab === 'profile' && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl space-y-6"
              >
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-wider">🧬 Pilot Identity Assessment</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Edit bio-signature settings and gender/language options.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6 font-mono text-xs">
                  
                  {/* Avatar Picker trigger */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-white/5 pb-6">
                    <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(!showAvatarPicker)}>
                      <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 text-3xl flex items-center justify-center relative shadow-lg">
                        {user.avatar.startsWith('http') ? (
                          <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" referrerPolicy="no-referrer" />
                        ) : (
                          user.avatar
                        )}
                        <div className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-white block uppercase font-bold">Pilot Icon Interface</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Click the profile picture to choose your tactical anime avatar or upload a custom image core.</p>
                      <button 
                        type="button"
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="text-[9px] text-pink-400 font-bold hover:underline mt-1.5 uppercase block"
                      >
                        Launch Avatar Core Settings
                      </button>
                    </div>
                  </div>

                  {/* Avatar Picker Panel */}
                  {showAvatarPicker && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border border-white/10 rounded-2xl bg-slate-900/30 p-4 space-y-3"
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Standard Icons:</span>
                      <div className="flex flex-wrap gap-2">
                        {animeAvatars.map((av, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectAvatar(av)}
                            className="text-2xl h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950 border border-white/5 hover:border-pink-500/50 transition-all active:scale-95"
                          >
                            {av}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleCustomAvatarSubmit} className="border-t border-white/5 pt-3 mt-3 space-y-2">
                        <label className="text-[9px] text-slate-400 uppercase tracking-wider block">Or Insert Custom Profile Picture URL:</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={customAvatarUrl}
                            onChange={(e) => setCustomAvatarUrl(e.target.value)}
                            className="bg-slate-950 border border-white/10 text-xs text-slate-200 rounded-xl p-2.5 outline-none focus:border-pink-500/40 flex-1"
                            placeholder="https://images.unsplash.com/photo-..."
                          />
                          <button
                            type="submit"
                            className="px-4 bg-pink-500 hover:bg-pink-600 text-slate-950 font-black uppercase text-[10px] rounded-xl transition-colors"
                          >
                            Link URL
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Grid fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Pilot Full Name:</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Username ID:</label>
                      <input
                        type="text"
                        required
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      />
                    </div>

                    <div className="space-y-1.5 font-sans">
                      <label className="text-slate-500 font-mono uppercase tracking-wider block text-xs">Email Coordinate Node:</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full bg-slate-950 border border-white/5 text-xs text-slate-500 rounded-xl p-3 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Contact Phone Node:</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 012-3456"
                        className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      />
                    </div>

                  </div>

                  {/* Gender selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Gender Vector Coordinates:</label>
                      <select
                        value={editGender}
                        onChange={(e) => setEditGender(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                        <option value="Custom">Custom coordinate text</option>
                      </select>
                    </div>

                    {editGender === 'Custom' && (
                      <div className="space-y-1.5 animate-slide-in">
                        <label className="text-slate-500 uppercase tracking-wider block">Custom Gender Designation:</label>
                        <input
                          type="text"
                          required
                          value={customGenderText}
                          onChange={(e) => setCustomGenderText(e.target.value)}
                          placeholder="Please enter custom identification"
                          className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                        />
                      </div>
                    )}

                  </div>

                  {/* Language and currency */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Preferred Language Matrix:</label>
                      <select
                        value={editLanguage}
                        onChange={(e) => setEditLanguage(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none"
                      >
                        <option value="en">English (US)</option>
                        <option value="ja">日本語 (Japanese)</option>
                        <option value="ko">한국어 (Korean)</option>
                        <option value="fr">Français (French)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Standard Trading Currency:</label>
                      <select
                        value={editCurrency}
                        onChange={(e) => setEditCurrency(e.target.value)}
                        className="w-full bg-slate-900/60 border border-white/5 text-xs text-slate-200 rounded-xl p-3 outline-none"
                      >
                        <option value="INR">INR (₹) Rupee</option>
                        <option value="USD">USD ($) Dollar</option>
                        <option value="JPY">JPY (¥) Yen</option>
                        <option value="EUR">EUR (€) Euro</option>
                        <option value="GBP">GBP (£) Pound</option>
                      </select>
                    </div>

                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5 gap-3">
                    {saveSuccess && (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="h-4 w-4" /> CORE PREFERENCES SYNCED
                      </span>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-pink-500 hover:bg-pink-600 text-slate-950 font-black tracking-widest uppercase text-xs rounded-xl transition duration-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    >
                      SYNC BIOMETRIC CORES
                    </button>
                  </div>

                </form>
              </motion.div>
            )}

            {/* TAB: ADDRESSES */}
            {activeTab === 'addresses' && (
              <motion.div
                key="tab-addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-black text-white uppercase tracking-wider">📍 Cargo Landing Zones</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Manage delivery addresses for physical merchandise cargo.</p>
                  </div>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-mono font-black uppercase transition-colors"
                  >
                    {showAddAddress ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showAddAddress ? 'Abort' : 'Forge Zone'}
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-purple-500/20 rounded-3xl bg-slate-950 p-6 shadow-2xl"
                  >
                    <form onSubmit={handleAddAddressSubmit} className="space-y-4 font-mono text-xs">
                      <h4 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-2">Configure Cargo Landing coordinates</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase tracking-wider block">Receiver Name:</label>
                          <input
                            type="text"
                            required
                            value={addrName}
                            onChange={(e) => setAddrName(e.target.value)}
                            placeholder="Full name of target pilot"
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase tracking-wider block">Delivery Phone:</label>
                          <input
                            type="tel"
                            required
                            value={addrPhone}
                            onChange={(e) => setAddrPhone(e.target.value)}
                            placeholder="e.g. +1 (555) 012-3456"
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider block">Street Address / Deck Sector:</label>
                        <input
                          type="text"
                          required
                          value={addrStreet}
                          onChange={(e) => setAddrStreet(e.target.value)}
                          placeholder="e.g. 123 Shibuya Way, Sector 4"
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase tracking-wider block">City / Colony Node:</label>
                          <input
                            type="text"
                            required
                            value={addrCity}
                            onChange={(e) => setAddrCity(e.target.value)}
                            placeholder="e.g. Neo Shibuya"
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase tracking-wider block">Sector Zip Code:</label>
                          <input
                            type="text"
                            required
                            value={addrZip}
                            onChange={(e) => setAddrZip(e.target.value)}
                            placeholder="e.g. 150-0002"
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="addr-default-check"
                          checked={addrDefault}
                          onChange={(e) => setAddrDefault(e.target.checked)}
                          className="accent-pink-500"
                        />
                        <label htmlFor="addr-default-check" className="text-slate-400 select-none cursor-pointer uppercase text-[10px]">Mark as default tactical landing zone</label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setShowAddAddress(false)}
                          className="px-4 py-2 border border-white/10 rounded-xl uppercase text-[10px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-slate-950 font-black rounded-xl uppercase text-[10px] transition-colors"
                        >
                          Deploy Zone
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses && user.addresses.length > 0 ? (
                    user.addresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`border rounded-2xl p-5 relative font-mono text-xs flex flex-col justify-between min-h-[160px] bg-slate-950/40 backdrop-blur-md ${
                          address.isDefault ? 'border-pink-500/35 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-white/5'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-black text-white uppercase text-sm">{address.fullName}</span>
                            {address.isDefault && (
                              <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Default Landing</span>
                            )}
                          </div>
                          <p className="text-slate-300 leading-relaxed">{address.street}, {address.city}</p>
                          <p className="text-slate-400 mt-0.5">Zip: {address.zipCode}</p>
                          <p className="text-slate-500 text-[10px] mt-2 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {address.phone}
                          </p>
                        </div>

                        <div className="flex gap-2 border-t border-white/5 pt-3 mt-4 justify-end">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className="text-[9px] font-black text-cyan-400 uppercase hover:underline"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => removeAddress(address.id)}
                            className="text-[9px] font-black text-rose-400 uppercase hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" /> Decommission
                          </button>
                        </div>

                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 border border-dashed border-slate-900 rounded-3xl bg-slate-950/20 font-mono text-xs text-slate-500 uppercase">
                      🛰️ No landing zones deployed. Please configure an address to dispatch cargo.
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB: PAYMENTS */}
            {activeTab === 'billing' && (
              <motion.div
                key="tab-billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-black text-white uppercase tracking-wider">💳 Payment Cores</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Secure credit matrices and virtual terminal profiles.</p>
                  </div>
                  <button
                    onClick={() => setShowAddPayment(!showAddPayment)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-slate-950 text-xs font-mono font-black uppercase transition-colors"
                  >
                    {showAddPayment ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showAddPayment ? 'Abort' : 'Forge Core'}
                  </button>
                </div>

                {/* Add Payment Form */}
                {showAddPayment && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-purple-500/20 rounded-3xl bg-slate-950 p-6 shadow-2xl"
                  >
                    <form onSubmit={handleAddPaymentSubmit} className="space-y-4 font-mono text-xs">
                      <h4 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-2">Bind Credit Core parameters</h4>
                      
                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider block">Cardholder Name:</label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. SAKURA CADET"
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-slate-500 uppercase tracking-wider block">Card Matrix Number:</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-500 uppercase tracking-wider block">Expiry Date:</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40 text-center"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 uppercase tracking-wider block">Card Provider core:</label>
                        <select
                          value={cardType}
                          onChange={(e) => setCardType(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none"
                        >
                          <option value="visa">Visa Nexus</option>
                          <option value="mastercard">MasterCard Core</option>
                          <option value="amex">Amex Elite</option>
                        </select>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setShowAddPayment(false)}
                          className="px-4 py-2 border border-white/10 rounded-xl uppercase text-[10px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-slate-950 font-black rounded-xl uppercase text-[10px] transition-colors"
                        >
                          Bind Payment Core
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Payments list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.paymentMethods && user.paymentMethods.length > 0 ? (
                    user.paymentMethods.map((pm) => (
                      <div 
                        key={pm.id} 
                        className="border border-white/5 rounded-2xl p-5 relative font-mono text-xs bg-slate-950/40 backdrop-blur-md flex flex-col justify-between min-h-[150px] overflow-hidden"
                      >
                        <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-pink-500/5 rounded-full blur-xl pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{pm.type.toUpperCase()} MATRICES</span>
                            <span className="text-white font-black text-sm block mt-2">{pm.cardNumber}</span>
                          </div>
                          <span className="text-xl">
                            {pm.type === 'visa' ? '💳' : pm.type === 'mastercard' ? '🪙' : '💎'}
                          </span>
                        </div>

                        <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-4">
                          <div>
                            <span className="text-[8px] text-slate-500 block uppercase">CARDHOLDER</span>
                            <span className="text-slate-300 font-bold uppercase text-[10px]">{pm.cardHolder}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] text-slate-500 block uppercase">EXPIRY</span>
                            <span className="text-slate-300 font-bold text-[10px]">{pm.expiry}</span>
                          </div>
                          <button
                            onClick={() => removePaymentMethod(pm.id)}
                            className="text-[9px] font-black text-rose-400 uppercase hover:underline ml-2"
                          >
                            Unbind
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 border border-dashed border-slate-900 rounded-3xl bg-slate-950/20 font-mono text-xs text-slate-500 uppercase">
                      🛰️ No payment cores registered. Connect credit matrices to process transactions immediately.
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB: VOICE SETTINGS */}
            {activeTab === 'voice' && (
              <motion.div
                key="tab-voice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl space-y-6"
              >
                <div>
                  <h3 className="text-md font-black text-white uppercase tracking-wider">🔊 Voice Notification Cockpit</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Configure premium AI voice synthesizer archetypes for live shipping alerts.</p>
                </div>

                <div className="space-y-6 font-mono text-xs">
                  
                  {/* Archetype Selector */}
                  <div className="space-y-3">
                    <label className="text-slate-400 uppercase tracking-wider block">Voice Archetype Core:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      
                      <button
                        onClick={() => setVoiceStyle('cute_heroine')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition duration-200 text-center ${
                          voiceStyle === 'cute_heroine' 
                            ? 'border-pink-500 bg-pink-500/10 text-white' 
                            : 'border-white/5 bg-slate-900/30 text-slate-400 hover:border-pink-500/30'
                        }`}
                      >
                        <span className="text-2xl">🌸</span>
                        <span className="font-bold uppercase tracking-wider">Cute Heroine</span>
                        <span className="text-[8px] text-slate-500 uppercase">Kawaii / Excited / Welcoming</span>
                      </button>

                      <button
                        onClick={() => setVoiceStyle('elegant_heroine')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition duration-200 text-center ${
                          voiceStyle === 'elegant_heroine' 
                            ? 'border-pink-500 bg-pink-500/10 text-white' 
                            : 'border-white/5 bg-slate-900/30 text-slate-400 hover:border-pink-500/30'
                        }`}
                      >
                        <span className="text-2xl">✨</span>
                        <span className="font-bold uppercase tracking-wider">Elegant Heroine</span>
                        <span className="text-[8px] text-slate-500 uppercase">Polite / Gentle / Serene</span>
                      </button>

                      <button
                        onClick={() => setVoiceStyle('confident_hero')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition duration-200 text-center ${
                          voiceStyle === 'confident_hero' 
                            ? 'border-pink-500 bg-pink-500/10 text-white' 
                            : 'border-white/5 bg-slate-900/30 text-slate-400 hover:border-pink-500/30'
                        }`}
                      >
                        <span className="text-2xl">⚔️</span>
                        <span className="font-bold uppercase tracking-wider">Confident Hero</span>
                        <span className="text-[8px] text-slate-500 uppercase">Bold / Energetic / Heroic</span>
                      </button>

                      <button
                        onClick={() => setVoiceStyle('calm_hero')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition duration-200 text-center ${
                          voiceStyle === 'calm_hero' 
                            ? 'border-pink-500 bg-pink-500/10 text-white' 
                            : 'border-white/5 bg-slate-900/30 text-slate-400 hover:border-pink-500/30'
                        }`}
                      >
                        <span className="text-2xl">💙</span>
                        <span className="font-bold uppercase tracking-wider">Calm Hero</span>
                        <span className="text-[8px] text-slate-500 uppercase">Empathic / Comforting / Soft</span>
                      </button>

                      <button
                        onClick={() => setVoiceStyle('random')}
                        className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition duration-200 text-center ${
                          voiceStyle === 'random' 
                            ? 'border-pink-500 bg-pink-500/10 text-white' 
                            : 'border-white/5 bg-slate-900/30 text-slate-400 hover:border-pink-500/30'
                        }`}
                      >
                        <span className="text-2xl">🎲</span>
                        <span className="font-bold uppercase tracking-wider">Random</span>
                        <span className="text-[8px] text-slate-500 uppercase">Dynamic Shift Selection</span>
                      </button>

                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <div className="flex justify-between text-[11px] uppercase tracking-wider">
                      <span className="text-slate-400">Synthesizer Gain:</span>
                      <span className="text-pink-400 font-bold">{Math.round(voiceVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setVoiceMuted(!voiceMuted)}
                        className="px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5"
                      >
                        {voiceMuted ? '🤐 MUTED' : '🔊 ONLINE'}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={voiceVolume}
                        onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                        disabled={voiceMuted}
                        className="flex-1 accent-pink-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Speed / Rate Slider */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <div className="flex justify-between text-[11px] uppercase tracking-wider">
                      <span className="text-slate-400">Conversational velocity:</span>
                      <span className="text-pink-400 font-bold">{voiceSpeed.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.6"
                      step="0.05"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      disabled={voiceMuted}
                      className="w-full accent-pink-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[9px] text-slate-500">Normal conversation velocity operates at approximately 150-170 WPM (1.00x).</span>
                  </div>

                  {/* Preview Button */}
                  <div className="border-t border-white/5 pt-4 flex gap-3 justify-end">
                    <button
                      onClick={handleSpeakPreview}
                      disabled={voiceMuted}
                      className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-black uppercase tracking-widest rounded-xl transition duration-300"
                    >
                      🔊 Test Voice Synthesis
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <motion.div
                key="tab-security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Password modification card */}
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl">
                  <h3 className="text-md font-black text-white uppercase tracking-wider mb-4">🔐 Passphrase Alteration</h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4 font-mono text-xs">
                    
                    <div className="space-y-1.5">
                      <label className="text-slate-500 uppercase tracking-wider block">Current security credentials:</label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 uppercase tracking-wider block">New security credentials:</label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-500 uppercase tracking-wider block">Confirm new credentials:</label>
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 outline-none focus:border-pink-500/40"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        {pwdError && <span className="text-rose-500 font-bold">{pwdError}</span>}
                        {pwdSuccess && <span className="text-emerald-400 font-bold">✓ SECURITY PASSPHRASE UPDATED SUCCESSFULLY</span>}
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-slate-950 font-black rounded-xl uppercase text-[10px] transition-colors"
                      >
                        Override Credentials
                      </button>
                    </div>

                  </form>
                </div>

                {/* Two Factor Authentication */}
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-black text-white uppercase tracking-wider">🔐 Two-Factor Verification Shield (2FA)</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Demands dual authentication vectors to secure login transactions.</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded ${
                      user.twoFactorEnabled ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/25' : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {user.twoFactorEnabled ? 'SHIELD ONLINE' : 'SHIELD DEACTIVATED'}
                    </span>
                  </div>

                  {user.twoFactorEnabled ? (
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono text-emerald-400 block">✓ Secure synchronized token link active.</span>
                      <button
                        onClick={() => toggleTwoFactor()}
                        className="text-[10px] font-bold text-rose-500 hover:underline uppercase block"
                      >
                        Deactivate Authenticator core
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-xs">
                      {show2FAsetup ? (
                        <form onSubmit={handleToggle2FASubmit} className="space-y-3 bg-slate-900/30 border border-white/5 p-4 rounded-xl">
                          <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* Dummy QR image */}
                            <div className="bg-white p-2.5 rounded-lg shrink-0">
                              <div className="w-24 h-24 bg-slate-950 flex items-center justify-center font-bold text-[8px] text-pink-500 border border-pink-500/30">
                                SAKURA-2FA
                              </div>
                            </div>
                            <div className="space-y-1 text-slate-400 text-[11px]">
                              <span className="text-white font-black block uppercase text-[10px] text-pink-400">Scan Authenticator Key</span>
                              <p>1. Open Google Authenticator or custom core.</p>
                              <p>2. Scan the secure binary matrix or key.</p>
                              <p>3. Enter code <span className="text-white bg-slate-800 px-1 font-bold">123456</span> to confirm synchronization.</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              maxLength={6}
                              required
                              value={authCode}
                              onChange={(e) => setAuthCode(e.target.value)}
                              placeholder="Enter 6-digit sync code (123456)"
                              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl p-2 focus:outline-none flex-1 text-center"
                            />
                            <button type="submit" className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-slate-950 font-black rounded-xl uppercase">Link</button>
                          </div>
                          {authError && <p className="text-rose-500 text-[10px]">{authError}</p>}
                        </form>
                      ) : (
                        <button
                          onClick={() => setShow2FAsetup(true)}
                          className="px-4 py-2.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 font-black uppercase rounded-xl transition duration-300"
                        >
                          Enable Authenticator Core
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Login sessions tracker */}
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl">
                  <h3 className="text-md font-black text-white uppercase tracking-wider mb-4">🖥️ Active Node Terminals</h3>
                  
                  <div className="space-y-3 font-mono text-xs">
                    {user.sessions && user.sessions.map((session) => (
                      <div key={session.id} className="border border-slate-900 rounded-xl p-4 flex justify-between items-center bg-slate-950/20">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-pink-400 shrink-0" />
                          <div>
                            <span className="text-white font-black block">{session.device}</span>
                            <span className="text-[10px] text-slate-400">{session.location} | {session.lastActive}</span>
                          </div>
                        </div>
                        {session.isCurrent ? (
                          <span className="text-[9px] font-black text-emerald-400 border border-emerald-400/25 bg-emerald-400/5 px-2 py-0.5 rounded uppercase">CURRENT TERMINAL</span>
                        ) : (
                          <button
                            onClick={() => {
                              // Simulate termination
                              alert(`Node session ${session.id} terminated. security logs archived.`);
                            }}
                            className="text-[9px] font-bold text-rose-400 hover:underline uppercase"
                          >
                            Terminate link
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB: PRIVACY & ACCOUNT DELETION */}
            {activeTab === 'privacy' && (
              <motion.div
                key="tab-privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                
                {/* Privacy & data exports */}
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl space-y-6 font-mono text-xs">
                  <div>
                    <h3 className="text-md font-black text-white uppercase tracking-wider">🛡️ Data Matrix Diagnostics</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Control cookie coordinates and export your tactical pilot logs.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border border-slate-900 rounded-xl bg-slate-950/30">
                      <div>
                        <span className="text-white font-bold block uppercase text-[11px]">Marketing cookie matrices</span>
                        <span className="text-[10px] text-slate-500">Allows us to suggest curated merchandise items.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={cookieMarketing} 
                        onChange={(e) => setCookieMarketing(e.target.checked)} 
                        className="accent-pink-500 cursor-pointer h-4 w-4"
                      />
                    </div>

                    <div className="flex justify-between items-center p-3 border border-slate-900 rounded-xl bg-slate-950/30">
                      <div>
                        <span className="text-white font-bold block uppercase text-[11px]">Diagnostic telemetry coordinates</span>
                        <span className="text-[10px] text-slate-500">Allows our engineers to improve the voice cockpit latency.</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={cookieDiagnostics} 
                        onChange={(e) => setCookieDiagnostics(e.target.checked)} 
                        className="accent-pink-500 cursor-pointer h-4 w-4"
                      />
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                    <div>
                      <span className="text-white font-black block uppercase text-[11px] mb-0.5">Export Pilot Logs</span>
                      <span className="text-[9px] text-slate-500 block">Download complete records in JSON compliance matrix.</span>
                    </div>
                    <button
                      onClick={handleDownloadBackup}
                      className="px-4 py-2 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 text-pink-400 font-bold uppercase rounded-xl transition duration-200 flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" /> Download Pilot JSON
                    </button>
                  </div>
                </div>

                {/* Critical Account Deletion */}
                <div className="border border-rose-500/20 bg-rose-500/5 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs">
                  <div>
                    <h3 className="text-md font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-rose-500 animate-pulse" /> Permanent Deconstruction Node (Delete Account)
                    </h3>
                    <p className="text-xs text-rose-300 mt-0.5">Completely terminate your profile, destroying loyalty GP points, order history, wishlists, and addresses.</p>
                  </div>

                  <div className="border border-rose-500/10 bg-slate-950/40 p-4 rounded-xl space-y-2 text-[11px] text-slate-400">
                    <p className="font-bold text-rose-300 uppercase">⚠️ DESTRUCTION PROTOCOL MANDATE WARNING:</p>
                    <p>• Access to your command dashboard profile will be permanently locked.</p>
                    <p>• Your cumulative balance of <span className="text-yellow-400 font-bold">{points} GP</span> will be burned.</p>
                    <p>• Action cannot be rolled back or undone.</p>
                  </div>

                  {showDeleteConfirm ? (
                    <form onSubmit={handleDeleteAccountSubmit} className="space-y-4 bg-slate-950/40 border border-rose-500/30 p-4 rounded-2xl animate-fade-in">
                      <span className="text-xs text-rose-300 font-bold uppercase block text-center">PASS CODE COORDINATES REQUIRED TO PROCEED:</span>
                      
                      <div className="space-y-1.5">
                        <label className="text-slate-400 uppercase tracking-wider block text-[10px]">Verify current password:</label>
                        <input
                          type="password"
                          required
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-900 border border-rose-500/35 text-xs text-slate-200 rounded-xl p-3 outline-none"
                        />
                      </div>

                      {deleteError && <p className="text-rose-500 text-[10px] text-center font-bold">{deleteError}</p>}

                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                          }}
                          className="px-4 py-2 border border-white/10 rounded-xl uppercase text-[10px]"
                        >
                          Cancel Protocol
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl uppercase text-[10px] transition-colors"
                        >
                          Execute Destruction Code
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-slate-950 font-black uppercase rounded-xl transition duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    >
                      Initialize Destruction Protocol
                    </button>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <motion.div
                key="tab-orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl">
                  <h3 className="text-md font-black text-white uppercase tracking-wider mb-4">📝 Order Chronology Archives</h3>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-900 rounded-2xl p-4 space-y-3 bg-slate-950/20 font-mono text-xs">
                          
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-slate-400">
                            <div>
                              <span className="text-pink-400 font-bold block text-sm">ORDER #{order.id}</span>
                              <span className="text-slate-500 text-[10px]">Transmitted: {order.date}</span>
                            </div>
                            <div className="text-right sm:text-right">
                              <span className="text-cyan-400 font-bold block text-sm">${order.total.toFixed(2)}</span>
                              <span className={`text-[10px] font-bold uppercase ${
                                order.status === 'Cancelled' ? 'text-rose-500' :
                                order.status === 'Processing' ? 'text-amber-400 animate-pulse' :
                                'text-emerald-400'
                              }`}>STATUS: {order.status}</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-900 pt-2 text-slate-300">
                            <ul className="space-y-1">
                              {order.items.map((it, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <span>{it.quantity}x {it.name} ({it.variant})</span>
                                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {order.status === 'Processing' && (
                            <div className="flex justify-end pt-2 border-t border-slate-900/50">
                              <button
                                onClick={() => {
                                  cancelOrder(order.id);
                                  // Speak cancellation voice trigger
                                  alert(`Order ${order.id} successfully cancelled.`);
                                }}
                                className="text-[10px] uppercase bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 px-2.5 py-1 rounded-md transition duration-200"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase border border-dashed border-slate-900 rounded-2xl">
                      🔮 ARCHIVE CHRONOLOGY REGISTER EMPTY
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* TAB: WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="tab-wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="border border-purple-500/10 rounded-3xl bg-slate-950 p-6 shadow-2xl">
                  <h3 className="text-md font-black text-white uppercase tracking-wider mb-4">💖 Tactical Wishlist Relics</h3>

                  {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistedProducts.map((product) => (
                        <div key={product.id} className="border border-white/5 rounded-2xl p-4 bg-slate-950/25 backdrop-blur-md flex gap-4 font-mono text-xs">
                          <img src={product.images[0]} alt={product.name} className="h-16 w-16 object-cover rounded-lg shrink-0 border border-white/5" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-white font-black line-clamp-1">{product.name}</span>
                              <span className="text-pink-400 font-bold block mt-0.5">${product.price.toFixed(2)}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => addToCart(product, product.variants[0])}
                                className="px-2.5 py-1 bg-pink-500 hover:bg-pink-600 text-slate-950 text-[10px] font-black uppercase rounded"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => toggleWishlist(product.id)}
                                className="px-2 py-1 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-[10px] rounded"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 font-mono text-xs uppercase border border-dashed border-slate-900 rounded-2xl">
                      🌟 Tactical Wishlist registers empty. Bookmark some apothecary relics!
                    </div>
                  )}

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
