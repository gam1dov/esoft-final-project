import { NextFunction, type Request, type Response } from "express";
import { db } from "../config/db.js";

export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const products = await db
      .selectFrom("products")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();

    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!product) {
      const error = new Error("Товар не найден!");
      (error as any).statusCode = 404;
      throw error;
    }

    res.json(product);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная ошибка"));
    }
  }
}

export async function createProduct(req: Request, res: Response) {}
