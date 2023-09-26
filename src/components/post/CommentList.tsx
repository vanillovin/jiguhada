import { useRecoilValue } from 'recoil';
import { useInfiniteQuery } from 'react-query';

import Error from '../Error';
import Loading from '../Loading';
import CommentItem from './CommentItem';
import { ICommentList } from '../../modules/board/type';
import { getPostCommentList } from '../../modules/board/api';
import { currentUserState } from '../../modules/user/atom';

export default function CommentList({ postId }: { postId: number }) {
  const currentUser = useRecoilValue(currentUserState);
  const fetchPostCommentList = (page: number) => getPostCommentList({ postId, page });

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
    ['PostCommentList', postId],
    ({ pageParam = 1 }) => fetchPostCommentList(pageParam),
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
          onClick={() => fetchNextPage()}
          className="font-medium my-1 mx-3 text-sm md:text-base"
        >
          댓글 더 보기
        </button>
      ) : (
        data?.pageParams &&
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
