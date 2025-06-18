import express, { NextFunction, type Request, type Response } from "express";
import { query } from "../config/db.js";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  banner?: string | null;
  createdAt: string;
}

export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await query(`SELECT * FROM products
                ORDER BY "createdAt" DESC`);
    const products = result.rows;

    // console.log("Fetched products", products);
    res.status(200).json(products);
  } catch (error) {
    if (error instanceof Error) {
      // console.error("Database error:", error);
      next(error);
    } else {
      next(new Error("Unknown database error occurred"));
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
    const result = await query(`SELECT * FROM products WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      const error = new Error("Product not found!");
      (error as any).statusCode = 404;
      throw error;
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Unknown error occurred"));
    }
  }
}

export async function createProduct(req: Request, res: Response) {}
