import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/SignIn";
import Cart from "./pages/Cart";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:productId", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
  { path: "/sign-in", element: <SignIn /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
