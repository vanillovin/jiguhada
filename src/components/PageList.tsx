import { useMemo } from 'react';
import {
  AiOutlineBackward,
  AiOutlineCaretLeft,
  AiOutlineCaretRight,
  AiOutlineForward,
} from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';

const PageList = ({
  currentPage,
  endPage,
  color = 'green',
}: {
  currentPage: number;
  endPage: number;
  color?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const pageListState = useMemo(() => {
    const pages = 10;
    let ret = Array.from({ length: pages }, (_, i) => currentPage + i - 2).filter(
      (x) => x > 0 && x <= endPage
    );
    if (ret.length === pages) return ret;
    if (ret[0] === 1)
      return Array.from({ length: Math.min(pages, endPage) }, (_, i) => i + 1);
    return Array.from({ length: pages }, (_, i) => endPage - pages + i + 1).filter(
      (x) => x > 0
    );
  }, [currentPage, endPage]);

  const onChangePageSearchParams = (value: string) => {
    searchParams.set('page', value);
  };

  const onBackward = () => {
    onChangePageSearchParams(String(1));
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const onPrevious = () => {
    onChangePageSearchParams(String(Math.max(1, currentPage - 1)));
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const onPageChange = (num: number) => {
    onChangePageSearchParams(String(num));
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const onNext = () => {
    onChangePageSearchParams(String(Math.min(endPage, currentPage + 1)));
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const onForward = () => {
    onChangePageSearchParams(String(endPage));
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <nav className="w-full flex items-center justify-center select-none">
      <ul className="flex items-center px-2">
        {endPage > 1 && currentPage > 1 && (
          <li onClick={onBackward} className="pBtn">
            <AiOutlineBackward size={18} />
          </li>
        )}
        {currentPage > 1 && (
          <li onClick={onPrevious} className="pBtn ml-1 md:ml-2">
            <AiOutlineCaretLeft />
          </li>
        )}
        {pageListState.map((num, i) => (
          <li
            onClick={() => onPageChange(num)}
            key={i}
            className={`pBtn mx-1 md:mx-2 ${
              currentPage === num
                ? `bg-jghd-${color} text-white font-medium hover:text-white`
                : ''
            }`}
          >
            {num}
          </li>
        ))}
        {currentPage < endPage && (
          <li onClick={onNext} className="pBtn mr-1 md:mr-2">
            <AiOutlineCaretRight />
          </li>
        )}
        {endPage > 1 && currentPage < endPage && (
          <li onClick={onForward} className="pBtn">
            <AiOutlineForward size={18} />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default PageList;
