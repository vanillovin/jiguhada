import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { useInfiniteQuery } from 'react-query';
import { getCommentsRequest } from '../../modules/board/api';
import { getDateText } from '../../utils';

export default function CommentList({ id }: { id: string }) {
  const fetchComments = (page: number) => getCommentsRequest(+id, page);

  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery(
      ['CommentList', id],
      ({ pageParam = 1 }) => fetchComments(pageParam),
      {
        // keepPreviousData: true,
        getNextPageParam: (lastPage, allPages) => {
          // console.log('getNextPageParam:', lastPage, allPages);
          const nextPage = allPages.length + 1;
          return lastPage.currentPage < lastPage.totalPage
            ? nextPage
            : undefined;
        },
      }
    );

  return (
    <div>
      <ul>
        {data?.pages.map((page) =>
          page.commentList.map((comment) => (
            <li
              key={comment.commentId}
              className="flex flex-col items-start py-1 px-1"
            >
              <div className="flex mb-1">
                <div className="w-8 h-8 mt-1 mr-2">
                  <img
                    src={comment.userImg}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center text-xs md:text-sm font-medium">
                    {comment.nickname}
                    <span className="ml-1 text-gray-3 text-2xs md:text-xs">
                      {getDateText(comment.commentCreateDate)}
                    </span>
                    <button className="ml-2 text-gray-4">
                      <BiDotsHorizontalRounded size={20} />
                    </button>
                  </div>
                  <p className="text-xs md:text-sm">{comment.commentContent}</p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      {hasNextPage ? (
        <button
          className="font-medium m-1 text-sm md:text-base"
          onClick={fetchNextPage}
        >
          댓글 더 보기
        </button>
      ) : (
        <p className="font-medium text-gray-4 m-1 text-sm md:text-base">
          마지막 댓글입니다
        </p>
      )}
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  );
}
