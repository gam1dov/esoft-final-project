import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "..//store/hooks";
import Loader from "../components/shared/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { formatId } from "../lib/utils";
import ErrorPage from "./Error";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { formatDateAndTime } from "../lib/utils";
import { BASE_URL } from "../constants";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId!);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  async function payForItem() {
    try {
      const updateData = {
        isPaid: true,
        paidAt: new Date(),
      };

      await payOrder({
        orderId: orderId!,
        details: updateData,
      }).unwrap();

      await refetch();

      toast.success("Заказ успешно оплачен");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при оплате заказа: ${error.message}`);
      } else {
        toast.error("Неизвестная ошибка при оплате заказа");
      }
    }
  }

  async function deliverOrderHandler() {
    try {
      await deliverOrder(orderId!).unwrap();
      await refetch();
      toast.success("Заказ доставлен");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при доставке заказа: ${error.message}`);
      } else {
        toast.error("Неизвестная ошибка при оплате заказа");
      }
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <ErrorPage />
  ) : (
    <>
      <h1 className="py-4 text-2xl">Заказ {formatId(orderId as string)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card className="py-0">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Способ оплаты</h2>
              <p className="mb-2">{order?.paymentMethod}</p>
              {order?.isPaid ? (
                <Badge variant="secondary">
                  Оплачено {formatDateAndTime(order.paidAt!).dateTime}{" "}
                </Badge>
              ) : (
                <Badge variant="destructive">Нет оплаты</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="py-0 my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Адрес доставки</h2>
              <p>{order?.user.name}</p>
              <p className="mb-2">
                {order?.shippingAddress.country}, {order?.shippingAddress.city},{" "}
                {order?.shippingAddress.address}
              </p>
              {order?.isDelivered ? (
                <Badge variant="secondary">
                  Доставлено в {formatDateAndTime(order.deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Не доставлено</Badge>
              )}
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
                  {order?.orderItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          to={`/products/${item.productId}`}
                          className="flex items-center"
                        >
                          <img
                            src={`${BASE_URL}${item.image}`}
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
                  ))}
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
                  {order?.orderItems.reduce(
                    (acc, cur) => acc + cur.quantity,
                    0
                  )}{" "}
                  шт.
                </div>
              </div>
              <div className="flex justify-between">
                <div>Стоимость доставки</div>
                <div>{Math.round(order?.shippingPrice || 0)} руб.</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>ИТОГО</div>
                <div>{Math.round(order?.itemsPrice || 0)} руб.</div>
              </div>
              <div className="flex justify-between font-bold">
                {!order?.isPaid && (
                  <Button onClick={payForItem} disabled={loadingPay}>
                    Оплатить
                  </Button>
                )}
              </div>
              <div className="flex justify-between font-bold">
                {userInfo &&
                  userInfo.isAdmin &&
                  order?.isPaid &&
                  !order.isDelivered && (
                    <Button
                      onClick={deliverOrderHandler}
                      disabled={loadingDeliver}
                    >
                      Пометить как доставлено
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
export default OrderDetails;
