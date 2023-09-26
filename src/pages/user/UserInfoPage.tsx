import { useQuery } from 'react-query';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Error from '../../components/Error';
import Loading from '../../components/Loading';
import { getUserInfo } from '../../modules/user/api';
import { IUserInfo } from '../../modules/user/type';
import { currentUserState } from '../../modules/user/atom';

export default function UserInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);
  // https://recoiljs.org/ko/docs/api-reference/core/useResetRecoilState/
  const resetUser = useResetRecoilState(currentUserState);
  const logout = () => {
    resetUser();
    navigate('/');
  };
  const currentPath = location.pathname;

  const {
    isLoading,
    data: user,
    error,
  } = useQuery<IUserInfo, { message: string }>(
    ['UserInfo', id],
    () => getUserInfo(currentUser?.accessToken, id as string),
    {
      retry: 2,
      onSuccess: (res) => {
        console.log('UserInfo onSuccess res :', res);
      },
      onError: (err) => {
        console.log('UserInfo onError err :', err);
      },
    }
  );

  if (error) {
    const [_, msg] = error.message.split('-');
    return <Error message={msg} />;
  }

  return !isLoading ? (
    <section className="w-full flex flex-col md:flex-row px-5 md:px-10 pb-10 max-w-5xl">
      <div className="border-r w-full md:w-1/4 p-4 border rounded-tl-sm md:rounded-bl-sm">
        <div>
          <div className="flex md:flex-col items-center md:items-start mb-3 md:mb-6">
            <div className="flex items-center mb-3">
              <img src={user?.imgUrl} className="rounded-full w-20 h-20 border mr-2" />
              <div className="text-start">
                <h2 className="font-semibold">{user?.nickname}</h2>
                <p className="text-sm text-gray-4 -mt-1">@{user?.username}</p>
              </div>
            </div>
            <div>
              <button
                className="text-sm md:text-base text-white bg-red-400 p-1 px-2 ml-2 md:ml-0"
                onClick={logout}
              >
                로그아웃
              </button>
            </div>
          </div>

          <ul className="flex md:flex-col text-start text-sm md:text-base">
            {id == currentUser?.username && (
              <>
                <li className="mt-2 text-lg font-bold mb-1 hidden md:block">회원정보</li>
                <li
                  className={`ml-2 mb-1 ${
                    currentPath === `/user/${id}/settings` && 'text-jghd-blue font-bold'
                  }`}
                >
                  <Link to={`/user/${id}/settings`}>회원정보 관리</Link>
                </li>
              </>
            )}
            <li className="mt-2 text-lg font-bold mb-1 hidden md:block">게시판</li>
            <li
              className={`ml-2 mb-1 ${
                currentPath === `/user/${id}/comments` && 'text-jghd-blue font-bold'
              }`}
            >
              <Link to={`/user/${id}/comments`}>작성한 댓글</Link>
            </li>
            <li
              className={`ml-2 mb-1 ${
                currentPath === `/user/${id}/posts` && 'text-jghd-blue font-bold'
              }`}
            >
              <Link to={`/user/${id}/posts`}>작성한 게시글</Link>
            </li>
            <li className="mt-2 text-lg font-bold mb-1 hidden md:block">챌린지</li>
            <li className={`ml-2 mb-1`}>참여중인 챌린지</li>
            <li className={`ml-2 mb-1`}>운영중인 챌린지</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-start w-full md:w-3/4 p-4 border md:border-l-0 border-t-0 md:border-t md:rounded-tr-sm rounded-br-sm">
        <Outlet context={{ user }} />
      </div>
    </section>
  ) : (
    <Loading />
  );
}
