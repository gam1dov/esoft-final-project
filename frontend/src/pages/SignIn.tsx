import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import Logo from "../components/shared/Logo";
import CredentialsSignInForm from "../components/shared/SignIn/credentialsSigninForm";

const SignIn = () => {
  return (
    <div className="flex-center min-h-screen w-full">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-4">
            <Link to="/" className="flex-center">
              <Logo className={"w-[80px] h-[80px]"} />
            </Link>
            <CardTitle className="text-center">Вход</CardTitle>
            <CardDescription className="text-center">
              Войдите в ваш аккаунт
            </CardDescription>
            <CardContent className="space-y-4">
              <CredentialsSignInForm />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
export default SignIn;
