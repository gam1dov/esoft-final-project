import { type NextFunction, type Request, type Response } from "express";
import { db } from "../config/db.js";
import { compare } from "bcryptjs";
import { hashPassword, generateToken } from "../utils/utils.js";

// POST /api/users/auth
export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await db
      .selectFrom("users")
      .where("email", "=", email)
      .selectAll()
      .executeTakeFirst();

    if (user && (await compare(password, user.password))) {
      generateToken(res, user.id);
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      });
    } else {
      res.status(401);
      throw new Error("Неверные входные данные");
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// POST /api/users
export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body;
    const userExists = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    if (userExists) {
      res.status(400);
      throw new Error("Пользователь существует");
    }

    const hashedPassword = await hashPassword(password);

    const user = await db
      .insertInto("users")
      .values({ name, email, password: hashedPassword })
      .returning(["id", "name", "email", "is_admin"])
      .executeTakeFirst();

    if (user) {
      generateToken(res, user.id);
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      });
    } else {
      res.status(400);
      throw new Error("Неверные данные пользователя");
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// POST /api/users/logout
export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Выход осуществлен успешно!" });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// PUT /api/users/profile
export async function updateUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    const user = await db
      .selectFrom("users")
      .select(["id", "name", "email", "is_admin"])
      .where("id", "=", userId)
      .executeTakeFirst();

    if (!user) {
      res.status(404);
      throw new Error("Пользователь не найден");
    }

    const updatedUser = await db
      .updateTable("users")
      .set({
        name: name || user.name,
        email: email || user.email,
      })
      .where("id", "=", userId)
      .returning(["id", "name", "email", "is_admin"])
      .executeTakeFirst();

    if (!updatedUser) {
      res.status(404);
      throw new Error("Не удалось обновить профиль");
    }

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.is_admin,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// GET /api/users
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await db
      .selectFrom("users")
      .select(["id", "name", "email", "is_admin"])
      .orderBy("created_at", "desc")
      .execute();

    const response = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    }));

    res.json(response);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// GET /api/users/:id
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.params.id;
    const user = await db
      .selectFrom("users")
      .select(["id", "name", "email", "is_admin", "created_at"])
      .where("id", "=", userId)
      .executeTakeFirst();

    if (user) {
      const responseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      };
      res.status(200).json(responseUser);
    } else {
      res.status(404);
      throw new Error("Пользователь не найден");
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// DELETE /api/users/:id
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.params.id;
    const user = await db
      .selectFrom("users")
      .select(["id", "is_admin"])
      .where("id", "=", userId)
      .executeTakeFirst();
    if (!user) {
      res.status(404);
      throw new Error("Пользователь не найден");
    }

    if (user.is_admin) {
      res.status(403);
      throw new Error("Невозможно удалить администратора!");
    }
    await db.deleteFrom("users").where("id", "=", userId).execute();
    res.status(200).json({ message: "Пользователь удален" });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}

// PUT /api/users/:id
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.params.id;
    const { name, email, isAdmin } = req.body;

    const userExists = await db
      .selectFrom("users")
      .select("id")
      .where("id", "=", userId)
      .executeTakeFirst();

    if (!userExists) {
      res.status(404);
      throw new Error("User not found");
    }

    const updatedUser = await db
      .updateTable("users")
      .set({
        name: name,
        email: email,
        is_admin: Boolean(isAdmin),
      })
      .where("id", "=", userId)
      .returning(["id", "name", "email", "is_admin"])
      .executeTakeFirst();

    if (updatedUser) {
      const responseProduct = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.is_admin,
      };
      res.status(200).json(responseProduct);
    } else {
      res.status(404);
      throw new Error("Пользователь не найден!");
    }
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}
