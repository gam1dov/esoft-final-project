import { formatId } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import Loader from "../../components/shared/Loader";
import { toast } from "sonner";
import Pagination from "../../components/shared/Pagination";
import DeleteModal from "../../components/shared/DeleteModal";

const ProductListAdmin = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber: Number(pageNumber) || 1,
  });

  const [deleteProduct, { isLoading: loadingDeleteProduct }] =
    useDeleteProductMutation();

  async function deleteHandler(id: string) {
    try {
      await deleteProduct(id);
      refetch();
      toast("Товар удален");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при удалении товара: ${error.message}`);
      } else {
        toast.error("Неизвестная ошибка при удалении товара");
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Товары</h1>
        <Button asChild variant="default" size="sm">
          <Link to={`/admin/productlist/create`}>Создать товар</Link>
        </Button>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div>Произошла ошибка загрузки заказов</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>НАИМЕНОВАНИЕ</TableHead>
                <TableHead className="text-right">ЦЕНА</TableHead>
                <TableHead>КАТЕГОРИЯ</TableHead>
                <TableHead>НАЛИЧИЕ</TableHead>
                <TableHead>РЕЙТИНГ</TableHead>
                <TableHead className="w-[100px]">ДЕЙСТВИЯ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{formatId(product.id)}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">
                    {Math.ceil(product.price)}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/product/${product.id}/edit`}>Ред.</Link>
                    </Button>
                    <DeleteModal
                      id={product.id}
                      onDelete={deleteHandler}
                      isLoading={loadingDeleteProduct}
                      text="товар"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!!data?.totalPages && data.totalPages > 1 && (
            <Pagination
              currentPage={data.page || 1}
              totalPages={data.totalPages}
              basePath="/admin/productlist"
            />
          )}
        </>
      )}
    </div>
  );
};
export default ProductListAdmin;
