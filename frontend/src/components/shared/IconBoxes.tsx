import { Headset, RussianRuble, ShoppingCart, WalletCards } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingCart />
            <div className="text-sm font-bold">Бесплатная доставка</div>
            <div className="text-sm text-muted-foreground">
              Бесплатная доставка при заказе свыше 1000 рублей.
            </div>
          </div>
          <div className="space-y-2">
            <RussianRuble />
            <div className="text-sm font-bold">Гарантия возврата денег</div>
            <div className="text-sm text-muted-foreground">
              В течение 14 дней с момента покупки.
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards />
            <div className="text-sm font-bold">Безналичная оплата</div>
            <div className="text-sm text-muted-foreground">
              Оплата безналичным способом или наличными при доставке заказа.
            </div>
          </div>
          <div className="space-y-2">
            <Headset />
            <div className="text-sm font-bold">Круглосуточная поддержка</div>
            <div className="text-sm text-muted-foreground">
              Получите поддержку в любое время.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default IconBoxes;
