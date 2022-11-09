import {
  BoardList,
  BoardListParams,
  CreateBoard,
  Post,
  Like,
  Comment,
  Likes,
  CommentList,
} from './type';

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
  const { query, page, order, category, searchType } = params;
  try {
    if (query) {
      if (category) {
        return await (
          await fetch(
            `${BOARD_API_END_POINT}/list?query=${query}&page=${page}&order=${order}&category=${category}&searchType=${searchType}`,
            { headers }
          )
        ).json();
      } else {
        return await (
          await fetch(
            `${BOARD_API_END_POINT}/list?query=${query}&page=${page}&order=${order}&searchType=${searchType}`,
            { headers }
          )
        ).json();
      }
    } else if (category) {
      return await (
        await fetch(
          `${BOARD_API_END_POINT}/list?page=${page}&order=${order}&category=${category}`,
          { headers }
        )
      ).json();
    } else {
      return await (
        await fetch(`${BOARD_API_END_POINT}/list?page=${page}&order=${order}`, {
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
      await fetch(`${BOARD_API_END_POINT}/create`, {
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
  headers.set('Access-Control-Allow-Origin', `${import.meta.env.VITE_APP_LOCAL}`);
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  headers.set('Access-Control-Allow-Credentials', 'true');
  try {
    return await (
      await fetch(`${BOARD_API_END_POINT}/uploadImg`, {
        method: 'POST',
        body: formData,
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`이미지 파일 업로드를 실패했습니다. ${e}`);
  }
};

export const getPostRequest = async (id: number): Promise<Post> => {
  try {
    return await (
      await fetch(`${BOARD_API_END_POINT}/read/${id}`, {
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
      await fetch(`${BOARD_API_END_POINT}/delete/${id}`, {
        method: 'DELETE',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 삭제를 실패했습니다. ${e}`);
  }
};

export const getPrevPostDataRequest = async (token: string, id: number) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_API_END_POINT}/update/${id}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 수정 정보 가져오기를 실패했습니다. ${e}`);
  }
};

export const updatePostRequest = async (token: string, data: any) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_API_END_POINT}/update`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 업데이트를 실패했습니다. ${e}`);
  }
};

// Board Like
export const likePostRequest = async (
  token: string,
  boardId: number,
  userId: number
): Promise<Like[] | { errorCode: string }> => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_LIKE_API_END_POINT}/create/${boardId}?userId=${userId}`, {
        method: 'POST',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 좋아요를 실패했습니다. ${e}`);
  }
};

export const cancelLikePostRequest = async (token: string, likeId: number) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_LIKE_API_END_POINT}/delete/${likeId}`, {
        method: 'DELETE',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`게시글 좋아요 취소를 실패했습니다. ${e}`);
  }
};

// Board Comment
export const updatePostCommentRequest = async (
  token: string,
  data: { commentId: number; content: string }
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_COMMENT_API_END_POINT}/update`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`댓글 수정을 실패했습니다. ${e}`);
  }
};

export const createPostCommentRequest = async (
  token: string,
  data: { boardId: number; content: string }
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_COMMENT_API_END_POINT}/create`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`댓글을 작성하지 못했습니다. ${e}`);
  }
};

export const createPostReplyRequest = async (
  token: string,
  data: { boardId: number; parentCommentId: number; content: string }
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_COMMENT_API_END_POINT}/createReply`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`대댓글을 작성하지 못했습니다. ${e}`);
  }
};

export const getPostCommentDataRequest = async (token: string, id: number) => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_COMMENT_API_END_POINT}/update/${id}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`댓글 수정 데이터를 가져오지 못했습니다. ${e}`);
  }
};

export const getCommentsRequest = async (
  boardId: number,
  page: number
): Promise<CommentList> => {
  try {
    return await (
      await fetch(`${BOARD_COMMENT_API_END_POINT}/read/${boardId}?page=${page || 1}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`댓글 데이터를 가져오지 못했습니다. ${e}`);
  }
};

export const deleteCommentRequest = async (
  token: string,
  id: number
): Promise<Comment[]> => {
  headers.set('Authorization', token);
  try {
    return await (
      await fetch(`${BOARD_COMMENT_API_END_POINT}/delete/${id}`, {
        method: 'DELETE',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`댓글 삭제를 실패했습니다. ${e}`);
  }
};

// Board Like
export const getLikesRequest = async (boardId: number, page?: number): Promise<Likes> => {
  try {
    return await (
      await fetch(`${BOARD_LIKE_API_END_POINT}/read/${boardId}?page=${page || 1}`, {
        method: 'GET',
        headers,
      })
    ).json();
  } catch (e) {
    throw new Error(`좋아요 데이터를 가져오지 못했습니다. ${e}`);
  }
};
