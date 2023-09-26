import React from 'react';
import { useRecoilValue } from 'recoil';

import useInput from '../../hooks/useInput';
import { currentUserState } from '../../modules/user/atom';
import { useCreatePostComment } from '../../hooks/queries/post';

function CommentForm({ boardId, goToLogin }: { boardId: number; goToLogin: () => void }) {
  const currentUser = useRecoilValue(currentUserState);
  const { mutate: createPostComment } = useCreatePostComment();
  const { value: content, onChangeValue } = useInput('');

  const handleCreateComment = (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentUser) {
      goToLogin();
      return;
    }
    if (content.trim().length < 2) {
      alert('댓글은 2자 이상 입력해 주세요!');
      return;
    }
    createPostComment({
      token: currentUser.accessToken,
      data: { boardId, content },
    });
  };

  return (
    <form className="flex items-center border-t flex-1" onSubmit={handleCreateComment}>
      <input
        value={content}
        onChange={onChangeValue}
        id="comment"
        name="content"
        className="outline-none flex-1 h-full p-3"
      />
      <button
        type="submit"
        disabled={content.trim().length <= 2}
        onClick={handleCreateComment}
        className={`py-1 px-3 h-full ${true ? 'text-jghd-green' : ''}`}
      >
        입력
      </button>
    </form>
  );
}

export default CommentForm;
