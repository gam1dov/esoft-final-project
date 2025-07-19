import { type Request, type Response, type NextFunction } from "express";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

export async function guardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token = req.cookies.jwt;

    if (!token) {
      res.status(401);
      throw new Error("Вы не авторизовались, нет токена!");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };
      const user = await db
        .selectFrom("users")
        .select(["id", "name", "email", "is_admin"])
        .where("id", "=", decoded.userId)
        .executeTakeFirst();

      if (!user) {
        res.status(401);
        throw new Error("Пользователь не найден!");
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      };
      next();
    } catch (error) {
      res.status(401);
      next(
        error instanceof Error
          ? error
          : new Error("Вы не авторизованы, токен не прошел!")
      );
    }
  } catch (error) {
    next(
      error instanceof Error
        ? error
        : new Error("Случилась неизвестная ошибка!")
    );
  }
}

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    next(new Error("Вы не авторизованы как администратор!"));
  }
}
