import { Link } from 'react-router-dom';
import { AiOutlineComment, AiOutlineEye, AiOutlineLike } from 'react-icons/ai';

import { BoardItem as BItem } from '../../modules/board/type';
import { displayedAt, getBoardCatText, getDateText } from '../../utils/dateUtils';

function BoardItem({
  board,
  categoryParam,
  isLastBoard,
}: {
  board: BItem;
  categoryParam: string;
  isLastBoard: Boolean;
}) {
  return (
    <li
      key={board.boardId}
      className={`w-full flex items-center py-3 font-light hover:bg-gray-2 transition-all
        ${isLastBoard ? '' : 'border-b'} 
      `}
    >
      <p className="w-1/12 text-center text-gray-4 hidden md:block">{board.boardId}</p>
      <Link
        to={`/board/${board.boardId}`}
        state={{ state: board.boardId }}
        className="cursor-pointer w-5/12 md:w-4/12 font-normal text-sm md:text-base"
      >
        <span className="font-medium">
          {!categoryParam ? `[${getBoardCatText(board.category)}]` : ''}{' '}
        </span>
        {board.boardTitle}
      </Link>
      <p className="cursor-pointer w-2/12 text-center text-xs md:text-base">{board.writer}</p>
      <p className="w-2/12 text-center tracking-tighter text-gray-4 text-xs md:text-base">
        <span className="hidden md:block">{getDateText(board.createDate)}</span>
        <span className="block md:hidden">{displayedAt(new Date(board.createDate).getTime())}</span>
      </p>
      <p className="w-1/12 flex items-center justify-center text-xs md:text-base">
        <AiOutlineComment className="hidden md:block" color="#6BCB77" size={15} />{' '}
        <span className="md:ml-1 text-jghd-green md:text-gray-4">{board.commentCount}</span>
      </p>
      <p className="w-1/12 flex items-center justify-center text-xs md:text-base">
        <AiOutlineEye className="hidden md:block" color="#ff8787" size={15} />{' '}
        <span className="md:ml-1 text-jghd-red md:text-gray-4">{board.viewCount}</span>
      </p>
      <p className="w-1/12 flex items-center justify-center text-xs md:text-base">
        <AiOutlineLike className="hidden md:block" color="#4D96FF" size={15} />{' '}
        <span className="md:ml-1 text-jghd-blue md:text-gray-4">{board.likeCount}</span>
      </p>
    </li>
  );
}

export default BoardItem;
