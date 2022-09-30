import { AiOutlineComment, AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { BoardItem as BItem } from '../../modules/board/type';
import { displayedAt, getBoardCatText, getDateText } from '../../utils';

function BoardItem({
  board,
  categoryParam,
  isLastBoard,
}: {
  board: BItem;
  categoryParam: string;
  isLastBoard: Boolean;
}) {
  const navigate = useNavigate();
  return (
    <li
      onClick={() =>
        navigate(`/board/${board.boardId}`, { state: board.boardId })
      }
      key={board.boardId}
      className={`w-full cursor-pointer flex items-center py-3 font-light
        ${isLastBoard ? '' : 'border-b'} 
      `}
    >
      <p className="w-1/12 text-center text-gray-4 hidden md:block">
        {board.boardId}
      </p>
      <p className="w-5/12 md:w-4/12 font-normal text-sm md:text-base">
        {!categoryParam ? `[${getBoardCatText(board.category)}]` : ''}{' '}
        {board.boardTitle}
      </p>
      <p className="w-2/12 text-center text-xs md:text-base">{board.writer}</p>
      <p className="w-2/12 text-center tracking-tighter text-gray-4 text-xs md:text-base">
        <span className="hidden md:block">{getDateText(board.createDate)}</span>
        <span className="block md:hidden">
          {displayedAt(new Date(board.createDate).getTime())}
        </span>
      </p>
      <p className="w-1/12 flex items-center justify-center text-xs md:text-base">
        <AiOutlineComment
          className="hidden md:block"
          color="#6BCB77"
          size={15}
        />{' '}
        <span className="md:ml-1 text-jghd-green md:text-gray-4">
          {board.commentCount}
        </span>
      </p>
      <p className="w-1/12 flex items-center justify-center text-xs md:text-base">
        <AiOutlineEye className="hidden md:block" color="#ff8787" size={15} />{' '}
        <span className="md:ml-1 text-jghd-red md:text-gray-4">
          {board.viewCount}
        </span>
      </p>
      <p className="w-1/12 flex items-center justify-center text-xs md:text-base">
        <AiOutlineLike className="hidden md:block" color="#4D96FF" size={15} />{' '}
        <span className="md:ml-1 text-jghd-blue md:text-gray-4">
          {board.likeCount}
        </span>
      </p>
    </li>
  );
}

export default BoardItem;
