import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../modules/user/atom';
import { defaultProfileImage } from '../pages/Register';

function Nav() {
  const currentUser = useRecoilValue(currentUserState);
  console.log('Nav currentUser', currentUser?.userImgUrl);

  return (
    <nav
      className="fixed top-0 left-0 bg-white bg-opacity-95 border-b w-full h-16 
      flex items-center justify-between px-10 tablet:px-28"
    >
      <h1 className="text-xl font-bold">
        <Link to="/">지-구하다</Link>
      </h1>
      <ul className="flex items-center">
        {currentUser ? (
          <li className="p-1 ml-5">
            <Link
              to={`/user/info/${currentUser.userid}`}
              className="flex items-center"
            >
              <div className="w-10 h-10 border border-gray-2 rounded-full mr-1">
                <img
                  src={currentUser.userImgUrl || defaultProfileImage}
                  className="rounded-full w-full h-full"
                />
              </div>
              {currentUser.nickname}님
            </Link>
          </li>
        ) : (
          <li className="p-1 ml-5">
            <Link to={`/register`}>회원가입·로그인</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
