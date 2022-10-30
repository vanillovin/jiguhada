import { CreateChallenge, GetChallenge, ChallengeList } from './type';

const CHALLENGE_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/challenge`;

const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const getChallengeList = async (params): Promise<ChallengeList> => {
  const { query, page, order, category, searchType, tagList } = params;
  console.log('tagList:', tagList);
  // &tagList=${tagList}
  try {
    if (query) {
      if (category) {
        return await (
          await fetch(
            `${CHALLENGE_API_END_POINT}/list?query=${query}&page=${page}&orderType=${order}&category=${category}&searchType=${searchType}${
              tagList ? `&tagList=${tagList}` : ''
            }`,
            { headers }
          )
        ).json();
      } else {
        return await (
          await fetch(
            `${CHALLENGE_API_END_POINT}/list?query=${query}&page=${page}&orderType=${order}&searchType=${searchType}${
              tagList ? `&tagList=${tagList}` : ''
            }`,
            { headers }
          )
        ).json();
      }
    } else if (category) {
      return await (
        await fetch(
          `${CHALLENGE_API_END_POINT}/list?page=${page}&orderType=${order}&category=${category}${
            tagList ? `&tagList=${tagList}` : ''
          }`,
          { headers }
        )
      ).json();
    } else {
      return await (
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
  } catch (e) {
    throw new Error(`챌린지 목록을 불러오지 못했습니다. ${e}`);
  }
};

export const getChallengeRequest = async (id: number | string): Promise<GetChallenge> => {
  try {
    return await (
      await fetch(`${CHALLENGE_API_END_POINT}/${id}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`챌린지 정보 조회를 실패했습니다. ${e}`);
  }
};

export const imageUploadRequest = async (
  formData: FormData
): Promise<{ imgUrl: string }> => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  try {
    return await (
      await fetch(`${CHALLENGE_API_END_POINT}/img/upload`, {
        method: 'POST',
        body: formData,
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`챌린지 대표 및 추가 이미지 업로드를 실패했습니다. ${e}`);
  }
};

export const createChallengeRequest = async (token: string, data: CreateChallenge) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${CHALLENGE_API_END_POINT}/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`챌린지를 생성하지 못했습니다. ${e}`);
  }
};
