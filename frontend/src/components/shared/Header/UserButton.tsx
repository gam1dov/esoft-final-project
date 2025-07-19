import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";

import { useLogoutMutation } from "../../../slices/usersApiSlice";
import { logout } from "../../../slices/authSlice";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { resetCart } from "../../../slices/cartSlice";

const UserButton = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const firstLetterOfName = userInfo?.name?.charAt(0).toUpperCase() ?? "";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!userInfo) {
    return (
      <Button asChild>
        <Link to="/login">
          <UserIcon /> Войти
        </Link>
      </Button>
    );
  }
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
            >
              {firstLetterOfName}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            {" "}
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {userInfo?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {userInfo?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className="p-0 mb-1">
            <Link to="/profile">
              <Button
                className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                variant="ghost"
              >
                Профиль пользователя
              </Button>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 mb-1">
            <Link to="/myorders">
              <Button
                className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                variant="ghost"
              >
                История заказов
              </Button>
            </Link>
          </DropdownMenuItem>
          {userInfo && userInfo.isAdmin && (
            <DropdownMenuItem className="p-0 mb-1">
              <Link to="/admin/overview">
                <Button
                  className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                  variant="ghost"
                >
                  Обзор
                </Button>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0 mb-1">
            <form className="w-full" onSubmit={logoutHandler}>
              <Button
                className="w-full py-4 px-2 h-4 justify-start cursor-pointer"
                variant="ghost"
              >
                Выйти
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserButton;
