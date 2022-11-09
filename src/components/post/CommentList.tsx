import { useRef } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { useInfiniteQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import useToggle from '../../hooks/useToggle';
import { deleteCommentRequest, getCommentsRequest } from '../../modules/board/api';
import { currentUserState } from '../../modules/user/atom';
import { getDateText } from '../../utils';

export default function CommentList({ id }: { id: string }) {
  const toggleRef = useRef() as React.RefObject<HTMLDivElement>;
  const { toggle, onToggleChange } = useToggle(toggleRef);
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
      // keepPreviousData: true,
      getNextPageParam: (lastPage, allPages) => {
        // console.log('getNextPageParam:', lastPage, allPages);
        const nextPage = allPages.length + 1;
        return lastPage.currentPage < lastPage.totalPage ? nextPage : undefined;
      },
    }
  );

  const handleDeleteComment = (id: number) => {
    if (!currentUser) {
      return;
    }
    deleteCommentRequest(currentUser?.accessToken, id)
      .then((res) => {
        console.log('delComment res', res);
        refetch({ refetchPage: (page, index) => index === 0 });
      })
      .catch((err) => {
        console.log('delComment err', err);
      });
  };

  return status === 'loading' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className="h-full">
      <ul className="">
        {data?.pages.map((page) =>
          page.commentList.map((comment) => (
            <li key={comment.commentId} className="flex items-start py-1 px-1">
              <div className="w-8 h-8 mt-1 mr-2">
                <img src={comment.userImg} className="w-full h-full rounded-full" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs md:text-sm font-medium">
                  <div>
                    {comment.nickname}
                    <span className="ml-1 text-gray-4 text-2xs md:text-xs">
                      {getDateText(comment.commentCreateDate)}
                    </span>
                  </div>
                  {currentUser?.userid === comment.userId && (
                    <div className="relative" ref={toggleRef}>
                      <button onClick={onToggleChange}>
                        <BiDotsHorizontalRounded size={20} />
                      </button>
                      {toggle && (
                        <div className="absolute w-28 top-0 right-0 border rounded-lg shadow-md bg-white">
                          <button className="w-full flex items-center cursor-pointer py-1 px-3">
                            <HiOutlinePencilAlt className="mr-2" />
                            수정하기
                          </button>
                          <button
                            className="w-full flex items-center cursor-pointer py-1 px-3"
                            onClick={() => handleDeleteComment(comment.commentId)}
                          >
                            <HiOutlineTrash className="mr-2" />
                            삭제하기
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs md:text-sm">{comment.commentContent}</p>
              </div>
            </li>
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
