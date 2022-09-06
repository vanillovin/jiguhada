const API_END_POINT = `${import.meta.env.VITE_APP_HOST}/user`;

interface SignupData {
  username: string;
  nickname: string;
  password: string;
  userImageUrl: string;
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

export const checkDuplicateNicknameIdRequest = async (
  nickname: string
): Promise<any> => {
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
  headers.set(
    'Access-Control-Allow-Origin',
    `${import.meta.env.VITE_APP_LOCAL}`
  );
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
  try {
    return await (
      await fetch(`${API_END_POINT}/signup`, {
        method: 'POST',
        mode: 'cors',
        // cache: 'no-cache',
        // credentials: 'same-origin',
        headers,
        body: JSON.stringify(data),
      })
    ).json();
  } catch (e) {
    throw new Error(`회원가입에 실패했습니다. ${e}`);
  }
};
