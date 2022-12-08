import {
  cancelLikePostRequest,
  getPostLikeInfoRequest,
  getPostRequest,
  likePostRequest,
} from './../../modules/board/api';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { createPostCommentRequest, deletePostRequest } from '../../modules/board/api';
import { ICommentList, Like, LikeInfo, Post } from '../../modules/board/type';

interface DeletePostType {
  code: number;
  message: string;
}

interface DeletePostVariables {
  token: string;
  id: number;
  goToBoardPage: () => void;
}

interface LikePostVariables {
  token: string;
  postId: number;
  userId: number;
}

interface CancleLikePostVariables {
  token: string;
  postId: number;
  likeId: number;
}

interface CreatePostCommentVariables {
  token: string;
  data: { boardId: number; content: string };
}

export const useGetPost = (
  id: number,
  options?: UseQueryOptions<Post, Error, Post, [string, number]>
) => {
  return useQuery(['Post', id], () => getPostRequest(id), {
    ...options,
    retry: 1,
    onSuccess: (res) => {
      console.log('getPost onSuccess:', res);
    },
    onError: (err) => {
      console.log('getPost onError:', err);
    },
  });
};

export const useGetPostLikeInfo = (
  id: number,
  options?: UseQueryOptions<LikeInfo, Error, LikeInfo, [string, number]>
) => {
  return useQuery(['PostLikeInfo', id], () => getPostLikeInfoRequest(id), {
    ...options,
    retry: 1,
    onSuccess: (res) => {
      console.log('getPostLike onSuccess:', res);
    },
    onError: (err) => {
      console.log('getPostLike onError:', err);
    },
  });
};

// <DeletePostType, ErrorType, DeletePostType>
// deletePost(variables: { token: string; id: number; },
// options?: MutateOptions<any, unknown, { token: string; id: number; }, unknown> | undefined): void
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation<DeletePostType, Error, DeletePostVariables>(
    ({ token, id }) => deletePostRequest(token, id),
    {
      // ...options,
      onSuccess: (data, variables, context) => {
        console.log('deletePostMutation res :', data, variables, context);
        if (data.code === 200) {
          queryClient.invalidateQueries({ queryKey: ['BoardList'] });
          toast.success(data.message);
          variables.goToBoardPage();
        }
      },
      onError: (data, variables, context) => {
        console.log('deletePostMutation err :', data, variables, context);
        toast.error(data.message);
      },
    }
  );
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation<Like, Error, LikePostVariables>(
    ({ token, postId, userId }) => likePostRequest(token, postId, userId),
    {
      onSuccess: (data, variables, context) => {
        console.log('likePost onSuccess', data, variables, context);
        queryClient.invalidateQueries({ queryKey: ['Like', variables.postId] });
      },
      onError: (err, variables, context) => {
        console.log('likePost onError', err, variables, context);
      },
    }
  );
};

export const useCancelLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation<Like, Error, CancleLikePostVariables>(
    ({ token, likeId }) => cancelLikePostRequest(token, likeId),
    {
      onSuccess: (data, variables, context) => {
        console.log('cancelLikePost onSuccess :', data, variables, context);
        queryClient.invalidateQueries({ queryKey: ['Post', variables.postId] });
        queryClient.invalidateQueries({ queryKey: ['Like', variables.postId] });
      },
      onError: (err, variables, context) => {
        console.log('cancelLikePost onError : error', err, variables, context);
        toast.error(err.message.split('-')[1]);
      },
    }
  );
};

// options?: UseMutationOptions<ICommentList, Error, ICommentList>
export const useCreatePostComment = () => {
  const queryClient = useQueryClient();
  return useMutation<ICommentList, Error, CreatePostCommentVariables>(
    ({ token, data }) => createPostCommentRequest(token, data),
    {
      onSuccess: (data, variables, context) => {
        console.log('createPostComment onSuccess', data, variables, context);
        queryClient.invalidateQueries({
          queryKey: ['PostCommentList', variables.data.boardId],
        });
      },
      onError: (err, variables, context) => {
        console.log('createPostComment onError', err, variables, context);
        const [code, message] = err.message.split('-');
        toast.error(message);
        // if (code === 'EXPIRE_ACCESS_TOKEN') {
        //   navigate('/register', { state: { path: `/board/${id}` } });
        // }
      },
    }
  );
};
