import { BoardList, BoardListParams, CreateBoard, BoardDetail } from './type';

const API_END_POINT = `${import.meta.env.VITE_APP_HOST}/board`;

const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const getBoardList = async (
  params: BoardListParams
): Promise<BoardList> => {
  const { query, page, order, category, searchType } = params;
  try {
    if (query) {
      if (category) {
        return await (
          await fetch(
            `${API_END_POINT}/list?query=${query}&page=${page}&order=${order}&category=${category}&searchType=${searchType}`,
            { headers }
          )
        ).json();
      } else {
        return await (
          await fetch(
            `${API_END_POINT}/list?query=${query}&page=${page}&order=${order}&searchType=${searchType}`,
            { headers }
          )
        ).json();
      }
    } else if (category) {
      return await (
        await fetch(
          `${API_END_POINT}/list?page=${page}&order=${order}&category=${category}`,
          { headers }
        )
      ).json();
    } else {
      return await (
        await fetch(`${API_END_POINT}/list?page=${page}&order=${order}`, {
          headers,
        })
      ).json();
    }
  } catch (e) {
    throw new Error(`게시물 목록을 불러오지 못했습니다. ${e}`);
  }
};

export const createPostRequest = async (token: string, data: CreateBoard) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글을 올리지 못했습니다. ${e}`);
  }
};

export const uploadImgRequest = async (formData: FormData) => {
  const headers: HeadersInit = new Headers();
  headers.set(
    'Access-Control-Allow-Origin',
    `${import.meta.env.VITE_APP_LOCAL}`
  );
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  try {
    return await (
      await fetch(`${API_END_POINT}/uploadImg`, {
        method: 'POST',
        body: formData,
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`이미지 파일 업로드를 실패했습니다. ${e}`);
  }
};

export const getPostRequest = async (id: number): Promise<BoardDetail> => {
  try {
    return await (
      await fetch(`${API_END_POINT}/read/${id}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 조회를 실패했습니다. ${e}`);
  }
};

export const deletePostRequest = async (token: string, id: number) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${API_END_POINT}/delete/${id}`, {
        method: 'DELETE',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 삭제를 실패했습니다. ${e}`);
  }
};
