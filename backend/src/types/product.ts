export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  banner?: string | null;
  createdAt?: string;
}
