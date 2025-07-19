import { useGetCategoriesQuery } from "../../../slices/productsApiSlice";
import { Button } from "../../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../ui/drawer";
import { MenuIcon } from "lucide-react";
import Loader from "../Loader";
import { Link } from "react-router-dom";

const CategorySelect = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка загрузки категорий...</div>;

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Выберите категорию</DrawerTitle>
          <div className="space-y-1">
            {categories?.map((category) => (
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                key={category.category}
              >
                <DrawerClose>
                  <Link to={`/search?category=${category.category}`}>
                    {category.category} ({category.productCount})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};
export default CategorySelect;
