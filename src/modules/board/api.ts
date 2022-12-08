import { BoardList, BoardListParams, CreateBoard, Post, Comment } from './type';

const BOARD_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/board`;
const BOARD_LIKE_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/boardLike`;
const BOARD_COMMENT_API_END_POINT = `${import.meta.env.VITE_APP_HOST}/boardComment`;

const headers: HeadersInit = new Headers();
headers.set('Content-Type', 'application/json');
headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
headers.set('Access-Control-Allow-Credentials', 'true');

export const getBoardList = async (params: BoardListParams): Promise<BoardList> => {
  const {
    query = '',
    page = 1,
    order = 'RECENT',
    category = '',
    searchType = 'TITLE',
  } = params;
  let json;
  if (query) {
    if (category) {
      json = await (
        await fetch(
          `${BOARD_API_END_POINT}/list?query=${query}&page=${page}&order=${order}&category=${category}&searchType=${searchType}`,
          { headers }
        )
      ).json();
    } else {
      json = await (
        await fetch(
          `${BOARD_API_END_POINT}/list?query=${query}&page=${page}&order=${order}&searchType=${searchType}`,
          { headers }
        )
      ).json();
    }
  } else if (category) {
    json = await (
      await fetch(
        `${BOARD_API_END_POINT}/list?page=${page}&order=${order}&category=${category}`,
        { headers }
      )
    ).json();
  } else {
    json = await (
      await fetch(`${BOARD_API_END_POINT}/list?page=${page}&order=${order}`, {
        headers,
      })
    ).json();
  }
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const createPostRequest = async (token: string, data: CreateBoard) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_API_END_POINT}/create`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    })
  ).json();
  // console.log('createPostRequest api json :', json);
  // { errorCode, message } || { error, path, status: 500, timestamp } ||
  // if (!json)
  if (json.error || json.errorCode) {
    // throw json;
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const uploadImgRequest = async (formData: FormData) => {
  const headers: HeadersInit = new Headers();
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  const json = await (
    await fetch(`${BOARD_API_END_POINT}/uploadImg`, {
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

export const getPostRequest = async (id: number): Promise<Post> => {
  const json = await (
    await fetch(`${BOARD_API_END_POINT}/read/${id}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.errorCode) throw json.message;
  else return json;
};

export const deletePostRequest = async (token: string, id: number) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_API_END_POINT}/delete/${id}`, {
      method: 'DELETE',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const getPrevPostDataRequest = async (token: string, id: number) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_API_END_POINT}/update/${id}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const updatePostRequest = async (token: string, data: any) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_API_END_POINT}/update`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const likePostRequest = async (token: string, boardId: number, userId: number) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_LIKE_API_END_POINT}/create/${boardId}?userId=${userId}`, {
      method: 'POST',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const cancelLikePostRequest = async (token: string, likeId: number) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_LIKE_API_END_POINT}/delete/${likeId}`, {
      method: 'DELETE',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const updatePostCommentRequest = async (
  token: string,
  data: { commentId: number; content: string }
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_COMMENT_API_END_POINT}/update`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const createPostCommentRequest = async (
  token: string,
  data: { boardId: number; content: string }
) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_COMMENT_API_END_POINT}/create`, {
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

export const createPostReplyRequest = async (
  token: string,
  data: { boardId: number; parentCommentId: number; content: string }
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_COMMENT_API_END_POINT}/createReply`, {
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

export const getPostCommentDataRequest = async (token: string, id: number) => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_COMMENT_API_END_POINT}/update/${id}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const getPostCommentList = async ({
  postId,
  page,
}: {
  postId: number;
  page: number;
}) => {
  const json = await (
    await fetch(`${BOARD_COMMENT_API_END_POINT}/read/${postId}?page=${page || 1}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const deleteCommentRequest = async (
  token: string,
  id: number
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  const json = await (
    await fetch(`${BOARD_COMMENT_API_END_POINT}/delete/${id}`, {
      method: 'DELETE',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};

export const getPostLikeInfoRequest = async (boardId: number, page?: number) => {
  const json = await (
    await fetch(`${BOARD_LIKE_API_END_POINT}/read/${boardId}?page=${page || 1}`, {
      method: 'GET',
      headers,
    })
  ).json();
  if (json.error || json.errorCode) {
    throw new Error(`${json.status || json.errorCode}-${json.error || json.message}`);
  }
  return json;
};
