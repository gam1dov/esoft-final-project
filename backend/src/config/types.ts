import { Generated, Insertable, JSONColumnType } from "kysely";

export interface Database {
  users: UsersTable;
  products: ProductsTable;
  orders: OrdersTable;
  order_items: OrderItemsTable;
  reviews: ReviewsTable;
}

type UsersTable = {
  id: Generated<string>;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  created_at: Generated<Date>;
};

type ProductsTable = {
  id: Generated<string>;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  num_reviews: number;
  user_id: string;
  created_at: Generated<Date>;
};

type OrdersTable = {
  id: Generated<string>;
  user_id: string;
  payment_method: string;
  items_price: number;
  shipping_price: number;
  total_price: number;
  is_paid: boolean;
  paid_at: Date | null;
  is_delivered: boolean;
  delivered_at: Date | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
  shipping_address: JSONColumnType<ShippingAddress, string, string>;
};

type OrderItemsTable = {
  id: Generated<string>;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
};

type ShippingAddress = {
  address: string;
  city: string;
  country: string;
};

type ReviewsTable = {
  id: Generated<string>;
  name: string;
  rating: number;
  comment: string;
  user_id: string;
  product_id: string;
  created_at: Generated<Date>;
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

export type CartItem = Product & {
  id: Generated<string>;
  quantity: number;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  createdAt: Date;
  comment: string;
};

export type OrderInsert = Insertable<OrdersTable>;
