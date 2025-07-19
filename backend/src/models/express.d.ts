import { User } from "./user.ts";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        isAdmin?: boolean;
        createdAt?: Date;
        updatedAt?: Date;
      };
    }
  }
}
