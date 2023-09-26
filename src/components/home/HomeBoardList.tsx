import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import { Order } from '../../modules/board/type';
import { getBoardList } from '../../modules/board/api';
import { displayedAt, getBoardCatText } from '../../utils/dateUtils';

function HomeBoardList({ order }: { order: Order }): JSX.Element {
  const { data } = useQuery(['HomeBoard', order], () => getBoardList({ order }));

  return (
    <ul className="mt-1">
      {data?.boardItemList.slice(0, 10).map((item, i) => (
        <li
          key={item.boardId}
          className={`cursor-pointer h-8 px-1 ${
            i === 9 ? 'border-0' : 'border-b'
          } hover:bg-gray-100  transition-all flex items-center justify-between`}
        >
          <Link to={`board/${item.boardId}`}>
            <h4 className="text-sm md:text-base truncate flex-1">
              <span className="mr-1 font-medium">[{getBoardCatText(item.category)}]</span>
              <span>{item.boardTitle}</span>
            </h4>
            <h5 className="text-2xs md:text-xs text-gray-4 w-14 text-end">
              <span>{displayedAt(new Date(item.createDate).getTime())}</span>
              {/* <span className="font-medium ml-1 text-gray-5">{item.writer}</span> */}
            </h5>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default HomeBoardList;
