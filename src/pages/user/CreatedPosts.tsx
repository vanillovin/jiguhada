import { Link } from 'react-router-dom';

import { getBoardCatText, getDateText } from '../../utils/dateUtils';

export default function CreatedPosts() {
  const posts = getCreatedPosts();

  return (
    <section className="w-full min-h-screen">
      <h2 className="font-semibold text-xl">작성한 게시글</h2>
      <ul className="w-full mt-4 mx-1 border rounded-sm shadow-sm">
        {posts.map((post, idx) => (
          <li
            key={idx}
            className="w-full border-b last:border-b-0 hover:bg-jghd-blue/20 transition-colors"
          >
            <Link
              to={`/board/${post.boardId}`}
              className="w-full flex items-center justify-between px-3 py-2"
            >
              <div>
                [{getBoardCatText(post.boardCategory)}]{' '}
                <span className="font-medium">{post.title}</span>
              </div>
              <div className="text-sm text-gray-5">{getDateText(post.createDate)}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
