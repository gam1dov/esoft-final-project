import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";
import CheckoutSteps from "../components/shared/CheckoutSteps";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ArrowRight } from "lucide-react";
import { Label } from "../components/ui/label";

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState("Наличный расчет");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }

  return (
    <>
      <CheckoutSteps current={2} />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Способ оплаты</h1>
        <p className="text-base text-muted-foreground">
          Пожалуйста выберите способ оплаты
        </p>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="flex flex-col md:flex-row gap-5">
            <RadioGroup
              className="flex flex-col space-y-2"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Наличный расчет" id="cash" />
                <Label htmlFor="cash" className="font-normal">
                  Наличный расчет
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Безналичный расчет" id="cashless" />
                <Label htmlFor="cashless" className="font-normal">
                  Безналичный расчет
                </Label>
              </div>
            </RadioGroup>
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
export default Payment;
