import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../modules/user/atom';
import { defaultProfileImage } from '../pages/Register';

function NavigationBar() {
  const currentUser = useRecoilValue(currentUserState);

  return (
    <nav
      className="fixed top-0 left-0 bg-white bg-opacity-95 border-b w-full h-20 
      flex items-center justify-between px-10 md:px-32 z-50"
    >
      <h1 className="text-xl md:text-2xl font-bold">
        <Link to="/">지-구하다</Link>
      </h1>
      <ul className="flex items-center md:text-lg">
        <li className="p-1 ml-3">
          <Link to="/board" className="flex items-center">
            게시판
          </Link>
        </li>
        {currentUser ? (
          <>
            <li className="p-1 ml-3">
              <Link
                to={`/user/${currentUser?.userid}`}
                className="flex items-center"
              >
                <div className="w-10 h-10 border border-gray-2 rounded-full mr-1">
                  <img
                    src={currentUser?.userImgUrl || defaultProfileImage}
                    className="rounded-full w-full h-full"
                  />
                </div>
                <span className="font-medium">{currentUser?.nickname}</span>님
                {/* {currentUser?.nickname}<span className="font-light">님</span> */}
              </Link>
            </li>
          </>
        ) : (
          <li className="p-1 ml-3 tracking-tight">
            <Link to={`/register`}>로그인·회원가입</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavigationBar;
