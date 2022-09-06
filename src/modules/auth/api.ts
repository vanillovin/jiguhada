import { headers } from '../user/api';

const API_END_POINT = `${import.meta.env.VITE_APP_HOST}/auth`;

interface LoginData {
  username: string;
  password: string;
}

export const loginRequest = async (data: LoginData): Promise<any> => {
  try {
    return await (
      await fetch(`${API_END_POINT}/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
    ).json();
  } catch (e) {
    console.log('err', e);
    throw new Error(`로그인을 실패했습니다. ${e}`);
  }
};

export const loadingRequest = async ({
  data,
  setLoading,
  finishLoading,
}: {
  data: LoginData;
  setLoading(): void;
  finishLoading(): void;
}): Promise<any> => {
  try {
    setLoading();
    return await loginRequest(data);
  } catch (e) {
    throw new Error(`무엇인가 잘못됐습니다. ${e}`);
  } finally {
    finishLoading();
  }
};
