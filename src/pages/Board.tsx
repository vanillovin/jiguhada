import { useQuery } from 'react-query';
import { AiOutlineComment, AiOutlineEye, AiOutlineLike } from 'react-icons/ai';
import { getBoardList } from '../modules/board/api';
import { getBoardCatText, getDateText } from '../utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { category, order } from '../modules/board/type';

function Board() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const categoryParam = urlSearchParams.get('cat') || '';
  const queryParam = urlSearchParams.get('q') || '';
  const orderParam = urlSearchParams.get('order') || 'RECENT';
  const pageParam = urlSearchParams.get('page') || 1;

  const { isLoading, data: boardList } = useQuery(
    ['boardList', categoryParam, queryParam, orderParam, pageParam],
    () =>
      getBoardList({
        query: queryParam,
        page: Number(pageParam),
        order: orderParam as order,
        category: categoryParam as category,
        // query: '',
        // page: 1,
        // order: 'RECENT',
        // category: 'VEGAN',
      })
  );
  // console.log('Board boardList', boardList?.boardItemList);

  const changeSearchParams =
    (obj: { name: string; value: string } | [string, string][]) => () => {
      if (Array.isArray(obj)) {
        obj.forEach(([name, value]) => {
          urlSearchParams.set(name, value);
        });
      } else {
        urlSearchParams.set(obj.name, obj.value);
      }
      navigate(`${location.pathname}?${urlSearchParams.toString()}`);
    };

  return !isLoading ? (
    <section className="w-full max-w-6xl px-10">
      <div className="bg-gray-2 text-start p-6">
        <h1 className="font-bold text-2xl">이야기를 나눠요</h1>
        <p>카테고리의 성격에 맞는 게시글을 작성해주세요 {':>'}</p>
      </div>

      <div className="flex flex-col md:flex-row mt-5">
        <ul className="flex flex-row md:flex-col items-start md:pt-2 md:px-3 md:mr-5">
          {[
            ['', '전체'],
            ['VEGAN', '비건'],
            ['ENVIRONMENT', '환경'],
            ['QUESTION', 'Q&A'],
            ['FREE', '자유게시판'],
          ].map(([value, name]) => (
            <li
              key={value}
              onClick={
                value === ''
                  ? () => navigate('/board')
                  : changeSearchParams({ name: 'cat', value })
              }
              className={`mb-3 cursor-pointer mr-3 md:mr-0 ${
                categoryParam === value ? 'font-bold text-jghd-green' : ''
              }`}
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="flex flex-col flex-1 items-start">
          <form
            className="flex w-full mb-4"
            onSubmit={() => console.log('onSubmit!')}
          >
            <select defaultValue="title?" className="border border-r-0 pl-2">
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="author">작성자</option>
            </select>
            <input
              className="w-full p-2 outline-none border border-l-0 mr-2"
              placeholder="검색어를 입력해 주세요!"
            />
            <button className="bg-gray-2 w-24">검색</button>
          </form>

          <ul className="mb-4 flex items-center">
            {[
              ['RECENT', '최신순'],
              ['VEGAN', '인기순'],
              ['COMMENT_COUNT', '댓글순'],
              ['VIEW', '조회순'],
            ].map(([value, name], i) => (
              <div className="flex items-center p-1 mr-2 text-sm">
                <span
                  className={`font-extrabold text-gray-4 mr-1 ${
                    orderParam === value ? 'text-jghd-green' : ''
                  }`}
                >
                  ·
                </span>
                <li
                  key={value}
                  onClick={changeSearchParams({ name: 'order', value })}
                  className={`cursor-pointer text-gray-4 ${
                    orderParam === value ? 'font-medium text-black' : ''
                  }`}
                >
                  {name}
                </li>
              </div>
            ))}
          </ul>

          <ul className="w-full">
            <li className="w-full flex items-center py-2 border-b text-sm md:text-base font-semibold">
              <p className="w-1/12 text-center">번호</p>
              <p className="w-4/12 text-center">제목</p>
              <p className="w-2/12 text-center">글쓴이</p>
              <p className="w-2/12 text-center">작성일</p>
              <p className="w-1/12 text-center">댓글수</p>
              <p className="w-1/12 text-center">조회수</p>
              <p className="w-1/12 text-center">좋아요</p>
            </li>
            {boardList?.boardItemList &&
            boardList?.boardItemList?.length > 0 ? (
              boardList?.boardItemList?.map((board, i) => (
                <li
                  key={board.boardId}
                  className={`${'border-b'}
                w-full flex items-center py-3 text-sm md:text-base font-light`}
                >
                  <p className="w-1/12 text-center text-gray-4">
                    {board.boardId}
                  </p>
                  <p className="w-4/12 font-normal">
                    {!categoryParam
                      ? `[${getBoardCatText(board.category)}]`
                      : ''}{' '}
                    {board.boardTitle}
                  </p>
                  <p className="w-2/12 text-center">{board.writer}</p>
                  <p className="w-2/12 text-center tracking-tighter text-gray-4">
                    {getDateText(board.createDate)}
                  </p>
                  <p className="w-1/12 flex items-center justify-center">
                    <AiOutlineComment color="#6BCB77" size={15} />{' '}
                    <span className="ml-1 text-gray-4">
                      {board.commentCount}
                    </span>
                  </p>
                  <p className="w-1/12 flex items-center justify-center">
                    <AiOutlineEye color="#ff8787" size={15} />{' '}
                    <span className="ml-1 text-gray-4">{board.likeCount}</span>
                  </p>
                  <p className="w-1/12 flex items-center justify-center">
                    <AiOutlineLike color="#4D96FF" size={15} />{' '}
                    <span className="ml-1 text-gray-4">{board.viewCount}</span>
                  </p>
                </li>
              ))
            ) : (
              <div className="mt-10 text-center">아직 게시물이 없습니다</div>
            )}
          </ul>
        </div>
      </div>
    </section>
  ) : (
    <div>Loading...</div>
  );
}

export default Board;
