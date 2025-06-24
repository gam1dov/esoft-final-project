import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  users: UsersTable;
  products: ProductsTable;
}

interface UsersTable {
  id: Generated<string>;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  created_at: Generated<Date>;
}

interface ProductsTable {
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
  is_featured: boolean;
  banner: string | null;
  user_id: string;
  created_at: Generated<Date>;
}
