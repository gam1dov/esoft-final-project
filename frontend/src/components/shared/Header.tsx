import { ShoppingCart, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import ToggleMode from "./ToggleMode";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          {/* Link to='/' в Роутере */}
          <a href="/" className="flex-start">
            <img
              className="h-12 w-12 object-contain"
              src="/logo.svg"
              alt="NEWB logo"
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              NEBW
            </span>
          </a>
        </div>
        <div className="space-x-2">
          <ToggleMode />
          <Button asChild variant="ghost">
            {/* Link to='/cart' в Роутере */}
            <a href="/cart">
              <ShoppingCart /> Cart
            </a>
          </Button>
          <Button asChild>
            {/* Link to='/sign-in' в Роутере */}
            <a href="/sign-in">
              <UserIcon /> Sign in
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Header;
