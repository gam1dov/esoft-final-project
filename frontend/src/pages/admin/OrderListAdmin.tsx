import { formatDateAndTime, formatId } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import Loader from "../../components/shared/Loader";
import Pagination from "../../components/shared/Pagination";

const OrderListAdmin = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error } = useGetOrdersQuery({
    pageNumber: Number(pageNumber),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Произошла ошибка загрузки заказов</div>;
  return (
    <>
      <div className="space-y-2">
        <h2 className="h2-bold">Заказы</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№ заказа</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Общая цена</TableHead>
                <TableHead>Сведения об оплате</TableHead>
                <TableHead>Сведения о доставке</TableHead>
                <TableHead>Дополнительно</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateAndTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{Math.round(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt
                      ? formatDateAndTime(order.paidAt).dateTime
                      : "Не оплачено"}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateAndTime(order.deliveredAt).dateTime
                      : "Не доставлено"}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/order/${order.id}`}>Детали</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!!data?.totalPages && data.totalPages > 1 && (
            <Pagination
              currentPage={data.page || 1}
              totalPages={data.totalPages}
              basePath="/admin/orderlist"
            />
          )}
        </div>
      </div>
    </>
  );
};
export default OrderListAdmin;
