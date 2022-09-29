import SignIn from '../components/register/SignIn';
import useInput from '../hooks/useInput';
import SignUp from '../components/register/SignUp';
import { useLocation, useNavigate } from 'react-router-dom';

export const defaultProfileImage =
  'https://jiguhada-user-img.s3.ap-northeast-2.amazonaws.com/profile-img/earth_default.png';

export default function Register() {
  const location = useLocation();
  const locationState = location.state as { path: string; data: any };
  const navigate = useNavigate();
  const { value: isRegistered, setValue: setIsRegistered } = useInput(true);
  const goToHome = () => navigate('/');
  const goToPrevOrHome = () =>
    navigate(locationState ? locationState.path : '/', {
      state: locationState ? { data: locationState.data } : null,
    });
  return (
    <div className="border w-96 p-7 rounded-lg">
      <h1 className="flex flex-col items-center text-3xl font-bold">
        <img src="public/earth.png" className="w-16" />
        {isRegistered ? '로그인' : '회원가입'}
      </h1>
      <h2 className="text-gray-4 text-start mt-4 mb-6 font-bold">
        <span className="text-jghd-blue">지구하다</span>에서
        <br />
        변함없는 지구를 만들기 위한 활동을 함께해요
      </h2>
      {!isRegistered ? (
        <SignUp goToHome={goToHome} setIsRegistered={setIsRegistered} />
      ) : (
        <SignIn
          goToPrevOrHome={goToPrevOrHome}
          setIsRegistered={setIsRegistered}
        />
      )}
    </div>
  );
}
