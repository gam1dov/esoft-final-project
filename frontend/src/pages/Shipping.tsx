import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import CheckoutSteps from "../components/shared/CheckoutSteps";

const Shipping = () => {
  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, country }));
    navigate("/payment");
  }

  return (
    <>
      <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Адрес доставки</h1>
        <p className="text-base text-muted-foreground">
          Пожалуйста введите адрес для доставки
        </p>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <Label htmlFor="name" className="mb-2">
                Адрес
              </Label>
              <Input
                type="text"
                value={address}
                placeholder="Введите ваш адрес"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <Label htmlFor="city" className="mb-2">
                Город
              </Label>
              <Input
                type="text"
                placeholder="Введите ваш город"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <Label htmlFor="country" className="mb-2">
                Страна
              </Label>
              <Input
                type="text"
                placeholder="Введите вашу страну"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              <ArrowRight className="w-4 h-4" />
              Продолжить
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Shipping;
