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

// POST /api/users/logout  - очистить куки
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

// GET /api/users/profile
export async function getUserProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.send("get user profile");
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
    res.send("update user profile");
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
    res.send("get users");
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
    res.send("get user by id");
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
    res.send("delete user");
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
    res.send("update user");
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error("Произошла неизвестная серверная ошибка"));
    }
  }
}
