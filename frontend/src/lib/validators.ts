import { z } from "zod";

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.string(),
  brand: z.string(),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number().min(0),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: z.coerce.number(),
  numReviews: z.coerce.number(),
});
