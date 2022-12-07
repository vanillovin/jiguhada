import { SignupData } from './type';

const API_END_POINT = `${import.meta.env.VITE_APP_HOST}/user`;

export const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const updateUserInfoPublicRequest = async (
  token: string,
  isPublic: 'PUBLIC' | 'PRIVATE'
): Promise<{
  code: number;
  message: string;
}> => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${API_END_POINT}/updateUserInfoPublic?isPublic=${isPublic}`, {
      method: 'PUT',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const checkDuplicateIdRequest = async (id: string) => {
  const json = await (
    await fetch(`${API_END_POINT}/checkDuplicate?username=${id}`, {
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const checkDuplicateNicknameRequest = async (nickname: string) => {
  const json = await (
    await fetch(`${API_END_POINT}/checkDuplicate?username=${nickname}`, {
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const imageUploadRequest = async (formData: FormData) => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');

  const json = await (
    await fetch(`${API_END_POINT}/uploadTempImg`, {
      method: 'POST',
      body: formData,
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
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
  const json = await (
    await fetch(`${API_END_POINT}/updateNickname`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ nickname }),
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
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

  const json = await (
    await fetch(`${API_END_POINT}/updateImg`, {
      method: 'POST',
      body: formData,
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const updatePasswordRequest = async (
  token: string,
  data: { nowpassword: string; newpassword: string }
) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${API_END_POINT}/updatePassword`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const getUserInfo = async (token: string = '', username: string) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${API_END_POINT}/info/${username}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const signOut = async (token: string, data: { password: string }) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${API_END_POINT}/signOut`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};
