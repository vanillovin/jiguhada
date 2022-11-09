import React, { useRef } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import useToggle from '../../hooks/useToggle';
import { deleteCommentRequest } from '../../modules/board/api';
import { Comment } from '../../modules/board/type';
import { ICurrentUser } from '../../modules/user/type';
import { getDateText } from '../../utils';

interface CommentProps {
  comment: Comment;
  currentUser: ICurrentUser | null;
  refetch: (opt: any) => void;
}

export default function CommentItem({ comment, currentUser, refetch }: CommentProps) {
  const toggleRef = useRef() as React.RefObject<HTMLDivElement>;
  const { toggle, onToggleChange } = useToggle(toggleRef);

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
  );
}
