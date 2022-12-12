import { useQuery } from 'react-query';
import { getBoardList } from '../modules/board/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { Category, Order, Search } from '../modules/board/type';
import BoardItem from '../components/board/BoardItem';
import PageList from '../components/PageList';
import React from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../modules/user/atom';
import Loading from '../components/Loading';
import { AiOutlineComment, AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import {
  changeSearchParams,
  ChangeSearchParamsParam,
  clearSearchParams,
  ClearSearchParamsParam,
} from '../utils/url';

const categoryData = [
  ['', '전체'],
  ['VEGAN', '비건'],
  ['ENVIRONMENT', '환경'],
  ['QUESTION', 'Q&A'],
  ['FREE', '자유게시판'],
];

const orderData = [
  ['RECENT', '최신순'],
  ['POPULAR', '인기순'],
  ['COMMENT_COUNT', '댓글순'],
  ['VIEW', '조회순'],
];

function Board() {
  const location = useLocation();
  const navigate = useNavigate();
  let urlSearchParams = new URLSearchParams(location.search);
  const categoryParam = urlSearchParams.get('cat') || '';
  const queryParam = urlSearchParams.get('query') || '';
  const orderParam = urlSearchParams.get('order') || 'RECENT';
  const pageParam = urlSearchParams.get('page') || '1';
  const searchTypeParam = urlSearchParams.get('type') || 'TITLE';
  const currentUser = useRecoilValue(currentUserState);

  const { isLoading, data: boardList } = useQuery(
    ['BoardList', categoryParam, queryParam, orderParam, pageParam, searchTypeParam],
    () =>
      getBoardList({
        query: queryParam,
        page: Number(pageParam),
        order: orderParam as Order,
        category: categoryParam as Category,
        searchType: searchTypeParam as Search,
      }),
    {
      retry: 2,
      onSuccess: (res) => {
        console.log('BoardList onSuccess :', res, urlSearchParams.toString());
      },
      onError: (err) => {
        console.log('BoardList onError :', err);
      },
    }
  );

  const onNavigate = () => navigate(`${location.pathname}?${urlSearchParams.toString()}`);

  const changePath = (value: ChangeSearchParamsParam) => {
    urlSearchParams = changeSearchParams(urlSearchParams, value);
    onNavigate();
  };

  const clearPath = (value: ClearSearchParamsParam) => {
    urlSearchParams = clearSearchParams(urlSearchParams, value);
    onNavigate();
  };

  const handleChangeCategory = (value: string) => {
    value === ''
      ? navigate('/board')
      : changePath([
          ['cat', value],
          ['page', '1'],
          ['order', 'RECENT'],
        ]);
  };

  const handleCancleSearch = () => {
    changePath([
      ['order', 'RECENT'],
      ['page', '1'],
    ]);
    clearPath(['query', 'type']);
    const keywordInput = document.getElementById('keyword') as HTMLInputElement;
    keywordInput.value = '';
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const keyword = formData.get('keyword') as string;
    const type = formData.get('type') as string;
    if (!keyword) {
      alert('검색어를 입력해 주세요');
      return;
    }
    changePath([
      ['query', keyword],
      ['type', type],
      ['page', '1'],
    ]);
  };

  const handleChangeOrder = (value: string) => {
    changePath([
      ['order', value],
      ['page', '1'],
    ]);
  };

  // 글쓰기로이동
  const goToWritingPage = () =>
    navigate('/board/new', {
      state: {
        data: {
          category: '',
          title: '',
          content: '',
          contentImgList: [],
          tempImgList: [],
        },
      },
    });

  return (
    <section className="w-full max-w-6xl px-5 md:px-10">
      <div className="bg-gray-2 text-start p-3 md:p-6">
        <h1 className="font-bold text-xl md:text-2xl">이야기를 나눠요</h1>
        <p className="text-sm md:text-base">
          카테고리의 성격에 맞는 게시글을 작성해주세요 {':>'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row mt-5">
        <ul className="flex flex-row md:flex-col items-start mb-5 md:mb-0 md:pt-2 md:px-3 md:mr-6">
          {categoryData.map(([value, name]) => (
            <li
              key={value}
              onClick={() => handleChangeCategory(value)}
              className={`md:mb-3 cursor-pointer mx-2 md:mx-0 md:mr-0 ${
                categoryParam === value ? 'font-bold text-jghd-blue' : ''
              }`}
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="flex flex-col flex-1 items-start">
          <form className="flex w-full mb-4 text-sm md:text-base" onSubmit={onSubmit}>
            <select
              name="type"
              defaultValue="title?"
              className="border border-r-0 px-2 outline-none"
            >
              <option value="TITLE">제목</option>
              <option value="CONTENT">내용</option>
              <option value="WRITER">작성자</option>
            </select>
            <input
              id="keyword"
              name="keyword"
              className="w-full p-2 outline-none border border-l-0 mr-2"
              placeholder="검색어를 입력해 주세요!"
              minLength={1}
              maxLength={20}
            />
            {queryParam && (
              <button
                type="button"
                onClick={handleCancleSearch}
                className="bg-red-200 w-24 mr-2"
              >
                취소
              </button>
            )}
            <button type="submit" className="bg-gray-2 w-24">
              검색
            </button>
          </form>

          <div className="w-full flex items-center justify-between mt-2 mb-6">
            <ul className="flex items-center">
              {orderData.map(([value, name], i) => (
                <li
                  key={value}
                  className="flex items-center p-1 mr-1 text-sm md:text-base"
                >
                  <div
                    className={`w-1 h-1 rounded-full mr-1 ${
                      orderParam === value ? 'bg-jghd-blue' : 'bg-gray-3'
                    }`}
                  ></div>
                  <p
                    key={value}
                    onClick={() => handleChangeOrder(value)}
                    className={`cursor-pointer text-gray-3 ${
                      orderParam === value ? 'font-semibold text-gray-700' : ''
                    }`}
                  >
                    {name}
                  </p>
                </li>
              ))}
            </ul>
            {currentUser && (
              <button
                onClick={goToWritingPage}
                className="bg-jghd-blue text-white px-2 text-sm md:text-base py-1 md:px-4 md:py-2 rounded-md"
              >
                글쓰기
              </button>
            )}
          </div>

          <ul className="w-full mb-4">
            <li className="w-full flex items-center py-2 border-b border-black text-sm md:text-base font-semibold">
              <p className="w-1/12 text-center hidden md:block">번호</p>
              <p className="w-5/12 md:w-4/12 text-center">제목</p>
              <p className="w-2/12 text-center">글쓴이</p>
              <p className="w-2/12 text-center">작성일</p>
              <p className="w-1/12 text-center">
                <span className="hidden md:block">댓글수</span>
                <AiOutlineComment
                  className="w-full block md:hidden"
                  color="#6BCB77"
                  size={15}
                />
              </p>
              <p className="w-1/12 text-center">
                <span className="hidden md:block">조회수</span>
                <AiOutlineEye
                  className="w-full block md:hidden"
                  color="#ff8787"
                  size={15}
                />
              </p>
              <p className="w-1/12 text-center">
                <span className="hidden md:block">좋아요</span>
                <AiOutlineLike
                  className="w-full block md:hidden"
                  color="#4D96FF"
                  size={15}
                />
              </p>
            </li>
            {!isLoading ? (
              boardList && boardList?.boardItemList?.length > 0 ? (
                boardList?.boardItemList?.map((board, i) => (
                  <BoardItem
                    key={board.boardId}
                    board={board}
                    categoryParam={categoryParam}
                    isLastBoard={
                      board ===
                      boardList.boardItemList[boardList.boardItemList.length - 1]
                    }
                  />
                ))
              ) : (
                <div className="mt-10 text-center">아직 게시물이 없습니다</div>
              )
            ) : (
              <Loading />
            )}
          </ul>

          {boardList && boardList?.boardItemList?.length > 0 && (
            <PageList
              currentPage={boardList?.currentPage}
              endPage={boardList?.totalPage}
              color="blue"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Board;
