import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

export interface SavedAddress {
  id: string;
  fullName: string;
  street: string;
  city: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  cardHolder: string;
  cardNumber: string; // masked, e.g. **** **** **** 4242
  expiry: string;
  type: 'visa' | 'mastercard' | 'amex';
}

export interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  level: string;
  skinType: string;
  preferences: string[];
  couponClaimed: boolean;
  gender: string;
  phoneNumber: string;
  preferredLanguage: string;
  preferredCurrency: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdDate: string;
  lastLogin: string;
  addresses: SavedAddress[];
  paymentMethods: PaymentMethod[];
  sessions: LoginSession[];
  loginHistory: { date: string; action: string; device: string; ip: string }[];
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    variant: string;
  }[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  address: {
    fullName: string;
    street: string;
    city: string;
    zipCode: string;
  };
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, variant: string, quantity?: number) => void;
  removeFromCart: (productId: string, variant: string) => void;
  updateCartQuantity: (productId: string, variant: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[]; // productIds
  toggleWishlist: (productId: string) => void;
  user: UserProfile | null;
  loginUser: (email: string, name: string) => void;
  registerUser: (email: string, name: string, skinType: string) => void;
  logoutUser: () => void;
  updateUserSkinType: (type: string, preferences: string[]) => void;
  recentViews: string[];
  addRecentView: (productId: string) => void;
  activeCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  points: number;
  addPoints: (amount: number) => void;
  orders: Order[];
  placeOrder: (shippingDetails: any) => Order;
  cancelOrder: (orderId: string) => void;
  lastOrderSuccess: Order | null;
  dailyRewardClaimed: boolean;
  claimDailyReward: () => number;
  luckySpinUsedToday: boolean;
  useLuckySpin: (prize: string, pointsAwarded: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: 'all' | 'skincare' | 'merchandise' | 'stationery';
  setSelectedCategory: (cat: 'all' | 'skincare' | 'merchandise' | 'stationery') => void;
  formatPrice: (usdAmount: number, targetCurrency?: string) => string;

  // PREMIUM AUTHENTICATION & SECURITY EXTENSIONS
  voiceStyle: 'cute_heroine' | 'elegant_heroine' | 'confident_hero' | 'calm_hero' | 'random';
  voiceVolume: number;
  voiceMuted: boolean;
  voiceSpeed: number;
  setVoiceStyle: (style: 'cute_heroine' | 'elegant_heroine' | 'confident_hero' | 'calm_hero' | 'random') => void;
  setVoiceVolume: (vol: number) => void;
  setVoiceMuted: (muted: boolean) => void;
  setVoiceSpeed: (speed: number) => void;
  
  loginUserSecure: (email: string, password: string, rememberMe?: boolean) => { success: boolean; error?: string };
  registerUserSecure: (email: string, name: string, username: string, password: string, gender: string, skinType?: string) => { success: boolean; error?: string };
  socialLogin: (provider: 'google' | 'github') => void;
  forgotPassword: (email: string) => { success: boolean; code?: string; error?: string };
  resetPassword: (email: string, code: string, newPassword: string) => { success: boolean; error?: string };
  verifyEmailCode: (code: string) => boolean;
  sendVerificationCode: () => string;
  updateProfile: (updates: Partial<UserProfile>) => void;
  deleteAccountSecure: (password: string) => { success: boolean; error?: string };
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addPaymentMethod: (card: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  updatePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };
  toggleTwoFactor: (code?: string) => { success: boolean; error?: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Simple deterministic hash for password safety simulation
const hashPassword = (pwd: string): string => {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `sha256_${hash}`;
};

const DEFAULT_USER_ID = "usr-8821";

const DEFAULT_USER: UserProfile = {
  id: DEFAULT_USER_ID,
  username: "sakuracadet",
  name: "Sakura Cadet",
  email: "mrssalunkhe11@gmail.com",
  avatar: "🌸",
  points: 450,
  level: "Elite Otaku",
  skinType: "Combination (Oily T-Zone)",
  preferences: ["Glass Skin Glow", "Acne Patch Stars", "Oversized Anime Hoodies"],
  couponClaimed: false,
  gender: "Female",
  phoneNumber: "+1 (555) 019-2834",
  preferredLanguage: "en",
  preferredCurrency: "INR",
  emailVerified: true,
  twoFactorEnabled: false,
  createdDate: "2026-06-01",
  lastLogin: "2026-06-26 12:30 UTC",
  addresses: [
    { id: "adr-1", fullName: "Sakura Cadet", street: "123 Shibuya Way", city: "Neo Tokyo", zipCode: "150-0002", phone: "+1 (555) 019-2834", isDefault: true },
    { id: "adr-2", fullName: "Sakura Outpost", street: "456 Akihabara Blvd", city: "Chiyoda", zipCode: "101-0021", phone: "+1 (555) 019-8877", isDefault: false }
  ],
  paymentMethods: [
    { id: "pay-1", cardHolder: "Sakura Cadet", cardNumber: "•••• •••• •••• 4242", expiry: "12/29", type: "visa" }
  ],
  sessions: [
    { id: "ses-1", device: "Chrome / Windows PC (This Device)", location: "Neo Shibuya, Japan", lastActive: "Active Now", isCurrent: true },
    { id: "ses-2", device: "iOS / Safari Mobile", location: "Minato, Tokyo", lastActive: "2 hours ago", isCurrent: false }
  ],
  loginHistory: [
    { date: "2026-06-26 12:30", action: "Authorized Login", device: "Chrome / Windows PC", ip: "192.168.1.104" },
    { date: "2026-06-25 10:15", action: "Authorized Login", device: "iOS / Safari Mobile", ip: "192.168.1.8" }
  ]
};

// Initial accounts DB with standard cadet account (password: "sakura123")
const INITIAL_ACCOUNTS: Record<string, { profile: UserProfile; passwordHash: string }> = {
  "mrssalunkhe11@gmail.com": {
    profile: DEFAULT_USER,
    passwordHash: hashPassword("sakura123")
  }
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPageState] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Accounts database
  const [accountsDb, setAccountsDb] = useState<Record<string, { profile: UserProfile; passwordHash: string }>>(() => {
    const saved = localStorage.getItem('glow_accounts_db');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  // Voice configurations
  const [voiceStyle, setVoiceStyleState] = useState<'cute_heroine' | 'elegant_heroine' | 'confident_hero' | 'calm_hero' | 'random'>(() => {
    const saved = localStorage.getItem('animeglow_voice_style_v2');
    return (saved as any) || 'cute_heroine';
  });

  const [voiceVolume, setVoiceVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('animeglow_voice_volume');
    return saved ? parseFloat(saved) : 0.8;
  });

  const [voiceMuted, setVoiceMutedState] = useState<boolean>(() => {
    const saved = localStorage.getItem('animeglow_voice_muted');
    return saved ? saved === 'true' : false;
  });

  const [voiceSpeed, setVoiceSpeedState] = useState<number>(() => {
    const saved = localStorage.getItem('animeglow_voice_speed');
    return saved ? parseFloat(saved) : 1.0;
  });

  // Sync voice states
  const setVoiceStyle = (style: 'cute_heroine' | 'elegant_heroine' | 'confident_hero' | 'calm_hero' | 'random') => {
    setVoiceStyleState(style);
    localStorage.setItem('animeglow_voice_style_v2', style);
  };

  const setVoiceVolume = (vol: number) => {
    setVoiceVolumeState(vol);
    localStorage.setItem('animeglow_voice_volume', String(vol));
  };

  const setVoiceMuted = (muted: boolean) => {
    setVoiceMutedState(muted);
    localStorage.setItem('animeglow_voice_muted', String(muted));
  };

  const setVoiceSpeed = (speed: number) => {
    setVoiceSpeedState(speed);
    localStorage.setItem('animeglow_voice_speed', String(speed));
  };

  // Sync accounts DB to storage
  useEffect(() => {
    localStorage.setItem('glow_accounts_db', JSON.stringify(accountsDb));
  }, [accountsDb]);

  // Persistence keys
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('glow_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('glow_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('glow_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [recentViews, setRecentViews] = useState<string[]>(() => {
    const saved = localStorage.getItem('glow_recents');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('glow_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: "AG-9081",
        date: "2026-06-20",
        items: [
          { productId: "skin-01", name: "Sakura Dew Glowing Hydration Toner", quantity: 1, price: 18.99, variant: "Standard (150ml)" },
          { productId: "merch-03", name: "Kitsune Fire Premium Acrylic Standee", quantity: 1, price: 18.50, variant: "Kenji the Flame Swordsman" }
        ],
        total: 37.49,
        status: "Delivered",
        address: { fullName: "Sakura Cadet", street: "123 Shibuya Way", city: "Neo Tokyo", zipCode: "150-0002" }
      }
    ];
  });

  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem('glow_points');
    return saved ? parseInt(saved) : 450;
  });

  const [dailyRewardClaimed, setDailyRewardClaimed] = useState<boolean>(() => {
    const lastClaimed = localStorage.getItem('glow_last_claim');
    if (!lastClaimed) return false;
    const today = new Date().toDateString();
    return lastClaimed === today;
  });

  const [luckySpinUsedToday, setLuckySpinUsedToday] = useState<boolean>(() => {
    const lastSpin = localStorage.getItem('glow_last_spin');
    if (!lastSpin) return false;
    const today = new Date().toDateString();
    return lastSpin === today;
  });

  const [lastOrderSuccess, setLastOrderSuccess] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'skincare' | 'merchandise' | 'stationery'>('all');

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('glow_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('glow_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('glow_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('glow_recents', JSON.stringify(recentViews));
  }, [recentViews]);

  useEffect(() => {
    localStorage.setItem('glow_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('glow_points', points.toString());
    if (user && user.points !== points) {
      setUser(prev => prev ? { ...prev, points } : null);
    }
  }, [points]);

  // Wrapper for state router to scroll to top beautifully
  const setCurrentPage = (page: string) => {
    setCurrentPageState(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, variant: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedVariant === variant
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    // Award 5 loyalty points for adding to cart
    setPoints(p => p + 5);
  };

  const removeFromCart = (productId: string, variant: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedVariant === variant)
    ));
  };

  const updateCartQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart(prev => prev.map(item =>
      (item.product.id === productId && item.selectedVariant === variant)
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Legacy User login (for backward compatibility)
  const loginUser = (email: string, name: string) => {
    const cleanEmail = email.toLowerCase().trim();
    if (accountsDb[cleanEmail]) {
      const existing = accountsDb[cleanEmail].profile;
      setUser(existing);
      setPoints(existing.points);
    } else {
      // Create simple legacy record
      const newUserRecord: UserProfile = {
        ...DEFAULT_USER,
        id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
        username: email.split('@')[0],
        name,
        email,
        points: 200,
        level: "Glow Cadet",
        gender: "Prefer not to say"
      };
      setAccountsDb(prev => ({
        ...prev,
        [cleanEmail]: { profile: newUserRecord, passwordHash: hashPassword("sakura123") }
      }));
      setUser(newUserRecord);
      setPoints(200);
    }
  };

  const registerUser = (email: string, name: string, skinType: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const newUserRecord: UserProfile = {
      ...DEFAULT_USER,
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      username: email.split('@')[0],
      name,
      email,
      skinType,
      points: 300,
      level: "Manga Spark"
    };
    setAccountsDb(prev => ({
      ...prev,
      [cleanEmail]: { profile: newUserRecord, passwordHash: hashPassword("sakura123") }
    }));
    setUser(newUserRecord);
    setPoints(300);
  };

  // SECURE AUTHENTICATION OPERATIONS
  const loginUserSecure = (email: string, password: string, rememberMe: boolean = true) => {
    const cleanEmail = email.toLowerCase().trim();
    const record = accountsDb[cleanEmail];
    if (!record) {
      return { success: false, error: "Pilot record node not found. Please forge a new profile." };
    }
    const hash = hashPassword(password);
    if (record.passwordHash !== hash) {
      return { success: false, error: "Incorrect security credentials. Authorization denied." };
    }

    const updatedProfile = {
      ...record.profile,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      sessions: [
        { id: `ses-${Math.floor(100 + Math.random() * 900)}`, device: "Chrome / Windows PC (This Device)", location: "Neo Shibuya, Japan", lastActive: "Active Now", isCurrent: true },
        ...record.profile.sessions.map(s => ({ ...s, isCurrent: false }))
      ]
    };

    // Update in Db
    setAccountsDb(prev => ({
      ...prev,
      [cleanEmail]: { ...prev[cleanEmail], profile: updatedProfile }
    }));

    setUser(updatedProfile);
    setPoints(updatedProfile.points);

    if (rememberMe) {
      localStorage.setItem('glow_user', JSON.stringify(updatedProfile));
    }
    return { success: true };
  };

  const registerUserSecure = (
    email: string, 
    name: string, 
    username: string, 
    password: string, 
    gender: string, 
    skinType: string = "Normal"
  ) => {
    const cleanEmail = email.toLowerCase().trim();
    if (accountsDb[cleanEmail]) {
      return { success: false, error: "This email address is already linked to another pilot core." };
    }

    const newProfile: UserProfile = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      username: username.toLowerCase().trim() || email.split('@')[0],
      name,
      email,
      avatar: gender === 'Male' ? '⚔️' : gender === 'Female' ? '🌸' : '🦊',
      points: 300, // Forge registration points!
      level: "Manga Spark",
      skinType,
      preferences: ["First Steps"],
      couponClaimed: false,
      gender,
      phoneNumber: "",
      preferredLanguage: "en",
      preferredCurrency: "INR",
      emailVerified: false,
      twoFactorEnabled: false,
      createdDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      addresses: [],
      paymentMethods: [],
      sessions: [
        { id: "ses-new", device: "Chrome / Windows PC (This Device)", location: "Neo Shibuya, Japan", lastActive: "Active Now", isCurrent: true }
      ],
      loginHistory: [
        { date: new Date().toISOString().replace('T', ' ').substring(0, 16), action: "Profile Forged", device: "Chrome / Windows PC", ip: "192.168.1.1" }
      ]
    };

    setAccountsDb(prev => ({
      ...prev,
      [cleanEmail]: { profile: newProfile, passwordHash: hashPassword(password) }
    }));

    setUser(newProfile);
    setPoints(300);
    return { success: true };
  };

  const socialLogin = (provider: 'google' | 'github') => {
    const mockEmail = `${provider}_pilot@hologlow.net`;
    const mockName = provider === 'google' ? "G-Alpha Pilot" : "Git-Octo Coder";
    const cleanEmail = mockEmail.toLowerCase().trim();

    if (accountsDb[cleanEmail]) {
      const existing = accountsDb[cleanEmail].profile;
      setUser(existing);
      setPoints(existing.points);
    } else {
      const socialProfile: UserProfile = {
        ...DEFAULT_USER,
        id: `usr-soc-${Math.floor(1000 + Math.random() * 9000)}`,
        username: `${provider}_commander`,
        name: mockName,
        email: mockEmail,
        avatar: provider === 'google' ? '🌐' : '🐙',
        points: 250,
        level: "Nebula Cadet",
        emailVerified: true
      };

      setAccountsDb(prev => ({
        ...prev,
        [cleanEmail]: { profile: socialProfile, passwordHash: hashPassword("social-auth-password") }
      }));
      setUser(socialProfile);
      setPoints(250);
    }
  };

  const forgotPassword = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    if (!accountsDb[cleanEmail]) {
      return { success: false, error: "No pilot record found matching this email node." };
    }
    const tempCode = String(Math.floor(100000 + Math.random() * 900000));
    return { success: true, code: tempCode };
  };

  const resetPassword = (email: string, code: string, newPassword: string) => {
    const cleanEmail = email.toLowerCase().trim();
    if (!accountsDb[cleanEmail]) {
      return { success: false, error: "Authentication node error." };
    }
    setAccountsDb(prev => ({
      ...prev,
      [cleanEmail]: {
        ...prev[cleanEmail],
        passwordHash: hashPassword(newPassword)
      }
    }));
    return { success: true };
  };

  const verifyEmailCode = (code: string): boolean => {
    if (code === '777777' || code.length === 6) {
      updateProfile({ emailVerified: true });
      return true;
    }
    return false;
  };

  const sendVerificationCode = (): string => {
    return String(Math.floor(100000 + Math.random() * 900000));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      // Save to accountDb
      setAccountsDb(db => {
        const cleanEmail = prev.email.toLowerCase().trim();
        if (db[cleanEmail]) {
          return {
            ...db,
            [cleanEmail]: {
              ...db[cleanEmail],
              profile: updated
            }
          };
        }
        return db;
      });
      return updated;
    });
  };

  const deleteAccountSecure = (password: string) => {
    if (!user) return { success: false, error: "No authorized profile session active." };
    const cleanEmail = user.email.toLowerCase().trim();
    const record = accountsDb[cleanEmail];
    if (!record) return { success: false, error: "Pilot core record not found." };

    if (record.passwordHash !== hashPassword(password)) {
      return { success: false, error: "Security validation failed. Deletion abort." };
    }

    // Delete from Db
    setAccountsDb(prev => {
      const copy = { ...prev };
      delete copy[cleanEmail];
      return copy;
    });

    logoutUser();
    return { success: true };
  };

  const addAddress = (address: Omit<SavedAddress, 'id'>) => {
    if (!user) return;
    const newAddress = {
      ...address,
      id: `adr-${Math.floor(100 + Math.random() * 900)}`
    };
    const updatedAddresses = user.addresses.map(a => 
      newAddress.isDefault ? { ...a, isDefault: false } : a
    );
    updateProfile({
      addresses: [...updatedAddresses, newAddress]
    });
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    updateProfile({
      addresses: user.addresses.filter(a => a.id !== id)
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    updateProfile({
      addresses: user.addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    });
  };

  const addPaymentMethod = (card: Omit<PaymentMethod, 'id'>) => {
    if (!user) return;
    const newCard = {
      ...card,
      id: `pay-${Math.floor(100 + Math.random() * 900)}`
    };
    updateProfile({
      paymentMethods: [...user.paymentMethods, newCard]
    });
  };

  const removePaymentMethod = (id: string) => {
    if (!user) return;
    updateProfile({
      paymentMethods: user.paymentMethods.filter(c => c.id !== id)
    });
  };

  const updatePassword = (oldPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "No active session." };
    const cleanEmail = user.email.toLowerCase().trim();
    const record = accountsDb[cleanEmail];
    if (!record || record.passwordHash !== hashPassword(oldPassword)) {
      return { success: false, error: "Verification of current password failed." };
    }

    setAccountsDb(prev => ({
      ...prev,
      [cleanEmail]: {
        ...prev[cleanEmail],
        passwordHash: hashPassword(newPassword)
      }
    }));
    return { success: true };
  };

  const toggleTwoFactor = (code?: string) => {
    if (!user) return { success: false, error: "No active session." };
    if (user.twoFactorEnabled) {
      updateProfile({ twoFactorEnabled: false });
      return { success: true };
    } else {
      if (code === '123456' || (code && code.length === 6)) {
        updateProfile({ twoFactorEnabled: true });
        return { success: true };
      }
      return { success: false, error: "Invalid synchronization key. Please type '123456' to confirm." };
    }
  };

  const logoutUser = () => {
    setUser(null);
    setCart([]);
    setWishlist([]);
    setRecentViews([]);
  };

  const updateUserSkinType = (type: string, preferences: string[]) => {
    updateProfile({
      skinType: type,
      preferences
    });
  };

  // Recents
  const addRecentView = (productId: string) => {
    setRecentViews(prev => {
      const next = prev.filter(id => id !== productId);
      return [productId, ...next].slice(0, 8);
    });
  };

  // Coupons
  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GLOW20' || cleanCode === 'SAKURA30' || cleanCode === 'NEON15') {
      setActiveCoupon(cleanCode);
      return true;
    }
    return false;
  };

  const removeCoupon = () => setActiveCoupon(null);

  const addPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  // Place simulated order
  const placeOrder = (shippingDetails: any): Order => {
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price * (1 - item.product.discount / 100),
      variant: item.selectedVariant
    }));

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);

    // Apply active coupon
    let discountAmount = 0;
    if (activeCoupon === 'GLOW20') discountAmount = subtotal * 0.20;
    else if (activeCoupon === 'SAKURA30') discountAmount = subtotal * 0.30;
    else if (activeCoupon === 'NEON15') discountAmount = subtotal * 0.15;

    const total = subtotal - discountAmount + 4.99; // $4.99 flat shipping

    const newOrder: Order = {
      id: `AG-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      total: parseFloat(total.toFixed(2)),
      status: 'Processing',
      address: {
        fullName: shippingDetails.fullName || (user ? user.name : "Glow Fan"),
        street: shippingDetails.address || "456 Neon Blvd",
        city: shippingDetails.city || "Neo Shibuya",
        zipCode: shippingDetails.zipCode || "150-8001"
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastOrderSuccess(newOrder);
    clearCart();
    setActiveCoupon(null);

    // Award big loyalty points for orders
    const pointsEarned = Math.floor(total * 10);
    setPoints(prev => prev + pointsEarned);

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId && order.status === 'Processing'
        ? { ...order, status: 'Cancelled' }
        : order
    ));
  };

  // Daily Checkin Reward
  const claimDailyReward = (): number => {
    const today = new Date().toDateString();
    localStorage.setItem('glow_last_claim', today);
    setDailyRewardClaimed(true);
    const amount = 50; // 50 daily reward points
    setPoints(prev => prev + amount);
    return amount;
  };

  // Lucky Spin Wheel Reward
  const useLuckySpin = (prize: string, pointsAwarded: number) => {
    const today = new Date().toDateString();
    localStorage.setItem('glow_last_spin', today);
    setLuckySpinUsedToday(true);
    if (pointsAwarded > 0) {
      setPoints(prev => prev + pointsAwarded);
    }
  };

  const formatPrice = (usdAmount: number, targetCurrency?: string): string => {
    const currency = targetCurrency || user?.preferredCurrency || 'INR';
    if (currency === 'INR') {
      return `₹${Math.round(usdAmount * 83)}`;
    }
    if (currency === 'JPY') {
      return `¥${Math.round(usdAmount * 150)}`;
    }
    if (currency === 'EUR') {
      return `€${(usdAmount * 0.92).toFixed(2)}`;
    }
    if (currency === 'GBP') {
      return `£${(usdAmount * 0.79).toFixed(2)}`;
    }
    return `$${usdAmount.toFixed(2)}`;
  };

  return (
    <AppContext.Provider value={{
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
      updateUserSkinType,
      recentViews,
      addRecentView,
      activeCoupon,
      applyCoupon,
      removeCoupon,
      points,
      addPoints,
      orders,
      placeOrder,
      cancelOrder,
      lastOrderSuccess,
      dailyRewardClaimed,
      claimDailyReward,
      luckySpinUsedToday,
      useLuckySpin,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      formatPrice,

      // ADVANCED AUTHENTICATION & SECURITY VALUES
      voiceStyle,
      voiceVolume,
      voiceMuted,
      voiceSpeed,
      setVoiceStyle,
      setVoiceVolume,
      setVoiceMuted,
      setVoiceSpeed,
      
      loginUserSecure,
      registerUserSecure,
      socialLogin,
      forgotPassword,
      resetPassword,
      verifyEmailCode,
      sendVerificationCode,
      updateProfile,
      deleteAccountSecure,
      addAddress,
      removeAddress,
      setDefaultAddress,
      addPaymentMethod,
      removePaymentMethod,
      updatePassword,
      toggleTwoFactor
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
