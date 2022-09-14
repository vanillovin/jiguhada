import React, { useRef, useEffect, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  checkDuplicateNicknameRequest,
  imageUploadRequest,
  updateImgRequest,
  updateNicknameRequest,
  updatePasswordRequest,
} from '../../modules/user/api';
import { currentUserState } from '../../modules/user/atom';

const initialPasswords = {
  nowpassword: '',
  newpassword: '',
  checkpassword: '',
} as const;

function Settings() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const nicknameInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [duplicateCheckedNickname, setDuplicateCheckedNickname] =
    useState(false);
  const resetUser = useResetRecoilState(currentUserState);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [fileData, setFileData] = useState<Blob>();
  const [fileDataUrl, setFileDataUrl] = useState(currentUser?.userImgUrl);
  const [passwords, setPasswords] = useState(initialPasswords);
  const { nowpassword, newpassword, checkpassword } = passwords;

  const onChangePasswords = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log([e.target.name], ':', e.target.value);
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckDuplicateNickname = () => {
    const curNickname = nicknameInputRef.current;
    if (!curNickname.value) {
      curNickname.focus();
      return;
    }
    checkDuplicateNicknameRequest(curNickname.value).then((data) => {
      setDuplicateCheckedNickname(!data);
      // setSignupInputsValueOrError('error', 'id', '');
      data.errorCode
        ? alert(data.message)
        : alert(!data ? '사용 가능한 닉네임입니다' : '중복된 닉네임입니다');
    });
  };

  const handleUpdateNickname = () => {
    console.log(duplicateCheckedNickname);
    if (!duplicateCheckedNickname) {
      alert('닉네임 중복 확인을 해주세요');
      return;
    }
    updateNicknameRequest(
      currentUser?.accessToken as string,
      nicknameInputRef.current.value
    )
      .then((res) => {
        alert(res.message);
        if (res.code === 200) {
          setCurrentUser((prev: any) => ({
            ...prev,
            nickname: nicknameInputRef.current.value,
          }));
          setDuplicateCheckedNickname(false);
          nicknameInputRef.current.value = '';
        } else if (res.errorCode === 'EXPIRE_ACCESS_TOKEN') {
          resetUser();
          navigate('/register');
        }
      })
      .catch((err) => {
        console.log('updateNicknameRequest error', err);
      });
  };

  useEffect(() => {
    if (id != currentUser?.userid) {
      // navigate(-1);
      navigate('/');
    }
  }, [id]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) return;
    setFileData(file);
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      setFileDataUrl(e.target?.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleUpdateProfileImage = () => {
    if (!fileData) return;
    if (fileDataUrl === currentUser?.userImgUrl) {
      return;
    }
    let formData = new FormData();
    formData.append('imgFile', fileData);
    updateImgRequest(currentUser?.accessToken as string, formData)
      .then((data) => {
        setCurrentUser((prev: any) => ({
          ...prev,
          userImgUrl: data.imgUrl,
        }));
        setFileDataUrl(data.imgUrl);
      })
      .catch((e) => {
        alert(`프로필 사진 변경에 실패했습니다. ${e}`);
      });
  };

  const onCheckPassword = () => {
    return checkpassword && newpassword !== checkpassword
      ? '비밀번호가 일치하지 않습니다.'
      : '';
  };

  const handleUpdatePassword = () => {
    if (onCheckPassword()) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    updatePasswordRequest(currentUser?.accessToken as string, {
      nowpassword,
      newpassword,
    })
      .then((data) => {
        console.log('updatePasswordRequest data', data);
        if (data.code === 200) {
          alert(data.message);
          setPasswords(initialPasswords);
        } else if (data.errorCode === 'NOW_PASSWORD_NOTMATCH') {
          alert(data.message);
        }
      })
      .catch((err) => {
        console.log('updatePasswordRequest error', err);
      });
  };

  return (
    <>
      <h1 className="font-semibold text-2xl mb-2">회원정보관리</h1>
      <div className="w-full flex flex-col items-start p-2">
        <h2 className="text-gray-5 mb-2 font-semibold">프로필 사진</h2>
        <div className="w-full flex items-center">
          <div className="relative w-24 h-24 rounded-full mr-4">
            <img className="w-full h-full rounded-full" src={fileDataUrl} />
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white bg-opacity-50"></div>
            <label
              htmlFor="attach-file"
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer text-gray-5"
            >
              <AiOutlineCamera size={24} />
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
          </div>
          <button
            onClick={handleUpdateProfileImage}
            className="text-sm md:text-base text-white bg-jghd-blue rounded-sm py-2 px-2 md:px-3"
          >
            변경하기
          </button>
        </div>
        <hr className="my-4 w-full border-t border-gray-200" />
        <h2 className="text-gray-5 mb-2 font-semibold">닉네임</h2>
        <div className="w-full flex flex-col md:flex-row items-start md:items-center">
          <input
            type="text"
            className="placeholder:text-sm outline-none border rounded-sm p-2 w-full md:w-3/5"
            placeholder="닉네임을 입력해 주세요"
            ref={nicknameInputRef}
          />
          <div className="flex mt-2 md:m-0">
            <button
              onClick={handleCheckDuplicateNickname}
              className="text-sm md:text-base text-white bg-gray-3 rounded-sm px-2 py-2 mr-1 md:mx-2"
            >
              중복확인
            </button>
            <button
              onClick={handleUpdateNickname}
              className="text-sm md:text-base text-white bg-jghd-blue rounded-sm px-2 py-2"
            >
              변경하기
            </button>
          </div>
        </div>
        <hr className="my-4 w-full border-t border-gray-200" />
        <h2 className="text-gray-5 text-gra2-5 mb-1 font-semibold">
          비밀번호 변경
        </h2>
        <h3 className="mt-1 mb-2 text-gray-4">현재 비밀번호</h3>
        <input
          name="nowpassword"
          value={nowpassword}
          onChange={onChangePasswords}
          type="password"
          className="placeholder:text-sm outline-none border rounded-sm p-2 w-full md:w-3/5"
          placeholder="현재 비밀번호"
        />
        <h3 className="my-2 text-gray-4">변경할 비밀번호</h3>
        <input
          name="newpassword"
          value={newpassword}
          onChange={onChangePasswords}
          type="password"
          className="placeholder:text-sm outline-none border rounded-sm p-2 w-full md:w-3/5 mb-2"
          placeholder="변경할 비밀번호"
        />
        <input
          name="checkpassword"
          value={checkpassword}
          onChange={onChangePasswords}
          type="password"
          className="placeholder:text-sm outline-none border rounded-sm p-2 w-full md:w-3/5 mb-2"
          placeholder="변경할 비밀번호 확인"
        />
        <p className="text-sm text-red-400 -mt-1 mb-2">{onCheckPassword()}</p>
        <button
          onClick={handleUpdatePassword}
          className="text-sm md:text-base text-white bg-jghd-blue rounded-sm py-2 px-3"
        >
          변경하기
        </button>
        <hr className="my-4 w-full border-t border-gray-200" />
        <h2 className="text-gray-5 mb-2 font-semibold">카카오 계정 연동</h2>
        <hr className="my-4 w-full border-t border-gray-200" />
        <h2 className="text-gray-5 mb-2 font-semibold">회원 탈퇴</h2>
        <div className="w-full flex flex-col md:flex-row items-start md:items-center">
          <input
            type="text"
            className="placeholder:text-sm outline-none border rounded-sm p-2 w-full md:w-3/5"
            placeholder="현재 비밀번호를 주세요"
          />
          <div className="flex mt-2 md:m-0">
            <button className="text-sm md:text-base text-white bg-red-400 rounded-sm px-2 py-2 mr-1 md:mx-2">
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;