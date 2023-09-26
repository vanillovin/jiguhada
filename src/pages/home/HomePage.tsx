import { Link } from 'react-router-dom';

import HomeBoardList from '../../components/home/HomeBoardList';
import ChallengeItem from '../../components/challenge/ChallengeItem';

export default function HomePage() {
  return (
    <main className="w-full max-w-6xl px-5 md:px-10 ">
      <section className="">
        <article className="bg-amber-900/30 rounded-sm w-full h-40 p-5 sm:p-10 shadow-md flex items-center">
          <img src="./earth.png" className="w-20 h-20 sm:w-24 sm:h-24" />
          <div className="pl-4">
            <h1 className="font-bold text-2xl sm:text-3xl leading-4">
              지구하다
              <span className="pl-2 text-sm sm:text-base font-medium">
                - 더디고 오래다. 땅이 오래도록 변함이 없다.
              </span>
            </h1>
            <p className="font-medium text-sm sm:text-base text-white/95 mt-2">
              당신의 작은 행동 하나가 지구를 바꿉니다. 환경보호를 위한 챌린지에 동참해 보세요!
            </p>
          </div>
        </article>

        <article className="mt-8">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">게시판</h2>
            <Link className="text-lg md:text-xl ml-1 text-gray-600 p-1" to="/board">
              {'>'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="">
              <h3 className="text-base md:text-lg font-bold mt-2">인기 게시글 ✨</h3>
              <HomeBoardList order="POPULAR" />
            </div>

            <div className="">
              <h3 className="text-base md:text-lg font-bold mt-2">최신 게시글 🔥</h3>
              <HomeBoardList order="RECENT" />
            </div>
          </div>
        </article>

        <article className="mt-10">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">최근 올라온 챌린지</h2>
            <Link className="text-lg md:text-xl ml-1 text-gray-600 p-1" to="/challenge">
              {'>'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
            {[].slice(0, 4).map((item, idx) => (
              <ChallengeItem key={idx} c={item} />
              // <div key={idx} className="flex flex-col p-2 border border-gray-300 rounded-sm">
              //   <img className="" src={item.challengeImgUrl} />
              //   <p className=''>{item.challengeTitle}</p>
              // </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
