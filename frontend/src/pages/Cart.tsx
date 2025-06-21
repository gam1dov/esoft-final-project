import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Link, useNavigate } from "react-router-dom";
// import { toast } from "../components/ui/sonner";
// import { useTransition } from "react";
import { ArrowRight, Loader, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { type CartItem } from "../slices/cartSlice";
import ProductPrice from "../components/shared/Product/ProductPrice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product: CartItem, quantity: number) => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const removeFromCartHandler = async (id: string) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };
  return (
    <>
      <h1 className="py-4 h2-bold">Корзина</h1>
      {cartItems.length === 0 ? (
        <div>
          Корзина пуста! <Link to="/">Пора делать покупки!</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead className="text-center">Количество</TableHead>
                  <TableHead className="text-right">Цена</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link
                        to={`/product/${item.id}`}
                        className="flex items-center"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-[50px] h-[50px]"
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(value) =>
                          addToCartHandler(item, Number(value))
                        }
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue placeholder="Quantity"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(item.stock).keys()].map((x) => (
                            <SelectItem key={x + 1} value={(x + 1).toString()}>
                              {x + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.round(item.price)} руб.
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => removeFromCartHandler(item.id)}
                      >
                        <Trash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent>
              <div className="pb-3 text-xl">
                Итого: {cartItems.reduce((acc, cur) => acc + cur.quantity, 0)}{" "}
                шт.
                <div className="font-bold">
                  <ProductPrice
                    value={Number(
                      cartItems.reduce(
                        (acc, cur) => acc + cur.quantity * cur.price,
                        0
                      )
                    )}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                <ArrowRight className="w-4 h-4" />
                Перейти к оформлению
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
export default Cart;
