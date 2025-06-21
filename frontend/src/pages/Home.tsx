import ProductList from "../components/shared/Product/ProductList";
import Loader from "../components/shared/Loader";
import { useGetProductsQuery } from "../slices/productsApiSlice";

const HomePage = () => {
  const { data: products = [], error, isLoading } = useGetProductsQuery();

  if (isLoading) return <Loader />;
  if (error) {
    const errorMessage =
      (error as { data?: { message?: string } })?.data?.message ||
      (error as { message?: string })?.message ||
      "Unknown error";
    return <div>{errorMessage}</div>;
  }

  return (
    <>
      <ProductList data={products} title="Новое поступление" limit={4} />
    </>
  );
};
export default HomePage;
