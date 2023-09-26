import { Link } from 'react-router-dom';

import { getBoardCatText, getDateText } from '../../utils/dateUtils';

export default function CreatedComments() {
  const comments = getCreatedComments();

  return (
    <section className="w-full min-h-screen">
      <h2 className="font-semibold text-xl">작성한 게시글</h2>
      <ul className="w-full mt-4 mx-1 border rounded-sm shadow-sm">
        {comments.map((comment, idx) => (
          <li
            key={idx}
            className="w-full border-b last:border-b-0 hover:bg-jghd-blue/20 transition-colors"
          >
            <Link
              to={`/board/${comment.boardId}`}
              className="w-full flex items-center justify-between px-3 py-2"
            >
              <div className="">
                <div className="">
                  [{getBoardCatText(comment.boardCategory)}]{' '}
                  <span className="font-medium">{comment.boardTitle}</span>
                </div>
                <div className="text-gray-4">{comment.commentContent}</div>
              </div>
              <div className="text-sm text-gray-5">{getDateText(comment.commentCreateDate)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
