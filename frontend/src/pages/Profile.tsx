import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useProfileMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo?.name, userInfo?.email]);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Пароль не совпадает", {
        style: {
          background: "#fff0f0",
          color: "#ff0000",
          border: "1px solid #ffcccc",
        },
      });
    } else {
      try {
        const res = await updateProfile({
          id: userInfo?.id as string,
          name,
          email,
        }).unwrap();
        dispatch(setCredentials(res));
        toast("Профиль успешно обновлен");
        navigate("/search");
      } catch (error) {
        const err = error as Error & { data?: { message?: string } };
        const errorMessage =
          err.data?.message ||
          err.message ||
          "Произошла ошибка при изменении данных";

        toast.error(errorMessage, {
          style: {
            background: "#fff0f0",
            color: "#ff0000",
            border: "1px solid #ffcccc",
          },
        });
      }
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Изменить данные профиля</h2>
      <form className="flex flex-col gap-5" onSubmit={submitHandler}>
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Электронный адрес</Label>
          <Input
            id="email"
            name="email"
            type="email"
            disabled
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите адрес электронной почты"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Личные данные</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя и фамилию"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите ваш пароль"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Подтвердите ваш пароль"
          />
        </div>
        <Button
          disabled={isLoading}
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
        >
          {isLoading ? "Отправка данных..." : "Изменить профиль"}
        </Button>
      </form>
    </div>
  );
};
export default Profile;
