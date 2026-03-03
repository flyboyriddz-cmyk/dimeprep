
export interface ProductVariant {
  id: string;
  name: string;
  colorHex: string; // For the UI swatch
  image: string;
  images: string[];
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string[];
  image: string;
  images: string[];
  category: string;
  stock: number; // Global stock or representative stock
  rarity?: 'COMMON' | 'RARE' | 'LEGENDARY';
  nftImage?: string;
  variants?: ProductVariant[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
  size?: string;
}

export enum ViewState {
  HOME = 'HOME',
  PRODUCT_DETAIL = 'PRODUCT_DETAIL',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  PRIVACY = 'PRIVACY'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
}
