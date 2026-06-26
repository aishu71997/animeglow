import { Product } from './types';

// Templates for generating 105 high-quality Kawaii Stationery products
const CATEGORIES = [
  { name: 'Writing Essentials', sub: 'Pens & Pencils' },
  { name: 'Study Supplies', sub: 'Highlighters & Notebooks' },
  { name: 'School Supplies', sub: 'Pencil Cases & Sets' },
  { name: 'Office Supplies', sub: 'Organizers & Files' },
  { name: 'Art & Craft', sub: 'Tapes & Sketchbooks' },
  { name: 'Planner Accessories', sub: 'Stickers & Sticky Notes' },
  { name: 'Cute Desk Accessories', sub: 'Desk Mats & Cups' },
  { name: 'Anime Stationery', sub: 'Character Journals' },
  { name: 'Gift Sets', sub: 'Premium Bundles' },
  { name: 'Premium Collection', sub: 'Luxury Fountain Pens' }
];

const BRANDS = [
  'MochiGlow', 'NekoScribe', 'Haru Paper', 'Kitsune Krafts', 'Totoro Ink', 
  'ChibiDoodle', 'Sakura Studio', 'Shibuya Tech', 'Kawaii Craft', 'AnimeScribbler'
];

const ANIME_SERIES = [
  'Sailor Moon', 'My Neighbor Totoro', 'Demon Slayer', 'Cardcaptor Sakura', 
  'Jujutsu Kaisen', 'Neon Genesis Evangelion', 'Naruto', 'One Piece', 'Spirited Away', 'Chainsaw Man'
];

const ADJECTIVES = [
  'Kawaii', 'Pastel', 'Chibi', 'Holographic', 'Neo-Tokyo Glow', 'Sakura Blossom', 
  'Starry Night', 'Cosmic', 'Mochi', 'Dreamy', 'Lucky Cat', 'Cyberpunk', 'Fluffy', 'Shining'
];

const PRODUCT_TYPES = [
  { name: 'Dual-Tip Pastel Brush Highlighters', priceRange: [199, 399], type: 'brush', threed: 'bottle', img: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80' },
  { name: 'Plush Totoro Pencil Case', priceRange: [299, 499], type: 'pencil_case', threed: 'hoodie', img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80' },
  { name: 'Sakura Petals Grid Spiral Diary', priceRange: [249, 449], type: 'notebook', threed: 'scroll', img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80' },
  { name: 'Neko Paw Erasing Kit', priceRange: [99, 149], type: 'eraser', threed: 'crystal', img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Midnight Cyberpunk Desk Mat', priceRange: [799, 1299], type: 'desk_mat', threed: 'scroll', img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Holographic Kitsune Washi Tape Set', priceRange: [149, 299], type: 'tape', threed: 'scroll', img: 'https://images.unsplash.com/photo-1572945281861-68b122e36813?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chibi Mascot Gel Pens (6-Pack)', priceRange: [199, 349], type: 'pens', threed: 'bottle', img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Luxury Urushi Lacquer Fountain Pen', priceRange: [1200, 2400], type: 'fountain_pen', threed: 'sword', img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80' },
  { name: 'Kero-chan Sticky Note Set', priceRange: [49, 120], type: 'sticky_notes', threed: 'crystal', img: 'https://images.unsplash.com/photo-1572945281861-68b122e36813?w=600&auto=format&fit=crop&q=80' },
  { name: 'Neon Genesis Desk Organizer', priceRange: [599, 999], type: 'organizer', threed: 'mug', img: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Starry Dreamer Journal Combo Set', priceRange: [899, 1499], type: 'gift_set', threed: 'scroll', img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80' },
  { name: 'Demon Slayer Chibi Bookmark Set', priceRange: [120, 250], type: 'bookmark', threed: 'pendant', img: 'https://images.unsplash.com/photo-1572945281861-68b122e36813?w=600&auto=format&fit=crop&q=80' }
];

const generateStationeryProducts = (): Product[] => {
  const products: Product[] = [];
  const USD_TO_INR = 83;

  for (let i = 1; i <= 108; i++) {
    const catObj = CATEGORIES[i % CATEGORIES.length];
    const brand = BRANDS[i % BRANDS.length];
    const anime = ANIME_SERIES[i % ANIME_SERIES.length];
    const adj = ADJECTIVES[i % ADJECTIVES.length];
    const typeObj = PRODUCT_TYPES[i % PRODUCT_TYPES.length];

    const inrPrice = Math.round(typeObj.priceRange[0] + (i * 7) % (typeObj.priceRange[1] - typeObj.priceRange[0]));
    const usdPrice = parseFloat((inrPrice / USD_TO_INR).toFixed(2));
    const discount = i % 3 === 0 ? 10 : i % 5 === 0 ? 15 : i % 7 === 0 ? 25 : 0;

    const name = `${adj} ${anime} Inspired ${typeObj.name} (${brand})`;
    const subCategory = catObj.name; // Keep standard subcategory alignment
    const id = `stat-${i < 10 ? '0' + i : i}`;

    const ingredients = [
      `Eco-Friendly Premium Materials`,
      `Official ${anime} licensed graphic design`,
      `Sourced from Tokyo Craft district`,
      `Ergonomic teen-safe grip`
    ];

    const reviews = [
      {
        id: `sr-${i}-1`,
        user: `Aria_Gamer_${i}`,
        avatar: '🐱',
        rating: 5,
        date: '2026-06-20',
        comment: `This is incredibly cute! High quality paper and perfect for my school desk setup. Highly recommended!`
      },
      {
        id: `sr-${i}-2`,
        user: `KuroNeko_${i}`,
        avatar: '🎒',
        rating: 4,
        date: '2026-06-22',
        comment: `Really cute stationery, the pastel colors are aesthetic. Worth every Rupee!`
      }
    ];

    products.push({
      id,
      name,
      category: 'stationery',
      subCategory,
      description: `Elevate your learning terminal with the ${name}! Featuring gorgeous original pastel elements inspired by the iconic themes of ${anime}, designed by premium brand ${brand}. Perfect for students, bullet-journal enthusiasts, and anime collectors seeking beautiful, high-performance study tools.`,
      ingredients,
      variants: ['Pastel Pink', 'Neon Green', 'Holo Violet', 'Classic Midnight'].slice(0, 1 + (i % 3)),
      stock: 20 + (i * 11) % 150,
      rating: parseFloat((4.4 + (i % 6) * 0.1).toFixed(1)),
      reviewsCount: 15 + (i * 3) % 120,
      price: usdPrice,
      discount,
      images: [typeObj.img],
      threedType: typeObj.threed as any,
      isBestSeller: i % 4 === 0,
      isNewArrival: i % 6 === 0,
      isFlashSale: i % 9 === 0,
      reviews
    });
  }

  return products;
};

export const STATIONERY_PRODUCTS = generateStationeryProducts();
