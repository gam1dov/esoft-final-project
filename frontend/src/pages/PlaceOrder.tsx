import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import CheckoutSteps from "../components/shared/CheckoutSteps";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Loader as LittleLoader, Check } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const { userInfo } = useAppSelector((state) => state.auth);

  const [createOrder] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress?.address, navigate]);

  async function placeOrderHandler(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res.id}`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Не получилось создать заказ", {
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
  }

  function PlaceOrderButton() {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <LittleLoader className="w-4 h-4 animate-spin" />
        ) : (
          <Check className="w-4 h-4 full" />
        )}
        Разместить заказ
      </Button>
    );
  }
  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-2 text-2xl">Разместить заказ</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card className="py-0">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Адрес доставки</h2>
              <p>{userInfo?.name}</p>
              <p>
                {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{" "}
                {cart.shippingAddress?.country}
              </p>
              <div className="mt-3">
                <Link to="/shipping">
                  <Button variant="outline">Редактировать</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Способ оплаты</h2>
              <p>{cart.paymentMethod}</p>
              <div className="mt-3">
                <Link to="/payment">
                  <Button variant="outline">Редактировать</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Заказанные товары</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead>Количество</TableHead>
                    <TableHead>Цена</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.cartItems.length === 0 ? (
                    <div>Ваша корзина пуста</div>
                  ) : (
                    cart.cartItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Link
                            to={`/products/${item.id}`}
                            className="flex items-center"
                          >
                            <img
                              src={`http://localhost:5000${item.images[0]}`}
                              // src={item.images[0]}
                              alt={item.name}
                              className="w-[50px] h-[50px]"
                            />
                            <span className="px-2">{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className="px-2">{item.quantity}</span>
                        </TableCell>
                        <TableCell className="px-2">
                          {Math.round(item.price)} руб.
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="py-0">
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Товары</div>
                <div>
                  {cart.cartItems.reduce((acc, cur) => acc + cur.quantity, 0)}{" "}
                  шт.
                </div>
              </div>
              <div className="flex justify-between">
                <div>Стоимость доставки</div>
                <div>{cart.shippingPrice} руб.</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>ИТОГО</div>
                <div>{cart.itemsPrice} руб.</div>
              </div>
              <form onSubmit={placeOrderHandler} className="w-full">
                <PlaceOrderButton />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
export default PlaceOrder;
