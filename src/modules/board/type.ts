export type Category = '' | 'ENVIRONMENT' | 'FREE' | 'VEGAN' | 'QUESTION';

export type Order = 'RECENT' | 'POPULAR' | 'VIEW' | 'COMMENT_COUNT';

export type Search = 'WRITER' | 'CONTENT' | 'TITLE';

export interface BoardItem {
  category: Category;
  boardId: number;
  boardTitle: string;
  writer: string;
  createDate: string;
  commentCount: number;
  viewCount: number;
  likeCount: number;
}

export interface BoardList {
  totalBoardCount: number;
  currentPage: number;
  totalPage: number;
  boardItemList: BoardItem[];
}

export interface BoardListParams {
  query?: string;
  page?: number;
  order?: Order;
  category?: Category;
  searchType?: Search;
}

export interface CreateBoard {
  title: string;
  content: string;
  category: string;
  imgList: string[] | [];
  deletedImgList: string[] | [];
}

export interface Img {
  imgId: number;
  imgUrl: string;
}

export interface ChildComment {
  parentCommentId: number;
  commentId: number;
  username: string;
  nickname: string;
  content: string;
  createdDate: string;
}

export interface Comment {
  boardId: number;
  boardTitle: string;
  boardCategory: string;
  commentId: number;
  commentContent: string;
  commentCount: number;
  nickname: string;
  userId: number;
  userImg: string;
  commentCreateDate: string;
  commentUpdateDate: string;
}

export interface CommentList {
  totalCommentCount: number;
  currentPage: number;
  totalPage: number;
  commentList: Comment[];
}

export interface Like {
  likeId?: number;
  userId?: number;
  username?: string;
  nickname?: string;
  userImgUrl?: string;
}

export interface Likes {
  currentPage: number;
  totalLikeCount: number;
  totalPage: number;
  likeList: Like[];
}

export interface Post {
  error?: string;
  boardId: number;
  title: string;
  content: string;
  viewCount: number;
  boardCategory: string;
  username: string;
  userId: number;
  userImgUrl: string;
  nickname: string;
  commentCount: number;
  likeCount: number;
  createDate: string;
  updateDate: string;
}
