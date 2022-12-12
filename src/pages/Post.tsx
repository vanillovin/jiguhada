import { useRef } from 'react';
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiBookmark } from 'react-icons/fi';
import { BsBookmarkFill } from 'react-icons/bs';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import { useRecoilValue } from 'recoil';

import { getBoardCatText, getDateText } from '../utils/date';
import { Category } from '../modules/board/type';
import { currentUserState } from '../modules/user/atom';
import useToggle from '../hooks/useToggle';
import CommentList from '../components/post/CommentList';
import Error from '../components/Error';
import {
  useCancelLikePost,
  useDeletePost,
  useGetPostLikeInfo,
  useGetPost,
  useLikePost,
} from '../hooks/queries/post';
import CommentForm from '../components/post/CommentForm';

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { data: post, error: postError } = useGetPost(Number(id));
  const { mutate: deletePost } = useDeletePost();
  const { mutate: likePost } = useLikePost();
  const { mutate: cancelLikePost } = useCancelLikePost();
  const { data: like } = useGetPostLikeInfo(Number(id));
  const toggleRef = useRef() as React.RefObject<HTMLDivElement>;
  const { toggle, onToggleChange } = useToggle(toggleRef);
  const currentUser = useRecoilValue(currentUserState);

  const goToEditPost = () => {
    navigate(`/board/${post?.boardId}/edit`, {
      state: {
        data: {
          boardId: post?.boardId,
          boardCategory: post?.boardCategory,
          title: post?.title,
          content: post?.content,
        },
      },
    });
  };

  const goToLogin = () => {
    if (confirm('로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?!')) {
      navigate('/register', { state: { path: `/board/${id}` } });
    }
  };

  const handleDeletePost = () => {
    if (!currentUser) {
      goToLogin();
      return;
    }
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    deletePost({
      token: currentUser.accessToken,
      id: Number(id),
      goToBoardPage: () => navigate('/board'),
    });
  };

  const handleLikeOrCancelLikePost = () => {
    if (!currentUser) {
      goToLogin();
      return;
    }
    const token = currentUser.accessToken;
    const liked = like?.likeList.find(({ userId }) => userId === currentUser.userid);
    if (liked) {
      cancelLikePost({ token, postId, likeId: liked.likeId as number });
    } else {
      likePost({ token, postId, userId: currentUser.userid });
    }
  };

  if (postError) return <Error message={postError} />;

  return (
    <section className="w-full max-h-screen max-w-6xl px-5 md:px-10">
      <div className="md:h-[650px] flex flex-col md:flex-row w-full rounded-sm border">
        <div className="flex flex-col w-full md:w-3/5 h-[450px] md:h-full md:border-r">
          <div className="w-full flex justify-between border-b p-3">
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center mb-1 md:items-start md:flex-col mr-3 md:mb-0">
                <h2 className="text-sm md:text-base font-medium">{id}</h2>
                <h3 className="text-sm text-gray-4 mt-0 ml-1 md:mt-1 md:ml-0">
                  {getBoardCatText(post?.boardCategory as Category)}
                </h3>
              </div>
              <div className="flex flex-col justify-between">
                <h1 className="font-semibold md:text-lg">{post?.title}</h1>
                <h2 className="flex items-center text-sm md:text-base">
                  {post?.nickname} ·{' '}
                  <span className="ml-1 text-gray-3 text-xs">
                    {getDateText(post?.createDate as string)}
                  </span>
                </h2>
              </div>
            </div>
            {currentUser?.userid === post?.userId && (
              <div className="relative" ref={toggleRef}>
                <button onClick={onToggleChange}>
                  <BiDotsHorizontalRounded size={28} />
                </button>
                {toggle && (
                  <div className="absolute w-32 top-8 right-0 border rounded-lg shadow-md bg-white">
                    <button
                      onClick={goToEditPost}
                      className="w-full flex items-center cursor-pointer py-1 px-3"
                    >
                      <HiOutlinePencilAlt className="mr-2" />
                      수정하기
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="w-full flex items-center cursor-pointer py-1 px-3"
                    >
                      <HiOutlineTrash className="mr-2" />
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className="bd-content w-full h-full px-3 pt-4 pb-7 scroll-smooth overflow-auto bg-gray-1
                      text-sm md:text-base leading-6 md:leading-7"
            dangerouslySetInnerHTML={{
              __html: marked(post?.content || ''),
            }}
          />
        </div>

        <div className="w-full md:w-2/5 h-[450px] md:h-full flex flex-col justify-between border-t md:border-t-0">
          <CommentList postId={postId} />
          <div className="">
            <div className="flex items-center p-3 border-t">
              <div className="flex items-center mr-5 md:mr-7">
                <button onClick={handleLikeOrCancelLikePost}>
                  {new Set(like?.likeList.map(({ userId }) => userId)).has(
                    currentUser?.userid
                  ) ? (
                    <AiFillHeart size={22} color="#ed4956" />
                  ) : (
                    <AiOutlineHeart size={22} />
                  )}
                </button>
                <span
                  onClick={() => {
                    navigate(`/board/${id}/likes`);
                  }}
                  className="cursor-pointer ml-1 text-sm md:text-base"
                >
                  {post?.likeCount}
                </span>
              </div>
              <div className="flex items-center mr-5 md:mr-7">
                <AiOutlineComment size={22} />{' '}
                <span className="ml-1 text-sm md:text-base">{post?.commentCount}</span>
              </div>
              <button className="">
                {true ? <FiBookmark size={22} /> : <BsBookmarkFill />}
              </button>
            </div>
            <CommentForm boardId={postId} goToLogin={goToLogin} />
          </div>
        </div>
      </div>
      <Outlet />
    </section>
  );
}
