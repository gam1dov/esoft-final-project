import { useEffect, useState, type ReactNode } from "react";
import { type Product } from "../../types/index";
import ProductList from "../components/shared/Product/ProductList";

const HomePage = () => {
  const [fetchedProducts, setProducts] = useState<Product[]>();

  useEffect(() => {
    async function getData() {
      const response = await fetch("http://localhost:5000/api/products");

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const products: Product[] = await response.json();
      setProducts(products);
    }
    getData();
  }, []);

  let content: ReactNode;

  if (fetchedProducts) {
    content = (
      <ProductList data={fetchedProducts} title="Новое поступление" limit={4} />
    );
  }

  return <>{content}</>;
};
export default HomePage;
