import { useState } from 'react';
import { AiFillHeart, AiOutlineComment, AiOutlineHeart } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiBookmark } from 'react-icons/fi';
import { BsBookmarkFill } from 'react-icons/bs';
import { HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { defaultProfileImage } from './Register';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  cancelLikePostRequest,
  deletePostRequest,
  getPostRequest,
  likePostRequest,
} from '../modules/board/api';
import { getBoardCatText, getDateText } from '../utils';
import { Category } from '../modules/board/type';
import { marked } from 'marked';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../modules/user/atom';
import Message from '../components/Message';

export default function Post() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();
  const { data } = useQuery(['Post', id || state], () =>
    getPostRequest(Number(id) || Number(state))
  );
  const [toggleOpen, setToggleOpen] = useState(false);
  const currentUser = useRecoilValue(currentUserState);
  console.log('Post data:', data);

  const queryClient = useQueryClient();

  const handleEditBoard = () => {
    navigate(`/board/${data?.boardId}/edit`, {
      state: {
        data: {
          boardId: data?.boardId,
          boardCategory: data?.boardCategory,
          title: data?.title,
          content: data?.content,
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
    () => likePostRequest(currentUser?.accessToken as string, Number(id)),
    {
      onSuccess: (data, variables, context) => {
        console.log('likePost success!', data, variables, context);
        queryClient.setQueryData(['Post', id], (old: any) => ({
          ...old,
          likeList: data,
        }));
      },
      onError: (err, variables, context) => {
        console.log('likePost success', err, variables, context);
      },
    }
  );

  const { mutate: cancleLikePost } = useMutation(
    (likeId: number) =>
      cancelLikePostRequest(currentUser?.accessToken as string, likeId),
    {
      onSuccess: (data, variables, context) => {
        console.log('cancleLikePost success!', data, variables, context);
        queryClient.setQueryData(['Post', id], (old: any) => ({
          ...old,
          likeList: data,
        }));
      },
      onError: (err, variables, context) => {
        console.log('cancleLikePost success', err, variables, context);
      },
    }
  );

  const handleLikeOrCancelLikePost = () => {
    if (!currentUser?.accessToken) {
      if (confirm('로그인이 필요한 서비스 입니다. 로그인 하시겠습니까?!')) {
        navigate('/register', { state: { path: `/board/${id}` } });
        return;
      }
      return;
    }
    // const liked = new Set(data?.likeList.map(({ userId }) => userId)).has(
    //   currentUser?.userid
    // );
    const liked = data?.likeList.find(
      ({ userId }) => userId === currentUser.userid
    );
    liked ? cancleLikePost(Number(liked.likeId)) : likePost();
  };

  // 로딩중일때도뜸
  // if (!data?.boardId) {
  //   return (
  //     <Message
  //       message="존재하지 않는 게시글입니다"
  //       navigateInfo={{ name: '게시판', path: '/board' }}
  //     />
  //   );
  // }

  return (
    <section className="w-full max-h-screen max-w-6xl px-5 md:px-10">
      <div className=" md:h-[650px] flex flex-col md:flex-row w-full rounded-sm border">
        <div className="flex flex-col w-full md:w-3/5 h-[450px] md:h-full md:border-r">
          <div className="w-full flex justify-between border-b p-3">
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center mb-1 md:items-start md:flex-col mr-3 md:mb-0">
                <h2 className="text-sm md:text-base font-medium">{id}</h2>
                <h3 className="text-sm text-gray-4 mt-0 ml-1 md:mt-1 md:ml-0">
                  {getBoardCatText(data?.boardCategory as Category)}
                </h3>
              </div>
              <div className="flex flex-col justify-between">
                <h1 className="font-semibold md:text-lg">{data?.title}</h1>
                <h2 className="flex items-center text-sm md:text-base">
                  {data?.nickname} ·{' '}
                  <span className="ml-1 text-gray-3 text-xs">
                    {getDateText(data?.createDate as string)}
                  </span>
                </h2>
              </div>
            </div>
            {currentUser?.userid === data?.userId && (
              <div className="relative">
                <button onClick={() => setToggleOpen((prev) => !prev)}>
                  <BiDotsHorizontalRounded size={28} />
                </button>
                {toggleOpen && (
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
              __html: marked(data?.content || ''),
            }}
          />
        </div>

        <div className="w-full md:w-2/5 h-[300px] md:h-full flex flex-col justify-between border-t md:border-t-0">
          <div className="p-3">
            <p className="mb-2 text-sm md:text-base">
              댓글수 {data?.commentList?.length}개
            </p>
            <ul>
              <li className="flex items-center">
                <div className="w-10 h-10 mr-2">
                  <img
                    src={defaultProfileImage}
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium">
                    지구님
                    <span className="ml-1 text-gray-3 text-xs">
                      2022.09.21 20:56
                    </span>
                  </p>
                  <p className="text-sm md:text-base">{'안녕하세요구르트'}</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center py-2 px-3 border-t">
              <button
                onClick={handleLikeOrCancelLikePost}
                className="flex items-center mr-6"
              >
                {new Set(data?.likeList.map(({ userId }) => userId)).has(
                  currentUser?.userid
                ) ? (
                  <AiFillHeart size={22} />
                ) : (
                  <AiOutlineHeart size={22} />
                )}
                <span className="ml-1">{data?.likeList.length}</span>
              </button>
              <button className="flex items-center mr-6">
                <AiOutlineComment size={22} /> <span className="ml-1">1</span>
              </button>
              <button className="">
                {true ? <FiBookmark size={22} /> : <BsBookmarkFill />}
              </button>
            </div>
            <form
              className="flex items-center border-t"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input className="outline-none flex-1 py-2 px-3" />
              <button
                type="submit"
                className={`py-1 px-3 ${true ? 'text-jghd-green' : ''}`}
              >
                입력
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
