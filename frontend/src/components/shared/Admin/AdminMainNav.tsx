import { Link, useLocation } from "react-router-dom";
import { cn } from "../../../lib/utils";

const AdminMainNav = ({ className }: { className: string }) => {
  const { pathname } = useLocation();

  const navItems = [
    { href: "overview", label: "Обзор" },
    { href: "productlist", label: "Товары" },
    { href: "orderlist", label: "Заказы" },
    { href: "userlist", label: "Пользователи" },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(item.href) ? "" : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
export default AdminMainNav;
