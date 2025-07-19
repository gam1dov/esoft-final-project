import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import OrderDetails from "./pages/OrderDetails";
import Private from "./components/shared/PrivateRoute";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Admin from "./components/shared/Admin/Admin";
import OrderListAdmin from "./pages/admin/OrderListAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import OverviewAdmin from "./pages/admin/OverviewAdmin";
import ProductListAdmin from "./pages/admin/ProductListAdmin";
import ProductEditAdmin from "./pages/admin/ProductEditAdmin";
import UserListAdmin from "./pages/admin/UserListAdmin";
import UserEditAdmin from "./pages/admin/UserEditAdmin";
import SearchPage from "./pages/SearchPage";
import ProductCreateAdmin from "./pages/admin/ProductCreateAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "product/:productId", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      {
        element: <Private />,
        children: [
          { path: "/shipping", element: <Shipping /> },
          { path: "/payment", element: <Payment /> },
          { path: "/placeorder", element: <PlaceOrder /> },
          { path: "/order/:id", element: <OrderDetails /> },
          { path: "/profile", element: <Profile /> },
          { path: "/myorders", element: <MyOrders /> },
          { path: "/myorders/:pageNumber", element: <MyOrders /> },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <Admin>
        <AdminLayout />
      </Admin>
    ),
    children: [
      { index: true, element: <OverviewAdmin /> },
      { path: "overview", element: <OverviewAdmin /> },
      { path: "orderlist", element: <OrderListAdmin /> },
      { path: "orderlist/:pageNumber", element: <OrderListAdmin /> },
      { path: "productlist", element: <ProductListAdmin /> },
      { path: "productlist/create", element: <ProductCreateAdmin /> },
      { path: "productlist/:pageNumber", element: <ProductListAdmin /> },
      { path: "product/:id/edit", element: <ProductEditAdmin /> },
      { path: "userlist", element: <UserListAdmin /> },
      { path: "user/:id/edit", element: <UserEditAdmin /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};
export default App;
