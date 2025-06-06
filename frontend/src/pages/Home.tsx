import dummy_data from "../../products";
import ProductList from "../components/shared/Product/ProductList";

const HomePage = () => {
  return (
    <>
      <ProductList
        data={dummy_data.products}
        title="Новое поступление"
        limit={4}
      />
    </>
  );
};
export default HomePage;
