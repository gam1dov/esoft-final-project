import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Loader from "../../components/shared/Loader";
import { BadgeRussianRuble, Barcode, CreditCard, Users } from "lucide-react";
import { formatDateAndTime, formatNumber } from "../../lib/utils";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Link } from "react-router-dom";
import Chart from "./Chart";

const OverviewAdmin = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error } = useGetOrdersQuery({
    pageNumber: Number(pageNumber),
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Произошла ошибка загрузки заказов</div>;

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Показатели</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            <BadgeRussianRuble />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data?.totalSales as number) || 0} руб.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Продажи</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(data?.totalOrders)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Покупатели</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(data?.totalUsers)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number(data?.totalProducts)}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Обзор</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart data={data?.salesData || []} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Последние продажи</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ПОКУПАТЕЛЬ</TableHead>
                  <TableHead>ДАТА ПОКУПКИ</TableHead>
                  <TableHead>ИТОГ</TableHead>
                  <TableHead>ДЕТАЛИ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.latestSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {order?.userName ? order.userName : "Пользователь удален"}
                    </TableCell>
                    <TableCell>
                      {formatDateAndTime(order.createdAt).dateTime}
                    </TableCell>
                    <TableCell>{Math.ceil(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Link to={`/order/${order.id}`}>
                        <span className="px-2">Детали</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default OverviewAdmin;
