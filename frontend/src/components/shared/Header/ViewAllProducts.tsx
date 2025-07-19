import { Button } from "../../ui/button";
import { Link } from "react-router-dom";

const ViewAllProducts = () => {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link to="/search">См. весь ассортимент</Link>
      </Button>
    </div>
  );
};
export default ViewAllProducts;
