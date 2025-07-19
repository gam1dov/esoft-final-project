import { useState, useTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import {
  Plus,
  Loader as LittleLoader,
  StarIcon,
  User,
  Calendar,
} from "lucide-react";
import { addToCart } from "../slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
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
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import Rating from "../components/shared/Rating";
import { formatDateAndTime } from "@/lib/utils";

const ProductDetails = () => {
  const { productId } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId!);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  if (isLoading) return <Loader />;

  if (error) {
    if (error instanceof Error) {
      toast.error("Не получилось обновить профиль", {
        style: {
          background: "#fff0f0",
          color: "#ff0000",
          border: "1px solid #ffcccc",
        },
      });
    } else {
      throw new Error("Неизвестная ошибка!");
    }
  }

  if (!product) return <div>Товар не найден</div>;

  const addToCardHandler = () => {
    startTransition(async () => {
      toast("Товар добавлен");
      dispatch(addToCart({ ...product, quantity }));
      navigate("/cart");
    });
  };

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createReview({
        id: productId as string,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast("Отзыв отправлен");
      setRating(0);
      setComment("");
      setOpen(false);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Не получилось создать отзыв";

      toast.error(errorMessage, {
        style: {
          background: "#fff0f0",
          color: "#ff0000",
          border: "1px solid #ffcccc",
        },
      });
      setOpen(false);
      setRating(0);
      setComment("");
    }
  }

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
              <Rating value={Number(product.rating)} />
              <p>
                {product.numReviews === 1
                  ? `${product.numReviews} Отзыв`
                  : product.numReviews <= 4
                  ? `${product.numReviews} Отзыва`
                  : `${product.numReviews} Отзывов`}{" "}
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
                  <Button
                    className="w-full"
                    type="button"
                    onClick={addToCardHandler}
                  >
                    {" "}
                    {isPending ? (
                      <LittleLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Добавить в корзину
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold">Отзыв покупателя</h2>
        <div className="space-y-3">
          {product.reviews.length === 0 && <div>Нет отзывов</div>}
          {userInfo ? (
            <Dialog open={open} onOpenChange={setOpen}>
              <Button onClick={() => setOpen(true)}>Написать отзыв</Button>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={submitHandler}>
                  <DialogHeader>
                    <DialogTitle>Написать отзыв</DialogTitle>
                    <DialogDescription>
                      Поделитесь вашими отзывами с другими покупателями
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="comment" className="mb-2">
                        Комментарий
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder="Введите комментарий"
                        className="resize-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="mb-2">
                        Оценка
                      </Label>
                      <Select
                        value={rating === 0 ? "" : rating.toString()}
                        onValueChange={(value) => setRating(Number(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите оценку" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>
                              {i + 1} <StarIcon className="inline h-4 w-4" />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={loadingProductReview}
                    >
                      {loadingProductReview ? "Отправка..." : "Отправить"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              {" "}
              <Link to={"/login"} className="text-blue-700 px-2">
                Авторизуйтесь
              </Link>
              пожалуйста для написания отзыва
            </>
          )}
          <div className="flex flex-col gap-3">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex-between">
                    <CardTitle>{product.name}</CardTitle>
                  </div>
                  <CardDescription>{review.comment}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 text-sm text-muted-foreground">
                    <Rating value={review.rating} />
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      {review.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDateAndTime(review.createdAt).dateTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default ProductDetails;
