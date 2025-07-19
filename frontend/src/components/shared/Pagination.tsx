import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type PaginationProps = {
  currentPage: number | string;
  totalPages: number;
  basePath: string;
};

const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  const navigate = useNavigate();
  const current = Number(currentPage);

  const handlePrev = () => {
    const prevPage = current - 1;
    navigate(prevPage === 1 ? basePath : `${basePath}/${prevPage}`);
  };

  const handleNext = () => {
    navigate(`${basePath}/${current + 1}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={current <= 1}
        onClick={handlePrev}
      >
        Предыдущая
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        disabled={current >= totalPages}
        onClick={handleNext}
      >
        Следующая
      </Button>
    </div>
  );
};

export default Pagination;
