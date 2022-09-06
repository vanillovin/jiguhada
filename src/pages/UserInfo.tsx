import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { currentUserState } from '../modules/user/atom';

function UserInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  console.log('UserInfo params.id', id);
  // https://recoiljs.org/ko/docs/api-reference/core/useResetRecoilState/
  const resetUser = useResetRecoilState(currentUserState);
  const logout = () => {
    resetUser();
    navigate('/');
  };
  return (
    <div>
      <button onClick={logout}>로그아웃</button>
    </div>
  );
}

export default UserInfo;
