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

export interface Img {
  image_id: number;
  image_url: string;
}

export interface CreateBoard {
  title: string;
  content: string;
  category: string;
  imgList: Img[];
}
