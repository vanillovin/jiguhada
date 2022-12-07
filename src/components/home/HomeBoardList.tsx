import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { getBoardList } from '../../modules/board/api';
import { Order } from '../../modules/board/type';
import { displayedAt, getBoardCatText } from '../../utils/date';

function HomeBoardList({ order }: { order: Order }): JSX.Element {
  const navigate = useNavigate();
  const { data } = useQuery(['HomeBoard', order], () => getBoardList({ order }));

  return (
    <ul className="mt-1">
      {data?.boardItemList.slice(0, 10).map((pb, i) => (
        <li
          key={pb.boardId}
          className={`cursor-pointer h-8 px-1 ${
            i === 9 ? 'border-0' : 'border-b'
          } hover:bg-gray-100  transition-all flex items-center justify-between`}
          onClick={() => navigate(`board/${pb.boardId}`)}
        >
          <h4 className="text-sm md:text-base truncate flex-1">
            <span className="mr-1 font-medium">[{getBoardCatText(pb.category)}]</span>
            <span>{pb.boardTitle}</span>
          </h4>
          <h5 className="text-2xs md:text-xs text-gray-4 w-14 text-end">
            <span>{displayedAt(new Date(pb.createDate).getTime())}</span>
            {/* <span className="font-medium ml-1 text-gray-5">{pb.writer}</span> */}
          </h5>
        </li>
      ))}
    </ul>
  );
}

export default HomeBoardList;
