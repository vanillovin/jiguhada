import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { getBoardList } from '../modules/board/api';
import { displayedAt, getBoardCatText, getDateText } from '../utils';

function Home() {
  const navigate = useNavigate();
  const { data: recentBoardList } = useQuery([`HomeRecentBoard`], () =>
    getBoardList({ order: 'RECENT' })
  );
  const { data: popularBoardList } = useQuery([`HomePopularBoard`], () =>
    getBoardList({ order: 'POPULAR' })
  );

  return (
    <main className="w-full max-w-6xl px-5 md:px-10">
      {/* <h1></h1> */}

      <section className="">
        <article className=""></article>

        <article className="">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-semibold">게시판</h2>
            <button
              className="text-lg md:text-xl ml-1 text-gray-600 px-1"
              onClick={() => navigate('/board')}
            >
              {'>'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <h3 className="text-base md:text-lg font-semibold mt-2">인기 게시글 ✨</h3>
              <ul className="mt-1">
                {popularBoardList?.boardItemList.slice(0, 10).map((pb, i) => (
                  <li
                    key={pb.boardId}
                    className={`cursor-pointer p-1 ${
                      i === 9 ? 'border-0' : 'border-b'
                    } hover:bg-gray-1`}
                    onClick={() => navigate(`board/${pb.boardId}`)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm md:text-base">
                        <span className="mr-1 font-medium">
                          [{getBoardCatText(pb.category)}]
                        </span>
                        {pb.boardTitle}
                      </h4>
                      <h5 className="text-2xs md:text-xs text-gray-4 ml-2">
                        <span>{displayedAt(new Date(pb.createDate).getTime())}</span>
                        {/* <span className="font-medium ml-1 text-gray-5">{pb.writer}</span> */}
                      </h5>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="">
              <h3 className="text-base md:text-lg font-semibold mt-2">최신 게시글 🔥</h3>
              <ul className="mt-1">
                {recentBoardList?.boardItemList.slice(0, 10).map((pb, i) => (
                  <li
                    key={pb.boardId}
                    className={`cursor-pointer p-1 ${
                      i === 9 ? 'border-0' : 'border-b'
                    } hover:bg-gray-1`}
                    onClick={() => navigate(`board/${pb.boardId}`)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm md:text-base">
                        <span className="mr-1 font-medium">
                          [{getBoardCatText(pb.category)}]
                        </span>
                        {pb.boardTitle}
                      </h4>
                      <h5 className="text-2xs md:text-xs text-gray-4 ml-2">
                        <span>{displayedAt(new Date(pb.createDate).getTime())}</span>
                        {/* <span className="font-medium ml-1 text-gray-5">{pb.writer}</span> */}
                      </h5>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Home;
