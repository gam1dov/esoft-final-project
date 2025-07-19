import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type DeleteModalProps = {
  id: string;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  text: string;
};

const DeleteModal = ({ id, onDelete, isLoading, text }: DeleteModalProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className="ml-2">
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {`Вы уверены, что хотите удалить ${text}?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Удаление не может быть отменено!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={() => onDelete(id)}
          >
            {isLoading ? "Удаление..." : "Удалить"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteModal;
