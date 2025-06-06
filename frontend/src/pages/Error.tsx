import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <h1>Произошла ошибка!</h1>
      <p>Невозможно найти страницу!</p>
      <Button asChild variant="link">
        <Link to="/">Назад</Link>
      </Button>
    </>
  );
};
export default ErrorPage;
