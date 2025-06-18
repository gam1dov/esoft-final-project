import { cn } from "../../../lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  return (
    <p className={cn("text-2xl", className)}>
      {Math.trunc(value)} <span className="text-xs"> руб.</span>
    </p>
  );
};
export default ProductPrice;
