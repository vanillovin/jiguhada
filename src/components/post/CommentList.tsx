import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getCommentsRequest } from '../../modules/board/api';
import { ICommentList } from '../../modules/board/type';
import { currentUserState } from '../../modules/user/atom';
import Error from '../Error';
import Loading from '../Loading';
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
  } = useInfiniteQuery<ICommentList, { message: string }>(
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

  return status === 'loading' ? (
    <Loading />
  ) : status === 'error' ? (
    <Error message={error.message.split('-')[1]} />
  ) : (
    <div className="overflow-y-auto cmt">
      <div className="font-medium text-sm md:text-base py-2 px-3">
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
        <button
          onClick={fetchNextPage}
          className="font-medium my-1 mx-3 text-sm md:text-base"
        >
          댓글 더 보기
        </button>
      ) : (
        data?.pageParams.length > 1 && (
          <p className="font-medium text-gray-4 my-1 mx-3 text-sm md:text-base">
            마지막 댓글입니다
          </p>
        )
      )}
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </div>
  );
}
