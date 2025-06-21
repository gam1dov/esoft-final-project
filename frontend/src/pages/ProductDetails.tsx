import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import { Plus } from "lucide-react";
import { addToCart } from "../slices/cartSlice";
import { useAppDispatch } from "../store/hooks";
import ProductPrice from "../components/shared/Product/ProductPrice";
import ProductImages from "../components/shared/Product/ProductImages";
import Loader from "../components/shared/Loader";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

const ProductDetails = () => {
  const { productId } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  if (isLoading) return <Loader />;

  if (error) {
    const errorMessage =
      (error as { data?: { message?: string } })?.data?.message ||
      (error as { message?: string })?.message ||
      "Unknown error";
    return <div>{errorMessage}</div>;
  }

  if (!product) return <div>Product not found</div>;

  const addToCardHandler = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate("/cart");
  };

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} из {product.numReviews} Отзывов
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <ProductPrice
                  value={Number(product.price)}
                  className="rounded-full bg-green-100 text-green-700 px-5 py-2 "
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Описание</p>
              <p>{product.description}</p>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Цена</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Статус</div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">В наличии</Badge>
                  ) : (
                    <Badge variant="destructive">Нет в наличии</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className="mb-2 flex justify-between">
                    <div>Количество</div>
                    <Select
                      value={quantity.toString()}
                      onValueChange={(value) => setQuantity(Number(value))}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="Quantity"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(product.stock).keys()].map((x) => (
                          <SelectItem key={x + 1} value={(x + 1).toString()}>
                            {x + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {product.stock > 0 && (
                  <Button className="w-full" onClick={addToCardHandler}>
                    <Plus />
                    Добавить в корзину
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
export default ProductDetails;
