import { useQuery } from 'react-query';
import { getBoardList } from '../modules/board/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Category, Order, Search } from '../modules/board/type';
import BoardItem from '../components/board/BoardItem';

function Board() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const categoryParam = urlSearchParams.get('cat') || '';
  const queryParam = urlSearchParams.get('query') || '';
  const orderParam = urlSearchParams.get('order') || 'RECENT';
  const pageParam = urlSearchParams.get('page') || 1;
  const searchTypeParam = urlSearchParams.get('type') || 'TITLE';

  const { data: boardList } = useQuery(
    [
      'boardList',
      categoryParam,
      queryParam,
      orderParam,
      pageParam,
      searchTypeParam,
    ],
    () =>
      getBoardList({
        query: queryParam,
        page: Number(pageParam),
        order: orderParam as Order,
        category: categoryParam as Category,
        searchType: searchTypeParam as Search,
      })
  );
  // console.log('Board boardList', boardList?.boardItemList);

  const clearSearchParams = (name: string | string[]) => () => {
    if (Array.isArray(name)) {
      name.forEach((n) => urlSearchParams.delete(n));
    } else {
      urlSearchParams.delete(name);
    }
    navigate(`${location.pathname}?${urlSearchParams.toString()}`);
  };

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

  return (
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
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const keyword = formData.get('keyword') as string;
              const type = formData.get('type') as string;
              if (!keyword) {
                alert('검색어를 입력해 주세요');
                return;
              }
              changeSearchParams([
                ['query', keyword],
                ['type', type],
              ])();
            }}
          >
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
              name="keyword"
              className="w-full p-2 outline-none border border-l-0 mr-2"
              placeholder="검색어를 입력해 주세요!"
            />
            {queryParam && (
              <button
                onClick={clearSearchParams(['query', 'type'])}
                className="bg-red-200 w-24 mr-2"
              >
                취소
              </button>
            )}
            <button type="submit" className="bg-gray-2 w-24">
              검색
            </button>
          </form>

          <ul className="mb-4 flex items-center">
            {[
              ['RECENT', '최신순'],
              ['POPULAR', '인기순'],
              ['COMMENT_COUNT', '댓글순'],
              ['VIEW', '조회순'],
            ].map(([value, name], i) => (
              <div key={value} className="flex items-center p-1 mr-2 text-sm">
                <span
                  className={`font-extrabold mr-1 ${
                    orderParam === value ? 'text-jghd-green' : 'text-gray-4'
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
            <li className="w-full flex items-center py-2 border-b border-black text-sm md:text-base font-semibold">
              <p className="w-1/12 text-center">번호</p>
              <p className="w-4/12 text-center">제목</p>
              <p className="w-2/12 text-center">글쓴이</p>
              <p className="w-2/12 text-center">작성일</p>
              <p className="w-1/12 text-center">댓글수</p>
              <p className="w-1/12 text-center">조회수</p>
              <p className="w-1/12 text-center">좋아요</p>
            </li>
            {boardList?.boardItemList && boardList.boardItemList.length > 0 ? (
              boardList?.boardItemList?.map((board, i) => (
                <BoardItem
                  key={board.boardId}
                  board={board}
                  categoryParam={categoryParam}
                />
              ))
            ) : (
              <div className="mt-10 text-center">아직 게시물이 없습니다</div>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Board;
