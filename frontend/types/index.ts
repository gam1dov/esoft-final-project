import { z } from "zod";
import { insertProductSchema } from "../src/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  created_at: Date;
};
