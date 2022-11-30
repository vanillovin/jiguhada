import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import useInput from '../../hooks/useInput';
import {
  checkDuplicateIdRequest,
  checkDuplicateNicknameRequest,
  imageUploadRequest,
  signupRequest,
} from '../../modules/user/api';
import { currentUserState } from '../../modules/user/atom';
import { defaultProfileImage } from '../../pages/Register';

interface SignupInputs {
  [key: string]: { value: string; error: string };
}

const signupInputsData = [
  ['id', 'text', '아이디', '아이디를 입력해주세요.'],
  ['nickname', 'text', '닉네임', '사용하실 닉네임을 입력해주세요.'],
  ['pw', 'password', '비밀번호', '비밀번호를 입력해주세요.'],
  ['pwCheck', 'password', '비밀번호 확인', '비밀번호를 확인합니다.'],
  ['profileImage', 'text', '프로필 사진', '선택된 파일 없음'],
];

function SignUp({
  goToHome,
  setIsRegistered,
}: {
  goToHome(): void;
  setIsRegistered(val: boolean): void;
}) {
  const [_, setCurrentUser] = useRecoilState(currentUserState);
  const [signupInputs, setSignupInputs] = useState<SignupInputs>({
    id: { value: '', error: '' },
    nickname: { value: '', error: '' },
    pw: { value: '', error: '' },
    pwCheck: { value: '', error: '' },
    profileImage: { value: '', error: '' },
  });
  const { id, nickname, pw, pwCheck, profileImage } = signupInputs;
  const { value: duplicateCheckedId, setValue: setDuplicateCheckedId } = useInput('');
  const { value: duplicateCheckedNickname, setValue: setDuplicateCheckedNickname } =
    useInput('');
  const { value: fileDataUrl, setValue: setFileDataUrl } = useInput('');

  const setSignupInputsValueOrError = (
    type: 'value' | 'error',
    id: string,
    text: string
  ) => {
    setSignupInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: text,
      },
    }));
  };

  const checkDuplicateId = () => {
    if (!/^[a-z]+[a-z0-9]{3,16}$/g.test(id.value)) {
      setSignupInputsValueOrError(
        'error',
        'id',
        '영문자로 시작하는 영문자 또는 숫자 4~15자'
      );
      return;
    }
    checkDuplicateIdRequest(id.value).then((data) => {
      setDuplicateCheckedId(!data ? id.value : '');
      setSignupInputsValueOrError('error', 'id', '');
      !data
        ? toast.success('사용 가능한 아이디입니다')
        : toast.error('중복된 아이디입니다');
    });
  };

  const checkDuplicateNickname = () => {
    if (nickname.value.length < 2) {
      setSignupInputsValueOrError('error', 'nickname', '닉네임은 2자 이상 입력해 주세요');
      return;
    }
    checkDuplicateNicknameRequest(nickname.value).then((data) => {
      setDuplicateCheckedNickname(!data ? nickname.value : '');
      setSignupInputsValueOrError('error', 'nickname', '');
      !data
        ? toast.success('사용 가능한 닉네임입니다')
        : toast.error('중복된 닉네임입니다');
    });
  };

  const handleCheckDuplicateIdOrNickname = (type: 'id' | 'nickname') => {
    type === 'id' ? checkDuplicateId() : checkDuplicateNickname();
  };

  const onChangeSignupInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSignupInputs((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: value.trim(),
      },
    }));
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!duplicateCheckedId || duplicateCheckedId !== id.value) {
      toast.error('아이디 중복 확인을 해주세요');
      return;
    }
    if (!duplicateCheckedNickname || duplicateCheckedNickname !== nickname.value) {
      toast.error('닉네임 중복 확인을 해주세요');
      return;
    }
    if (!/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{5,16}$/.test(pw.value)) {
      setSignupInputsValueOrError('error', 'pw', '6~16자 영문, 숫자 조합');
      return;
    } else {
      setSignupInputsValueOrError('error', 'pw', '');
    }
    if (pw.value !== pwCheck.value) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }
    signupRequest({
      username: id.value,
      nickname: nickname.value,
      password: pw.value,
      userImageUrl: profileImage.value || defaultProfileImage,
      socialType: 'GENERAL',
    })
      .then((data) => {
        toast.success('회원가입이 완료됐습니다');
        setCurrentUser(data);
        goToHome();
      })
      .catch((err) => {
        console.log('signup error', err);
        const [code, message] = err.message.split('-');
        toast.error(message);
      });
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    let formData = new FormData();
    formData.append('imgFile', file);
    imageUploadRequest(formData)
      .then((data) => {
        setSignupInputsValueOrError('value', 'profileImage', data.imgUrl);
        setSignupInputsValueOrError('error', 'profileImage', '');
      })
      .catch((e) => {
        console.log('imageUpload error', e);
        setSignupInputsValueOrError(
          'error',
          'profileImage',
          '프로필 사진 업로드를 실패했습니다'
        );
      });

    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      setFileDataUrl(e.target?.result);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSignUp}>
      {signupInputsData.map(([id, type, title, placeholder]) => (
        <div key={id} className="flex flex-col items-start">
          {id !== 'pwCheck' && (
            <label htmlFor={id} className="block mt-3 mb-1">
              {id === 'profileImage' && <span className="text-red-400 font-bold">*</span>}
              {title}
            </label>
          )}
          {id === 'profileImage' && fileDataUrl && (
            <div className="flex items-center">
              <img
                className="border border-gray-2 w-20 h-20 rounded-full"
                src={fileDataUrl}
              />
              {fileDataUrl && (
                <button
                  className="ml-2"
                  onClick={() => {
                    setFileDataUrl('');
                    setSignupInputsValueOrError('value', 'profileImage', '');
                    setSignupInputsValueOrError('error', 'profileImage', '');
                  }}
                >
                  <span>제거하기</span>
                </button>
              )}
            </div>
          )}
          <div className="w-full flex items-center">
            <div className="flex items-center w-full">
              <input
                id={id}
                type={type}
                name={id}
                value={
                  id === 'profileImage'
                    ? `${
                        signupInputs[id].value !== ''
                          ? `${signupInputs[id].value.substring(0, 25)}...`
                          : signupInputs[id].value
                      }`
                    : signupInputs[id].value
                }
                required
                onChange={onChangeSignupInputs}
                placeholder={placeholder}
                disabled={id === 'profileImage'}
                className={`w-full border-b mb-1 outline-none px-1 py-2 placeholder-gray-300 placeholder:text-sm bg-transparent
                  ${signupInputs[id].error && 'border-b-red-400'} 
                  ${id === 'profileImage' && 'text-gray-4'}
                `}
              />

              {(id === 'id' || id === 'nickname') && (
                <button
                  type="button"
                  className={`ml-2 w-24 text-sm rounded-lg py-1 text-white ${
                    duplicateCheckedId === signupInputs[id].value ||
                    duplicateCheckedNickname === signupInputs[id].value
                      ? 'bg-jghd-green'
                      : 'bg-gray-400'
                  }`}
                  onClick={() => handleCheckDuplicateIdOrNickname(id)}
                >
                  중복확인
                </button>
              )}
              {id === 'profileImage' && (
                // <form encType="multipart/form-data">
                <>
                  <label
                    htmlFor="attach-file"
                    className={`cursor-pointer ml-2 bg-gray-400 w-24 text-sm rounded-lg py-1 text-white text-center`}
                  >
                    사진선택
                  </label>
                  <input
                    id="attach-file"
                    name="imgFile"
                    type="file"
                    accept="image*"
                    // 선택을 허가하는 파일의 종류를 MIME Type으로 지정한다. 여러 개의 MT을 지정하는 경우엔 콤마 구분자로 지정함
                    onChange={onFileChange}
                    className="hidden"
                    // multiple 복수의 파일 선택 가능
                  />
                </>
              )}
            </div>
          </div>
          <p className="text-xs md:text-sm tracking-tighter text-red-400 ml-1">
            {id === 'pwCheck' &&
            pwCheck.value &&
            signupInputs['pw'].value !== signupInputs['pwCheck'].value
              ? '비밀번호가 일치하지 않습니다.'
              : signupInputs[id].error}
          </p>
        </div>
      ))}
      <button type="submit" className="w-full bg-jghd-blue text-white py-2 mt-4">
        가입하기
      </button>
      <div className="hr-lines-con">
        <span className="hr-lines">또는</span>
      </div>
      <button
        type="submit"
        onClick={() => {}}
        className="w-full bg-yellow-300 text-white py-2"
      >
        카카오로 가입하기
      </button>
      <div className="mt-6 text-center">
        계정이 이미 있으신가요?{' '}
        <button
          type="submit"
          className="text-jghd-green font-bold"
          onClick={() => setIsRegistered(true)}
        >
          로그인
        </button>
      </div>
    </form>
  );
}

export default SignUp;
