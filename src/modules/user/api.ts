const API_END_POINT = `${import.meta.env.VITE_APP_HOST}/user`;

interface SignupData {
  username: string;
  nickname: string;
  password: string;
  userImageUrl: string;
  socialType: 'GENERAL' | 'KAKAO';
}

interface UserInfo {
  errorCode?: string;
  message?: string;
  username: string;
  nickname: string;
  imgUrl: string;
  socialType: 'GENERAL' | 'KAKAO';
}

export const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const checkDuplicateIdRequest = async (id: string): Promise<any> => {
  try {
    return await (
      await fetch(`${API_END_POINT}/checkDuplicate?username=${id}`, {
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`아이디 중복 확인을 실패했습니다. ${e}`);
  }
};

export const checkDuplicateNicknameRequest = async (nickname: string): Promise<any> => {
  try {
    return await (
      await fetch(`${API_END_POINT}/checkDuplicate?username=${nickname}`, {
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`닉네임 중복 확인을 실패했습니다. ${e}`);
  }
};

export const imageUploadRequest = async (formData: FormData) => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  try {
    return await (
      await fetch(`${API_END_POINT}/uploadTempImg`, {
        method: 'POST',
        body: formData,
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`이미지 파일 업로드를 실패했습니다. ${e}`);
  }
};

export const signupRequest = async (data: SignupData) => {
  const json = await (
    await fetch(`${API_END_POINT}/signup`, {
      method: 'POST',
      mode: 'cors',
      // cache: 'no-cache',
      // credentials: 'same-origin',
      headers,
      body: JSON.stringify(data),
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const updateNicknameRequest = async (token: string, nickname: string) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/updateNickname`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ nickname }),
      })
    ).json();
  } catch (e) {
    throw new Error(`닉네임 수정을 실패했습니다. ${e}`);
  }
};

export const updateImgRequest = async (token: string, formData: FormData) => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
  );
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/updateImg`, {
        method: 'POST',
        body: formData,
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`이미지 파일 수정을 실패했습니다. ${e}`);
  }
};

export const updatePasswordRequest = async (
  token: string,
  data: { nowpassword: string; newpassword: string }
) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/updatePassword`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`비밀번호 변경을 실패했습니다. ${e}`);
  }
};

export const getUserInfo = async (token: string, username: string): Promise<UserInfo> => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/info/${username}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`회원정보 조회를 실패했습니다. ${e}`);
  }
};

export const signOut = async (token: string, data: { password: string }) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/signOut`, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`회원 탈퇴를 실패했습니다. ${e}`);
  }
};
