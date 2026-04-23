export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  installments: {
    count: number;
    value: number;
  };
  pixPrice: number;
  category: Category;
  rating: number;
  reviewsCount: number;
  soldCount: number;
  shortDescription: string;
  benefits: string[];
  description: string;
  specifications: Record<string, string>;
  images: string[];
  badge?: "Novo" | "Mais Vendido" | "Promoção";
  inStock: boolean;
  originalPrice?: number;
  freeShipping?: boolean;
  deliveryDays?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}
