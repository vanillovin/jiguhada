import { AiOutlineComment, AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { BoardItem as BItem } from '../../modules/board/type';
import { getBoardCatText, getDateText } from '../../utils';

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
      className={`${
        isLastBoard ? '' : 'border-b'
      } w-full flex items-center py-3 text-sm md:text-base font-light`}
    >
      <p className="w-1/12 text-center text-gray-4">{board.boardId}</p>
      <p className="w-4/12 font-normal">
        {!categoryParam ? `[${getBoardCatText(board.category)}]` : ''}{' '}
        {board.boardTitle}
      </p>
      <p className="w-2/12 text-center">{board.writer}</p>
      <p className="w-2/12 text-center tracking-tighter text-gray-4">
        {getDateText(board.createDate)}
      </p>
      <p className="w-1/12 flex items-center justify-center">
        <AiOutlineComment color="#6BCB77" size={15} />{' '}
        <span className="ml-1 text-gray-4">{board.commentCount}</span>
      </p>
      <p className="w-1/12 flex items-center justify-center">
        <AiOutlineEye color="#ff8787" size={15} />{' '}
        <span className="ml-1 text-gray-4">{board.likeCount}</span>
      </p>
      <p className="w-1/12 flex items-center justify-center">
        <AiOutlineLike color="#4D96FF" size={15} />{' '}
        <span className="ml-1 text-gray-4">{board.viewCount}</span>
      </p>
    </li>
  );
}

export default BoardItem;
