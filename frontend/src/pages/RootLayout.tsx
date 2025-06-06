import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import Header from "../components/shared/Header/Header";

const RootLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default RootLayout;
