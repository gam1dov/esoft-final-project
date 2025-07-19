import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const DEAL_DATE = new Date("2025-07-22");

const calculateRemainingTime = (date: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(date) - Number(currentTime), 0);

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DiscountProduct = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateRemainingTime>>();

  useEffect(() => {
    setTime(calculateRemainingTime(DEAL_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateRemainingTime(DEAL_DATE);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Загрузка...</h3>
        </div>
      </section>
    );
  }

  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20 ">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Срок действия акции прошел!</h3>
          <p>
            Акция больше не доступна! Ознакомтесь с нашими последними акциями!
          </p>

          <div className="text-center">
            <Button asChild>
              <Link to="/search">См. ассортимент</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <img src="/promotion.jpg" alt="promotion" width={300} height={200} />
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20 ">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Товар месяца</h3>
        <p>
          Готовьтесь к шопингу нового уровня! Только этот месяц — особенные
          бонусы к каждой покупке и эксклюзивные условия. Время умных покупок и
          невероятных выгод. Успейте воспользоваться!
        </p>
        <ul className="grid grid-cols-4">
          <Statistics label="День" value={time.days} />
          <Statistics label="Часа" value={time.hours} />
          <Statistics label="Минут" value={time.minutes} />
          <Statistics label="Секунд" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link to="/search">См. ассортимент</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <img src="/promotion.jpg" alt="promotion" width={300} height={200} />
      </div>
    </section>
  );
};

const Statistics = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
);

export default DiscountProduct;
