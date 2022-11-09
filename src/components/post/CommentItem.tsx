import React, { useRef, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from 'react-query';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';
import { createPostCommentRequest, deleteCommentRequest } from '../../modules/board/api';
import { Comment, CommentList } from '../../modules/board/type';
import { ICurrentUser } from '../../modules/user/type';
import { getDateText } from '../../utils';

interface CommentProps {
  comment: Comment;
  currentUser: ICurrentUser | null;
  // refetchPage: (page: TData, index: number, allPages: TData[]) => boolean;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<InfiniteData<CommentList>, unknown>>;
}

export default function CommentItem({ comment, currentUser, refetch }: CommentProps) {
  const toggleRef = useRef() as React.RefObject<HTMLDivElement>;
  const { toggle, onToggleChange } = useToggle(toggleRef);
  const [edit, setEdit] = useState(false);
  const {
    value: content,
    onChangeValue,
    onClearValue,
  } = useInput(comment.commentContent);

  const handleDeleteComment = () => {
    if (!currentUser) {
      return;
    }
    deleteCommentRequest(currentUser?.accessToken, comment.commentId)
      .then((res) => {
        console.log('delComment res', res);
        refetch({ refetchPage: (page, index) => index === 0 });
      })
      .catch((err) => {
        console.log('delComment err', err);
      });
  };

  const handleCreateComment = () => {
    if (!currentUser) {
      return;
    }
    setEdit(false);
    createPostCommentRequest(currentUser?.accessToken, {
      boardId: comment.boardId,
      content,
    })
      .then((res) => {
        console.log('handleCreateComment res', res);
        refetch({ refetchPage: (page, index) => index === 0 });
      })
      .catch((err) => {
        console.log('handleCreateComment err', err);
      });
  };

  return (
    <li key={comment.commentId} className="flex items-start px-3 py-2">
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
                  <button
                    className="w-full flex items-center cursor-pointer py-1 px-3"
                    onClick={() => setEdit((prev) => !prev)}
                  >
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
        {!edit ? (
          <p className="text-xs md:text-sm">{comment.commentContent}</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateComment();
            }}
          >
            <input
              value={content}
              onChange={onChangeValue}
              className="outline-none border w-full p-2 text-xs md:text-sm"
            />
            <div className="w-full text-end mt-1">
              <button
                type="button"
                className="bg-red-100 px-1 rounded-sm mr-1"
                onClick={() => setEdit(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="bg-gray-200 px-1 rounded-sm"
                onClick={handleCreateComment}
              >
                확인
              </button>
            </div>
          </form>
        )}
      </div>
    </li>
  );
}
