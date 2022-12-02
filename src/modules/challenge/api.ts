import {
  GetChallenge,
  ChallengeList,
  CreateChallengeReq,
  CreateChallengeRes,
} from './type';

const CHALLENGE_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/challenge`;

const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const getChallengeList = async (params: any): Promise<ChallengeList> => {
  const { query = '', page = 1, order, category, searchType, tagList } = params;
  let json;
  if (query) {
    if (category) {
      json = await (
        await fetch(
          `${CHALLENGE_API_END_POINT}/list?query=${query}&page=${page}&orderType=${order}&category=${category}&searchType=${searchType}${
            tagList ? `&tagList=${tagList}` : ''
          }`,
          { headers }
        )
      ).json();
    } else {
      json = await (
        await fetch(
          `${CHALLENGE_API_END_POINT}/list?query=${query}&page=${page}&orderType=${order}&searchType=${searchType}${
            tagList ? `&tagList=${tagList}` : ''
          }`,
          { headers }
        )
      ).json();
    }
  } else if (category) {
    json = await (
      await fetch(
        `${CHALLENGE_API_END_POINT}/list?page=${page}&orderType=${order}&category=${category}${
          tagList ? `&tagList=${tagList}` : ''
        }`,
        { headers }
      )
    ).json();
  } else {
    json = await (
      await fetch(
        `${CHALLENGE_API_END_POINT}/list?page=${page}&orderType=${order}${
          tagList ? `&tagList=${tagList}` : ''
        }`,
        {
          headers,
        }
      )
    ).json();
  }
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
