import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import { toast } from "sonner";
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from "../../slices/usersApiSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";

const UserEditAdmin = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useGetUserDetailsQuery(userId!);

  const [updateUser, { isLoading: loadingUpdateUser }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    const updatedUser = {
      id: userId!,
      name,
      email,
      isAdmin,
    };
    try {
      await updateUser(updatedUser);
      toast("Пользователь удачно обновлен");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      const err = error as Error & { data?: { message?: string } };
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Произошла ошибка при изменеии данных пользователя";

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
    <>
      <Button asChild variant="secondary" size="sm">
        <Link to={`/admin/userlist`}> Назад</Link>
      </Button>

      <div className="space-y-8 max-w-md mx-auto">
        <h1 className="h2-bold">Обновить сведения</h1>
        {isLoading && <Loader />}
        {error && <div>Не удалось загрузить информацию о пользователе</div>}
        <form className="space-y-8" onSubmit={submitHandler}>
          <div>
            {" "}
            <Label htmlFor="name" className="mb-2">
              Данные пользователя
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваши данные"
            />
          </div>
          <div>
            {" "}
            <Label htmlFor="email" className="mb-2">
              Электронный адрес
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите электронный адрес"
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="isAdmin"
              checked={isAdmin}
              onCheckedChange={(checked) => setIsAdmin(Boolean(checked))}
            />
            <Label htmlFor="isAdmin">
              Является ли пользователь администратором?
            </Label>
          </div>

          <div className="flex-between">
            <Button
              type="submit"
              size="lg"
              disabled={loadingUpdateUser}
              className="w-full"
            >
              {loadingUpdateUser
                ? "Загрузка..."
                : "Обновить информацию о пользователе"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default UserEditAdmin;
