import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const CredentialsSignInForm = () => {
  return (
    <form>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="mb-2">
            Электронный адрес
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue=""
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2">
            Пароль
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue=""
          />
        </div>
        <div>
          <Button className="w-full" variant="default">
            Войти
          </Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
          Вы еще не зарегистрированы?{" "}
          <Link to="/sign-up" className="font-medium">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </form>
  );
};
export default CredentialsSignInForm;
