import { useState } from "react";
import { cn } from "../../../lib/utils";

const ProductImages = ({ images }: { images: string[] }) => {
  console.log(images);
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <img
        src={images[current]}
        alt="Product Image"
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              current === index && "border-orange-500"
            )}
          >
            <img src={image} alt="image" className="w-[100px] h-[100px]" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductImages;
