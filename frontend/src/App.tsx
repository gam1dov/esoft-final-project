import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <HomePage /> }],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
