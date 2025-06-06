import { Card, CardContent, CardHeader } from "../../ui/card";
import ProductPrice from "./ProductPrice";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 items-center">
        {/* Router тут будет */}
        <a href={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-[300px] w-[300px] object-cover"
          />
        </a>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        {/* Router тут будет */}
        <a href={`/product/${product.id}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </a>
        <div className="flex-between gap-4">
          <p>{product.rating} Звезд</p>
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
