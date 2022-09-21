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
}: {
  currentPage: number;
  endPage: number;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const pageListState = useMemo(() => {
    const pages = 10;
    let ret = Array.from(
      { length: pages },
      (_, i) => currentPage + i - 2
    ).filter((x) => x > 0 && x <= endPage);
    if (ret.length === pages) return ret;
    if (ret[0] === 1)
      return Array.from({ length: Math.min(pages, endPage) }, (_, i) => i + 1);
    return Array.from(
      { length: pages },
      (_, i) => endPage - pages + i + 1
    ).filter((x) => x > 0);
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
      <ul className="flex items-center px-2 ">
        <li onClick={onBackward} className="cursor-pointer px-2">
          <AiOutlineBackward />
        </li>
        <li onClick={onPrevious} className="cursor-pointer px-2">
          <AiOutlineCaretLeft />
        </li>
        {pageListState.map((num, i) => (
          <li
            onClick={() => onPageChange(num)}
            key={i}
            className={`cursor-pointer mx-2 px-2 rounded-md ${
              currentPage === num ? 'bg-jghd-green text-white font-medium' : ''
            }`}
          >
            {num}
          </li>
        ))}
        <li onClick={onNext} className="cursor-pointer px-2">
          <AiOutlineCaretRight />
        </li>
        <li onClick={onForward} className="cursor-pointer px-2">
          <AiOutlineForward />
        </li>
      </ul>
    </nav>
  );
};

export default PageList;
