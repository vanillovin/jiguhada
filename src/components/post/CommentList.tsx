import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getCommentsRequest } from '../../modules/board/api';
import { currentUserState } from '../../modules/user/atom';
import CommentItem from './CommentItem';

export default function CommentList({ id }: { id: string }) {
  const currentUser = useRecoilValue(currentUserState);
  const fetchComments = (page: number) => getCommentsRequest(+id, page);

  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    status,
    error,
  } = useInfiniteQuery(
    ['CommentList', id],
    ({ pageParam = 1 }) => fetchComments(pageParam),
    {
      refetchOnWindowFocus: false,
      // keepPreviousData: true,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.currentPage < lastPage.totalPage ? nextPage : undefined;
      },
    }
  );

  // console.log(data);

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="h-full overflow-y-auto cmt">
      <div className="font-medium text-sm md:text-base p-3">
        댓글수 {data?.pages[0].totalCommentCount}개
      </div>
      <ul>
        {data?.pages.map((page) =>
          page.commentList.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              currentUser={currentUser}
              refetch={refetch}
            />
          ))
        )}
      </ul>
      {hasNextPage ? (
        <button className="font-medium m-1 text-sm md:text-base" onClick={fetchNextPage}>
          댓글 더 보기
        </button>
      ) : (
        data?.pageParams.length > 1 && (
          <p className="font-medium text-gray-4 m-1 text-sm md:text-base">
            마지막 댓글입니다
          </p>
        )
      )}
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  );
}
