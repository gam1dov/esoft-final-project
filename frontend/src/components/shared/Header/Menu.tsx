import { useAppSelector } from "../../../store/hooks";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import ToggleMode from "./ToggleMode";
import { Badge } from "../../ui/badge";
import UserButton from "./UserButton";

const Menu = () => {
  const cartItemsCount = useAppSelector((state) =>
    state.cart.cartItems.reduce((acc, cur) => acc + cur.quantity, 0)
  );

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1 ">
        <ToggleMode />
        <Button asChild variant="ghost">
          <Link to="/cart">
            <ShoppingCart /> Корзина
            {cartItemsCount > 0 && (
              <Badge variant="destructive">{cartItemsCount}</Badge>
            )}
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-4">
            <SheetTitle>Меню</SheetTitle>
            <ToggleMode />
            <Button asChild variant="ghost">
              <Link to="/cart">
                <ShoppingCart /> Корзина
              </Link>
            </Button>
            <Button asChild>
              <Link to="/sign-in">
                <UserIcon /> Войти
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
export default Menu;
