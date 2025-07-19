export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type RegisterRequest = UserCredentials & {
  name: string;
};

export type LogoutResponse = {
  message: string;
};

export type UpdateProfileRequest = Omit<User, "isAdmin">;

export type LoginState = {
  userInfo: User | null;
};
