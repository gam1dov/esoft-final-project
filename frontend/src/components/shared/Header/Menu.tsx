import ToggleMode from "./ToggleMode";
import { Button } from "../../ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1 ">
        <ToggleMode />
        <Button asChild variant="ghost">
          {/* Link to='/cart' в Роутере */}
          <a href="/cart">
            <ShoppingCart /> Корзина
          </a>
        </Button>
        <Button asChild>
          {/* Link to='/sign-in' в Роутере */}
          <a href="/sign-in">
            <UserIcon /> Войти
          </a>
        </Button>
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
              {/* Link to='/cart' в Роутере */}
              <a href="/cart">
                <ShoppingCart /> Корзина
              </a>
            </Button>
            <Button asChild>
              {/* Link to='/sign-in' в Роутере */}
              <a href="/sign-in">
                <UserIcon /> Войти
              </a>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};
export default Menu;
