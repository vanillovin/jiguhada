import { Link, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../modules/user/atom';
import { defaultProfileImage } from '../pages/register/RegisterPage';

function NavigationBar() {
  const location = useLocation();
  const currentUser = useRecoilValue(currentUserState);
  const currentPath = location.pathname;

  return (
    <nav
      className="fixed top-0 left-0 bg-white bg-opacity-95 border-b w-full h-16
        z-50 select-none shadow-sm flex items-center justify-center"
    >
      <div className="w-full max-w-6xl h-full flex items-center justify-between px-6">
        <h1 className="text-xl md:text-2xl font-bold group">
          <Link to="/">
            <span className="text-jghd-green group-hover:text-black">지</span>
            <span className="text-amber-700 group-hover:text-black">-</span>
            <span className="text-jghd-blue group-hover:text-black">구</span>
            하다
          </Link>
        </h1>
        <ul className="flex h-full items-center font-medium">
          <li
            className={`flex items-center px-1 ml-2 md:ml-3 h-full transition-all ${
              currentPath.includes('challenge')
                ? 'border-b-2 border-black -mb-1 transition-all'
                : 'hover:text-jghd-red'
            }`}
          >
            <Link to="/challenge" className="flex items-center">
              챌린지
            </Link>
          </li>
          <li
            className={`flex items-center px-1 ml-2 md:ml-3 h-full transition-all ${
              currentPath.includes('board')
                ? 'border-b-2 border-black -mb-1 transition-all'
                : 'hover:text-jghd-red'
            }`}
          >
            <Link to="/board" className="flex items-center">
              게시판
            </Link>
          </li>
          {currentUser ? (
            <>
              <li className={`flex items-center px-1 ml-2 md:ml-3`}>
                <Link to={`/user/${currentUser?.username}`} className="flex items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 border border-gray-2 rounded-full mr-1">
                    <img
                      src={currentUser?.userImgUrl || defaultProfileImage}
                      className="rounded-full w-full h-full"
                    />
                  </div>
                  <span className="hidden md:block font-medium">{currentUser?.nickname}</span>
                  <span className="hidden md:block">님</span>
                  {/* {currentUser?.nickname}<span className="font-light">님</span> */}
                </Link>
              </li>
            </>
          ) : (
            <li
              className={`flex items-center px-1 ml-3 h-full transition-all ${
                currentPath.includes('register')
                  ? 'border-b-2 border-black -mb-1'
                  : 'hover:text-jghd-red '
              }`}
            >
              <Link to={`/register`}>로그인·회원가입</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavigationBar;
