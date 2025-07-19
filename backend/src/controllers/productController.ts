import { NextFunction, type Request, type Response } from "express";
import { db } from "../config/db.js";

export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = (req.query.keyword as string) || "";
    const category = (req.query.category as string) || "";
    const priceRange = (req.query.price as string) || "";
    const minRating = (req.query.rating as string) || "";
    const sort = (req.query.sort as string) || "new";

    let query = db.selectFrom("products");

    if (keyword) {
      query = query.where("brand", "ilike", `%${keyword}%`);
    }

    if (category && category !== "all") {
      query = query.where("category", "ilike", `%${category}%`);
    }

    if (priceRange && priceRange !== "all") {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      query = query
        .where("price", ">=", minPrice)
        .where("price", "<=", maxPrice);
    }

    if (minRating && minRating !== "all") {
      const rating = Number(minRating);
      query = query.where("rating", ">=", rating);
    }

    const count = query.select((e) => e.fn.count<number>("id").as("total"));
    const countResult = await count.executeTakeFirst();
    const totalProducts = countResult?.total || 0;
    const totalPages = Math.ceil(totalProducts / pageSize);

    let orderedQuery = query;
    if (sort === "low") {
      orderedQuery = orderedQuery.orderBy("price", "asc");
    } else if (sort === "rating") {
      orderedQuery = orderedQuery.orderBy("rating", "desc");
    } else {
      orderedQuery = orderedQuery.orderBy("created_at", "desc");
    }

    const productsQuery = orderedQuery
      .selectAll()
      .orderBy("created_at", "desc")
      .limit(pageSize)
      .offset(pageSize * (page - 1));

    const products = await productsQuery.execute();

    res.status(200).json({
      products,
      page,
      totalPages,
      totalProducts,
      keyword,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await db
      .selectFrom("products")
      .select(["category"])
      .groupBy("category")
      .select((e) => e.fn.countAll().as("productCount"))
      .execute();

    res.json(categories);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
};

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productId = req.params.id;
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .executeTakeFirst();

    if (!product) {
      res.status(404).json({ message: "Товар не найден" });
      return;
    }

    const reviews = await db
      .selectFrom("reviews")
      .select(["id", "name", "rating", "comment", "created_at as createdAt"])
      .where("product_id", "=", productId)
      .execute();

    if (product) {
      const responseProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        brand: product.brand,
        category: product.category,
        stock: product.stock,
        numReviews: product.num_reviews,
        createdAt: product.created_at,
        rating: product.rating,
        reviews: reviews,
      };
      res.status(200).json(responseProduct);
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная ошибка"));
    }
  }
}

// POST api/products
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user.id;
    const { name, description, price, images, category, brand, stock } =
      req.body;
    const product = await db
      .insertInto("products")
      .values({
        name: name,
        description: description,
        price: price,
        images: images,
        category: category,
        brand: brand,
        stock: stock,
        rating: 0,
        num_reviews: 0,
        user_id: userId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    if (!product) {
      res.status(404);
      throw new Error("Товар не найден!");
    }

    res.status(201).json({ message: "Товар успешно создан" });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная ошибка"));
    }
  }
}

// PUT api/products/:id
export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productId = req.params.id;
    const { name, description, price, images, category, brand, stock } =
      req.body;
    const updatedProduct = await db
      .updateTable("products")
      .set({
        name: name,
        price: price,
        description: description,
        images: images,
        brand: brand,
        category: category,
        stock: stock,
      })
      .where("id", "=", productId)
      .returningAll()
      .executeTakeFirst();

    if (!updatedProduct) {
      res.status(404);
      throw new Error("Товар не обновлен!");
    }

    res.status(201).json({ message: "Товар успешно обновлен" });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// DELETE api/products/:id
export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const productId = req.params.id;
    const product = await db
      .selectFrom("products")
      .select("id")
      .where("id", "=", productId)
      .executeTakeFirst();

    if (product) {
      await db.deleteFrom("products").where("id", "=", productId).execute();
      res.status(200).json({ message: "Товар удален" });
    } else {
      res.status(404);
      throw new Error("Товар не найден!");
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// POST api/products/:id/reviews
export async function createProductReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;
    const product = await db
      .selectFrom("products")
      .select(["id", "rating", "num_reviews"])
      .where("id", "=", productId)
      .executeTakeFirst();

    if (!product) {
      res.status(404);
      throw new Error("Товар не найден");
    }

    const existingReview = await db
      .selectFrom("reviews")
      .select("id")
      .where("product_id", "=", productId)
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (existingReview) {
      res.status(400);
      throw new Error("Вы уже оставляли отзыв на этот товар");
    }

    await db
      .insertInto("reviews")
      .values({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user_id: userId,
        product_id: productId,
        created_at: new Date(),
      })
      .execute();

    const reviewsCount = await db
      .selectFrom("reviews")
      .select([
        (e) => e.fn.avg("rating").as("avgRating"),
        (e) => e.fn.count("id").as("reviewCount"),
      ])
      .where("product_id", "=", productId)
      .executeTakeFirstOrThrow();

    await db
      .updateTable("products")
      .set({
        rating: Number(reviewsCount.avgRating),
        num_reviews: Number(reviewsCount.reviewCount),
      })
      .where("id", "=", productId)
      .execute();

    res.status(201).json({ message: "Отзыв успешно добавлен" });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}
