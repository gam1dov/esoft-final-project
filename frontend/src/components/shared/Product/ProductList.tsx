import type { Product } from "../../../../types/ordersApiSliceTypes";
import ProductCard from "./ProductCard";

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product: Product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      ) : (
        <div>
          <p>Новых продуктов не найдено</p>
        </div>
      )}
    </div>
  );
};
export default ProductList;
