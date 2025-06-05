import dummy_data from "../../../../products";
import ProductList from "../Product/ProductList";

const Homepage = () => {
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
export default Homepage;
