import { Link } from "react-router-dom";
import ProductCard from "../components/shared/Product/ProductCard";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "../slices/productsApiSlice";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/shared/Loader";
import { Button } from "../components/ui/button";

const prices = [
  {
    name: "от 999 до 2999 р.",
    value: "999-2999",
  },
  {
    name: "от 3000 до 5999 р.",
    value: "3000-5999",
  },
  {
    name: "от 6000 до 8999 р.",
    value: "6000-8999",
  },
  {
    name: "от 9000 до 10999 р.",
    value: "9000-10999",
  },
];

const ratings = [
  { value: "4", label: "4 звезды и выше" },
  { value: "3", label: "3 звезды и выше" },
  { value: "2", label: "2 звезды и выше" },
  { value: "1", label: "1 звезда и выше" },
];

const sorts = [
  { value: "new", label: "Новое поступление" },
  { value: "low", label: "По цене" },
  { value: "rating", label: "По рейтингу" },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "all";
  const q = searchParams.get("q") || "all";
  const price = searchParams.get("price") || "all";
  const rating = searchParams.get("rating") || "all";
  const sort = searchParams.get("sort") || "new";
  const page = searchParams.get("page") || "1";

  const getFilterUrl = ({
    cat,
    pr,
    s,
    rat,
    pag,
  }: {
    cat?: string;
    pr?: string;
    s?: string;
    rat?: string;
    pag?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (cat) params.category = cat;
    if (pr) params.price = pr;
    if (s) params.sort = s;
    if (rat) params.rating = rat;
    if (pag) params.page = pag;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const { data, isLoading, error } = useGetProductsQuery({
    keyword: q !== "all" ? q : undefined,
    category: category !== "all" ? category : undefined,
    price: price !== "all" ? price : undefined,
    rating: rating !== "all" ? rating : undefined,
    sort: sort !== "new" ? sort : undefined,
    pageNumber: Number(page),
  });

  const { data: categories } = useGetCategoriesQuery();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="text-xl mb-2 mt-3">Категория</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                to={getFilterUrl({ cat: "all" })}
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
              >
                Все
              </Link>
            </li>
            {categories?.map((c) => (
              <li key={c.category}>
                <Link
                  className={`${category === c.category && "font-bold"}`}
                  to={getFilterUrl({ cat: c.category })}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-8">Цена</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                to={getFilterUrl({ pr: "all" })}
                className={`${price === "all" && "font-bold"}`}
              >
                Все
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"}`}
                  to={getFilterUrl({ pr: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-8">Рейтинг</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                to={getFilterUrl({ rat: "all" })}
                className={`${rating === "all" && "font-bold"}`}
              >
                Все
              </Link>
            </li>
            {ratings.map((rat) => (
              <li key={rat.value}>
                <Link
                  className={`${rating === rat.value && "font-bold"}`}
                  to={getFilterUrl({ rat: rat.value })}
                >
                  {rat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Результат поиска: " + q}
            {category !== "all" &&
              category !== "" &&
              " Категория поиска: " + category}
            {price !== "all" && " Стоимость: " + price}
            {rating !== "all" && " Рейтинг: " + rating + " звезды и выше"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"link"} asChild>
                <Link to="/search">Очистить</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Сортировать по:
            {sorts.map((sor) => (
              <Link
                key={sor.value}
                className={`mx-2 ${sort === sor.value && "font-bold"}`}
                to={getFilterUrl({ s: sor.value })}
              >
                {sor.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <div>Произошла ошибка при загрузке товаров</div>
          ) : data?.products.length === 0 ? (
            <div>Не найдено товаров</div>
          ) : (
            data?.products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchPage;
