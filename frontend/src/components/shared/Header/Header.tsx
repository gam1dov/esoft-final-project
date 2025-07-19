import { Link } from "react-router-dom";
import Menu from "./Menu";
import Logo from "../Logo";
import CategorySelect from "./CategorySelect";
import Search from "./Search";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategorySelect />
          <Link to="/" className="flex-start ml-4">
            <Logo className={`h-12 w-12`} />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              NEBW
            </span>
          </Link>
        </div>
        <div className="hidden md:block">
          <Search />
        </div>
        <Menu />
      </div>
    </header>
  );
};
export default Header;
