import type { User } from "./usersSliceApiTypes";

type OrderItem = {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export type CartState = {
  cartItems: CartItem[];
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
};

export type ShippingAddress = {
  address: string;
  city: string;
  country: string;
};

export type Order = {
  id: string;
  user: User;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt?: Date;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
};

export type CartItem = Product & {
  id: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  stock: number;
  images: string[];
  price: number;
  rating: number;
  numReviews: number;
  createdAt?: Date;
  user_id?: string;
  reviews: Review[];
};

export type ProductsResponse = {
  products: Product[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalProducts: number;
  keyword?: string;
};

export type LatestSale = {
  createdAt: Date;
  id: string;
  totalPrice: number;
  userName: string;
};

export type SalesMonth = {
  month: string;
  totalSales: number;
};

export type OrderRequest = {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

export type OrderResponse = {
  orderId: string;
  details: {
    isPaid: boolean;
    paidAt: Date;
  };
};

export type OrdersResponse = {
  orders: Order[];
  latestSales: LatestSale[];
  salesData: SalesMonth[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalOrders: number;
  totalSales: number;
  totalUsers: number;
  totalProducts: number;
};

export type CategoryResponse = {
  category: string;
  productCount?: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  createdAt: Date;
  comment: string;
};

export type UploadProductImage = { message: string; images: string[] };

export type ProductRequest = {
  id?: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  stock: number | null;
  price: number | null;
  images?: string[];
};

export type ProductFilter = {
  keyword?: string;
  pageNumber: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
};

export type ReviewRequest = {
  id: string;
  rating: number;
  comment: string;
};
