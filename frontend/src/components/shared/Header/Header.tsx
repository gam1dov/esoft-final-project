import { Link } from "react-router-dom";
import Menu from "./Menu";
import Logo from "../Logo";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link to="/" className="flex-start">
            <Logo />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              NEBW
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
};
export default Header;
