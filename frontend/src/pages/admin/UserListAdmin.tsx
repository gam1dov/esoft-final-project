import { formatId } from "../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import Loader from "../../components/shared/Loader";
import { toast } from "sonner";
import DeleteModal from "../../components/shared/DeleteModal";

const UserListAdmin = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDeleteUser }] =
    useDeleteUserMutation();

  async function deleteHandler(id: string) {
    try {
      await deleteUser(id);
      refetch();
      toast("Пользователь удален");
    } catch (error) {
      const err = error as Error & { data?: { message?: string } };
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Произошла ошибка при удалении пользователя";

      toast.error(errorMessage, {
        style: {
          background: "#fff0f0",
          color: "#ff0000",
          border: "1px solid #ffcccc",
        },
      });
    }
  }
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Пользователи</h2>
      <div className="overflow-x-auto">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div>Не удалось загрузить пользователей</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№ пользователя</TableHead>
                <TableHead>Данные пользователя</TableHead>
                <TableHead>Электронный адрес</TableHead>
                <TableHead>Роль</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{formatId(user.id)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge>Администратор</Badge>
                    ) : (
                      <Badge variant="secondary">Пользователь</Badge>
                    )}
                  </TableCell>

                  <TableCell className="flex gap-1">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/user/${user.id}/edit`}>Ред.</Link>
                    </Button>
                    <DeleteModal
                      id={user.id}
                      onDelete={deleteHandler}
                      isLoading={loadingDeleteUser}
                      text="пользователя"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
export default UserListAdmin;
