import { useNavigate } from 'react-router-dom';
import HomeBoardList from '../components/home/HomeBoardList';

function Home() {
  const navigate = useNavigate();

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
              <HomeBoardList order="POPULAR" />
            </div>

            <div className="">
              <h3 className="text-base md:text-lg font-semibold mt-2">최신 게시글 🔥</h3>
              <HomeBoardList order="RECENT" />
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Home;
