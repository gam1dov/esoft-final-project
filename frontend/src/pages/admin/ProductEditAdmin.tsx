import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import { toast } from "sonner";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

const ProductEditAdmin = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | null>(0);
  const [images, setImages] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState<number | null>(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId!);

  const [updateProduct, { isLoading: loadingUpdateProduct }] =
    useUpdateProductMutation();

  const [uploadProductImage] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImages(product.images || []);
      setBrand(product.brand);
      setCategory(product.category);
      setStock(product.stock);
      setDescription(product.description);
    }
  }, [product]);

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !price || !category) {
      toast.error("Пожалуйста, заполните все обязательные поля", {
        style: {
          background: "#fff0f0",
          color: "#ff0000",
          border: "1px solid #ffcccc",
        },
      });
      return;
    }

    try {
      await updateProduct({
        id: productId as string,
        name,
        price,
        images,
        brand,
        category,
        stock,
        description,
      }).unwrap();
      toast.success("Товар успешно обновлен");
      refetch();
      navigate("/admin/productlist");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при обновлении товара: ${error.message}`, {
          style: {
            background: "#fff0f0",
            color: "#ff0000",
            border: "1px solid #ffcccc",
          },
        });
      } else {
        toast.error("Неизвестная ошибка при обновлении товара", {
          style: {
            background: "#fff0f0",
            color: "#ff0000",
            border: "1px solid #ffcccc",
          },
        });
      }
    }
  }

  async function uploadHandlerFunction(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      toast.error("Выберите файлы для загрузки");
      return;
    }
    const files = Array.from(e.target.files).slice(0, 2);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const response = await uploadProductImage(formData).unwrap();
      setImages(response.images);
      toast("Фотографии загружены успешно");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Не получилось загрузить фотографии", {
          style: {
            background: "#fff0f0",
            color: "#ff0000",
            border: "1px solid #ffcccc",
          },
        });
      } else {
        throw new Error("Неизвестная ошибка!");
      }
    }
  }
  return (
    <>
      <Button asChild variant="secondary" size="sm">
        <Link to={`/admin/productlist`}> Назад</Link>
      </Button>

      <div className="space-y-8 max-w-5xl mx-auto">
        <h1 className="h2-bold">Обновить сведения о товаре</h1>
        {isLoading && <Loader />}
        {error && <div>Не удалось загрузить информацию о товаре</div>}
        <form className="space-y-8" onSubmit={submitHandler}>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <Label htmlFor="name" className="mb-2">
                Наименование
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите наименование товара"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="category" className="mb-2">
                Категория
              </Label>
              <Input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Введите категорию"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <Label htmlFor="brand" className="mb-2">
                Бренд
              </Label>
              <Input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Введите наименование бренда"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="price" className="mb-2">
                Цена
              </Label>
              <Input
                id="price"
                type="number"
                value={price === null ? "" : price}
                onChange={(e) =>
                  setPrice(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="Введите цену"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <Label htmlFor="stock" className="mb-2">
                Наличие
              </Label>
              <Input
                id="stock"
                type="number"
                value={stock === null ? "" : stock}
                onChange={(e) =>
                  setStock(
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                placeholder="Введите количество"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="images" className="mb-2">
                Фотографии (макс. 2)
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={uploadHandlerFunction}
              />
            </div>
          </div>

          <div className="w-full">
            <Label htmlFor="description" className="mb-2">
              Описание товара
            </Label>
            <Textarea
              id="description"
              placeholder="Введите описание товара"
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Button type="submit" size="lg" disabled={loadingUpdateProduct}>
              {loadingUpdateProduct
                ? "Загрузка..."
                : "Обновить информацию о товаре"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
export default ProductEditAdmin;
