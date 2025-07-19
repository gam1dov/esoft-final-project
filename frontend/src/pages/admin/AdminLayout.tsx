import { Input } from "../../components/ui/input";
import AdminMainNav from "../../components/shared/Admin/AdminMainNav";
import Menu from "../../components/shared/Header/Menu";
import Logo from "../../components/shared/Logo";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link to="/" className="w-15">
              <Logo />
            </Link>
            <AdminMainNav className="mx-6" />
            <div className="ml-auto items-center flex space-x-4">
              <div>
                <Input
                  type="search"
                  placeholder="Поиск..."
                  className="md:w-[100px] lg:w-[300px]"
                />
              </div>
              <Menu />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
}
