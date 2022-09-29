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

interface Comment {
  commentId: number;
  username: string;
  nickname: string;
  content: string;
  createdDate: string;
}

export interface Like {
  likeId?: number;
  username?: string;
  nickname?: string;
  userId?: number;
}

export interface Post {
  error?: string;
  userId: number;
  boardId: number;
  title: string;
  content: string;
  createDate: string;
  viewCount: number;
  boardCategory: string;
  username: string;
  nickname: string;
  commentList: Comment[];
  likeList: Like[];
  imgList: Img[];
}
