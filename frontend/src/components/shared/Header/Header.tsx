import { Link } from "react-router-dom";
import Menu from "./Menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link to="/" className="flex-start">
            <img
              className="h-12 w-12 object-contain"
              src="/logo.svg"
              alt="NEWB logo"
            />
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
