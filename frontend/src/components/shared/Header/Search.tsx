import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useGetCategoriesQuery } from "../../../slices/productsApiSlice";
import Loader from "../Loader";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { SearchIcon } from "lucide-react";

const Search = () => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <Loader />;
  if (error) return <div>Ошибка загрузки категорий...</div>;
  return (
    <form action="/search">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="All" value="all">
              Все
            </SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.category} value={c.category}>
                {c.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Поиск"
          className="md:w=[100px] lg:w-[300px]"
        />
        <Button className="cursor-pointer" type="submit">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};
export default Search;
