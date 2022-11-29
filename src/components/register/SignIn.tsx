import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { loginRequest } from '../../modules/auth/api';
import { currentUserState } from '../../modules/user/atom';

function SignIn({ goToPrevOrHome, setIsRegistered }: SignInProps) {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  // const { value: loading, setValue: setLoading } = useInput<boolean>(false);
  const [signInInputs, setSignInInputs] = useState<SignInInputs>({
    id: { value: '', error: '' },
    pw: { value: '', error: '' },
  });
  const { id, pw } = signInInputs;

  const onChangeSignInInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignInInputs((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: value.trim(),
      },
    }));
  };

  const setSignInInputsValueOrError = (
    type: 'value' | 'error',
    id: string,
    text: string
  ) => {
    setSignInInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: text,
      },
    }));
  };

  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    loginRequest({ username: id.value, password: pw.value })
      .then((data) => {
        // console.log(data); // { accessToken, accessTokenExpiredDate, nickname, userImgUrl, userid, username }
        const errorCode = data.errorCode;
        const errorMessage = data.message;
        if (errorCode) {
          if (errorCode === 'NOT_EXITS_ID') {
            setSignInInputsValueOrError('error', 'pw', '');
            setSignInInputsValueOrError('error', 'id', errorMessage);
          } else if (errorCode === 'ID_PASSWORD_NOTMATCH') {
            setSignInInputsValueOrError('error', 'id', '');
            setSignInInputsValueOrError('error', 'pw', errorMessage);
          }
        } else {
          setCurrentUser(data);
          goToPrevOrHome();
        }
      })
      .catch((err) => {
        console.log('login err', err);
      });
  };

  return (
    <form onSubmit={handleSignIn}>
      <div className="flex flex-col items-start w-full">
        {signInputsData.map(([id, title, placeholder]) => (
          <div key={id} className="flex flex-col items-start w-full">
            <label htmlFor={id} className="block mt-3 mb-1">
              {title}
            </label>
            <input
              id={id}
              type={id === 'id' ? 'text' : 'password'}
              name={id}
              value={signInInputs[id].value}
              onChange={onChangeSignInInputs}
              placeholder={placeholder}
              disabled={id === 'profileImage'}
              className={`w-full border-b mb-1 outline-none px-1 py-2 placeholder-gray-300 placeholder:text-sm bg-transparent
               ${signInInputs[id].error && 'border-b-red-400'} `}
            />
            <p className="text-sm text-red-400 mt-1">{signInInputs[id].error}</p>
          </div>
        ))}
      </div>
      <button
        type="submit"
        onClick={handleSignIn}
        className="w-full bg-jghd-blue text-white py-2 mt-4"
      >
        로그인
      </button>
      <div className="hr-lines-con">
        <span className="hr-lines">또는</span>
      </div>
      <button
        type="submit"
        onClick={() => {}}
        className="w-full bg-yellow-300 text-white py-2"
      >
        카카오로 로그인
      </button>
      <div className="mt-6 text-center">
        아직 회원이 아니신가요?{' '}
        <button
          className="text-jghd-green font-bold"
          onClick={() => setIsRegistered(false)}
        >
          회원가입
        </button>
      </div>
    </form>
  );
}

export default SignIn;

interface SignInProps {
  goToPrevOrHome(): void;
  setIsRegistered(val: boolean): void;
}

interface SignInInputs {
  [key: string]: { value: string; error: string };
}

const signInputsData = [
  ['id', '아이디', '아이디를 입력해주세요.'],
  ['pw', '비밀번호', '비밀번호를 입력해주세요.'],
];
