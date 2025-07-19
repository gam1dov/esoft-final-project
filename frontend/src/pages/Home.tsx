import ProductList from "../components/shared/Product/ProductList";
import Loader from "../components/shared/Loader";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import ProductCarousel from "../components/shared/Product/ProductCarousel";
import ViewAllProducts from "../components/shared/Header/ViewAllProducts";
import IconBoxes from "../components/shared/IconBoxes";
import DiscountProduct from "../components/shared/DiscountProduct";

const HomePage = () => {
  const { pageNumber, keyword } = useParams();
  const { data, error, isLoading } = useGetProductsQuery({
    keyword,
    pageNumber: Number(pageNumber) || 1,
  });

  if (isLoading) return <Loader />;
  if (error) {
    const errorMessage =
      (error as { data?: { message?: string } })?.data?.message ||
      (error as { message?: string })?.message ||
      "Неизвестная ошибка";
    return <div>{errorMessage}</div>;
  }

  return (
    <>
      <ProductCarousel />
      <ProductList
        data={data?.products || []}
        title="Новое поступление"
        limit={4}
      />
      <ViewAllProducts />
      <DiscountProduct />
      <IconBoxes />
    </>
  );
};
export default HomePage;
