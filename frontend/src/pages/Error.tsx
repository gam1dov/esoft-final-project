import Logo from "../components/shared/Logo";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Logo className={"h-12 w-12"} />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Страница не найдена!</h1>
        <p className="text-destructive">
          Произошла ошибка! Невозможно найти страницу!
        </p>
        <Button asChild variant="secondary" className="mt-4 ml-2">
          <Link to="/">Назад</Link>
        </Button>
      </div>
    </div>
  );
};
export default ErrorPage;
