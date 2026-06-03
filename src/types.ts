/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  nameEn: string;
  nameTa: string;
  category: Category;
  price: number;
  originalPrice?: number; // for displaying discounts
  descriptionEn: string;
  descriptionTa: string;
  image: string; // we can use high quality styled illustrations or themed SVGs/images
  stock: number;
  isFeatured?: boolean;
}

export type Category = 
  | 'Sparklers' 
  | 'Flower Pots' 
  | 'Rockets' 
  | 'Atom Bombs' 
  | 'Fancy Crackers' 
  | 'Kids Special' 
  | 'Gift Boxes' 
  | 'Festival Combo Packs';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  address: string;
  notes?: string;
  items: Array<{
    productId: string;
    productNameEn: string;
    productNameTa: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'Pending' | 'Committed' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Offer {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
  minOrderValue: number;
  descriptionEn: string;
  descriptionTa: string;
}

export type Language = 'en' | 'ta';

export interface TranslationSchema {
  brandName: string;
  tagline: string;
  home: string;
  products: string;
  contact: string;
  admin: string;
  cart: string;
  shopNow: string;
  featuredProducts: string;
  offers: string;
  reviews: string;
  quickOrder: string;
  addToCart: string;
  outOfStock: string;
  inStock: string;
  total: string;
  checkout: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  placeOrder: string;
  orderSuccess: string;
  emptyCart: string;
  searchPlaceholder: string;
  all: string;
  whatsappOrder: string;
  loading: string;
}
