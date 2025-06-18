import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Product } from "types";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import ProductPrice from "../components/shared/Product/ProductPrice";
import ProductImages from "../components/shared/Product/ProductImages";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const { productId } = useParams();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const product: Product = await response.json();
        setProduct(product);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [productId]);

  if (!product) return <div>Product not found</div>;

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
                  <div className="flex-center">
                    <Button className="w-full">Добавить в корзину</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
export default ProductDetailsPage;
