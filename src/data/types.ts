export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'skincare' | 'merchandise' | 'stationery';
  subCategory: string;
  description: string;
  ingredients?: string[];
  variants: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  price: number;
  discount: number; // percentage
  images: string[];
  threedType: 'bottle' | 'cream_jar' | 'capsule' | 'crystal' | 'figurine' | 'sword' | 'lamp' | 'pendant' | 'scroll' | 'hoodie' | 'mug';
  reviews: Review[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
}
