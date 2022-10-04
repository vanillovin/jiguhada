import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { useQuery } from 'react-query';
import { getCommentRequest } from '../../modules/board/api';
import { getDateText } from '../../utils';

export default function CommentList({ id }: { id: string }) {
  const { data } = useQuery(['Comment'], () => getCommentRequest(+id));
  // console.log('CommentList data', data);

  return (
    <ul>
      {data?.commentList.map((cmt) => (
        <li key={cmt.commentId} className="flex flex-col items-start py-1 px-1">
          <div className="flex mb-1">
            <div className="w-8 h-8 mt-1 mr-2">
              <img src={cmt.userImg} className="w-full h-full rounded-full" />
            </div>
            <div className="flex-1">
              <div className="flex items-center text-xs md:text-sm font-medium">
                {cmt.nickname}
                <span className="ml-1 text-gray-3 text-2xs md:text-xs">
                  {getDateText(cmt.commentCreateDate)}
                </span>
                <button className="ml-2 text-gray-4">
                  <BiDotsHorizontalRounded size={20} />
                </button>
              </div>
              <p className="text-xs md:text-sm">{cmt.commentContent}</p>
            </div>
          </div>
          {/* {cmt.childComment.length > 0 && (
            <div className="flex items-center ml-2 text-gray-4">
              <div className="cine" />
              <button className="text-xs md:text-sm">
                답글 보기({cmt.childComment.length}개)
              </button>
            </div>
          )} */}
        </li>
      ))}
    </ul>
  );
}
