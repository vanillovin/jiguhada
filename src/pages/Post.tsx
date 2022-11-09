import { useRef } from 'react';
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiBookmark } from 'react-icons/fi';
import { BsBookmarkFill } from 'react-icons/bs';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  cancelLikePostRequest,
  createPostCommentRequest,
  deletePostRequest,
  getLikesRequest,
  getPostRequest,
  likePostRequest,
} from '../modules/board/api';
import { getBoardCatText, getDateText } from '../utils';
import { Category } from '../modules/board/type';
import { marked } from 'marked';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../modules/user/atom';
import useToggle from '../hooks/useToggle';
import CommentList from '../components/post/CommentList';

export default function Post() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { data: post } = useQuery(
    ['Post', id || state],
    () => getPostRequest(Number(id) || Number(state))
    // {
    //   onSuccess: (data) => {
    //     console.log('onSuccess Post data', data);
    //   },
    //   onError: (err) => {
    //     console.log('onError Post data', err);
    //   },
    // }
  );
  const { data: likes } = useQuery(['Like', id], () => getLikesRequest(Number(id)));

  const toggleRef = useRef() as React.RefObject<HTMLDivElement>;
  const { toggle, onToggleChange } = useToggle(toggleRef);
  const currentUser = useRecoilValue(currentUserState);
  const queryClient = useQueryClient();
  // console.log('Post likes:', likes);

  const handleEditBoard = () => {
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

  const handleDeleteBoard = () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;
    if (!currentUser?.accessToken) {
      alert('토큰을 읽을 수 없습니다. 다시 로그인해 주세요!');
      navigate('/register');
      return;
    }
    deletePostRequest(currentUser?.accessToken, Number(id))
      .then((res) => {
        console.log('handleDeleteBoard res', res);
        if (res.code === 200) {
          navigate('/board');
        } else {
        }
      })
      .catch((err) => {
        console.log('handleDeleteBoard err', err);
      });
  };

  const { mutate: likePost } = useMutation(
    () =>
      likePostRequest(
        currentUser?.accessToken as string,
        Number(id),
        currentUser?.userid as number
      ),
    {
      onSuccess: (data, variables, context) => {
        console.log('likePost success!', data, variables, context);
        queryClient.setQueryData(['Post', id], (old: any) => ({
          ...old,
          likeList: data,
        }));
      },
      onError: (err, variables, context) => {
        console.log('likePost error', err, variables, context);
      },
    }
  );

  const { mutate: cancleLikePost } = useMutation(
    (likeId: number) => cancelLikePostRequest(currentUser?.accessToken as string, likeId),
    {
      onSuccess: (data, variables, context) => {
        console.log('cancleLikePost success!', data, variables, context);
        queryClient.setQueryData(['Post', id], (old: any) => ({
          ...old,
          likeList: data,
        }));
      },
      onError: (err, variables, context) => {
        console.log('cancleLikePost error', err, variables, context);
      },
    }
  );

  const handleLikeOrCancelLikePost = () => {
    if (!currentUser) {
      if (confirm('로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?!')) {
        navigate('/register', { state: { path: `/board/${id}` } });
        return;
      }
      return;
    }
    const liked = likes?.likeList.find(({ userId }) => userId === currentUser.userid);
    liked ? cancleLikePost(Number(liked.likeId)) : likePost();
  };

  const { mutate: createComment } = useMutation(
    (data: { boardId: number; content: string }) =>
      createPostCommentRequest(currentUser?.accessToken as string, data),
    {
      onSuccess: (data, variables, context) => {
        // resData, {boardId, content}, undefined
        const errorCode = data.errorCode || '';
        if (errorCode) {
          if (errorCode === 'EXPIRE_ACCESS_TOKEN') {
            alert(data.message);
            navigate('/register', { state: { path: `/board/${id}` } });
          }
          return;
        }

        console.log('createComment success!', data, variables, context);
        queryClient.setQueryData(['Post', id], (old: any) => ({
          ...old,
          commentCount: old.commentCount + 1,
        }));
        queryClient.invalidateQueries(['CommentList', id]);
        const commentInput = document.getElementById('comment') as HTMLInputElement;
        commentInput.value = '';
        // variables.clearContent();
      },
      onError: (err, variables, context) => {
        console.log('createComment error', err, variables, context);
      },
    }
  );

  const handleCreateComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      if (confirm('로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?!')) {
        navigate('/register', { state: { path: `/board/${id}` } });
        return;
      }
      return;
    }
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    if (content.trim().length < 2) {
      alert('댓글은 2자 이상 입력해 주세요!');
      return;
    }
    // formData.set('content', '');
    createComment({ boardId: Number(id), content });
  };

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
                      onClick={handleEditBoard}
                      className="w-full flex items-center cursor-pointer py-1 px-3"
                    >
                      <HiOutlinePencilAlt className="mr-2" />
                      수정하기
                    </button>
                    <button
                      onClick={handleDeleteBoard}
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
          <div className="p-3 overflow-y-auto cmt h-full">
            <p className="mb-2 font-medium text-sm md:text-base">
              댓글수 {post?.commentCount}개
            </p>
            <CommentList id={id as string} />
          </div>

          <div>
            <div className="flex items-center py-2 px-3 border-t">
              <div className="flex items-center mr-5 md:mr-7">
                <button onClick={handleLikeOrCancelLikePost}>
                  {new Set(likes?.likeList.map(({ userId }) => userId)).has(
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
                  {/* <ul className="likes absolute bottom-10 left-0 border shadow-sm bg-white w-28 max-h-40 overflow-y-auto">
                    {likes?.likeList.map((like) => (
                      <li key={like.likeId} className="border-b py-1 px-2">
                        {like.nickname}
                      </li>
                    ))}
                  </ul> */}
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
            <form className="flex items-center border-t" onSubmit={handleCreateComment}>
              <input
                id="comment"
                name="content"
                className="outline-none flex-1 py-2 px-3"
              />
              <button
                type="submit"
                // disabled
                className={`py-1 px-3 ${true ? 'text-jghd-green' : ''}`}
              >
                입력
              </button>
            </form>
          </div>
        </div>
      </div>
      <Outlet />
    </section>
  );
}
