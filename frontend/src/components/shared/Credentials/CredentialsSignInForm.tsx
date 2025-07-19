import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useLoginMutation } from "../../../slices/usersApiSlice";
import { setCredentials } from "../../../slices/authSlice";
import Loader from "../Loader";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const CredentialsSignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      const err = error as Error & { data?: { message?: string } };
      const errorMessage =
        err.data?.message || err.message || "Произошла ошибка при входе";

      toast.error(errorMessage, {
        style: {
          background: "#fff0f0",
          color: "#ff0000",
          border: "1px solid #ffcccc",
        },
      });
    }
  }
  return (
    <form onSubmit={submitHandler}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="mb-2">
            Электронный адрес
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш электронный адрес"
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2">
            Пароль
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
          />
        </div>
        <div>
          <Button
            type="submit"
            className="w-full"
            variant="default"
            disabled={isLoading}
          >
            Войти
          </Button>
          {isLoading && <Loader />}
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Вы еще не зарегистрированы?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="font-medium"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </form>
  );
};
export default CredentialsSignInForm;
