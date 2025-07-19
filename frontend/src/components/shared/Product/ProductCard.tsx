import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../ui/card";
import ProductPrice from "./ProductPrice";
import type { Product } from "../../../../types/ordersApiSliceTypes";
import Rating from "../Rating";
import { BASE_URL } from "../../../constants";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        <Link to={`/product/${product.id}`}>
          <img
            src={`${BASE_URL}${product.images[0]}`}
            alt={product.name}
            className="h-[300px] w-[300px] object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link to={`/product/${product.id}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={product.price} />
          ) : (
            <p className="text-destructive">Нет в наличии</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ProductCard;
