import {
  CreateChallengeReq,
  CreateChallengeRes,
  GetChallengeListParams,
  IChallengeAuthCommentList,
} from './type';

const CHALLENGE_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/challenge`;
const AUTH_CHALLENGE_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/authchallenge`;

const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const getChallengeList = async (params: GetChallengeListParams) => {
  const {
    queryParam,
    pageParam = 1,
    orderParam = 'RECENTLY',
    categoryParam = '',
    searchTypeParam,
    statusParam,
    tagListParam,
  } = params;
  const json = await (
    await fetch(
      `${CHALLENGE_API_END_POINT}/list?page=${pageParam}&orderType=${orderParam}${
        statusParam ? `&status=${statusParam}` : ''
      }${searchTypeParam ? `&searchType=${searchTypeParam}` : ''}${
        queryParam ? `&query=${queryParam}` : ''
      }${categoryParam ? `&category=${categoryParam}` : ''}${
        tagListParam ? `&tagList=${tagListParam}` : ''
      }`
    )
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const getChallengeRequest = async (token: string, id: number | string) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${CHALLENGE_API_END_POINT}/${id}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const imageUploadRequest = async (
  formData: FormData
): Promise<{ imgUrl: string }> => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  const json = await (
    await fetch(`${CHALLENGE_API_END_POINT}/img/upload`, {
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

export const createChallengeRequest = async (
  token: string,
  data: CreateChallengeReq
): Promise<CreateChallengeRes> => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${CHALLENGE_API_END_POINT}/create`, {
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

export const getIsJoinChallengeRequest = async (uid: number, cid: number) => {
  const json = await (
    await fetch(`${CHALLENGE_API_END_POINT}/isJoin?userid=${uid}&challengeid=${cid}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const joinChallengeRequest = async (
  token: string,
  data: {
    userId: number;
    challengeId: number;
  }
) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${CHALLENGE_API_END_POINT}/join`, {
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

export const uploadChallengeAuthImg = async (
  formData: FormData
): Promise<{ imgUrl: string }> => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  const json = await (
    await fetch(`${AUTH_CHALLENGE_API_END_POINT}/uploadAuthImg`, {
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

export const createChallengeAuthComment = async (
  token: string,
  data: {
    challengeId: number;
    content: string;
    authImgUrl: string;
  }
) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${AUTH_CHALLENGE_API_END_POINT}/create`, {
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

export const getChallengeAuthCommentList = async (
  token: string,
  id: number,
  page: number = 1
): Promise<IChallengeAuthCommentList> => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${AUTH_CHALLENGE_API_END_POINT}/list/${id}?page=${page}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};
