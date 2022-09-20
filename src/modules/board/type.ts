export type category = '' | 'ENVIRONMENT' | 'FREE' | 'VEGAN' | 'QUESTION';

export type order = 'RECENT' | 'POPULAR' | 'VIEW' | 'COMMENT_COUNT';

interface BoardItem {
  category: category;
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
  order?: order;
  category?: category;
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
