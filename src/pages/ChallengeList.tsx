import { useState } from 'react';
import { BsPersonFill } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import PageList from '../components/PageList';
import { getChallengeList } from '../modules/challenge/api';
import { CahllengeCategory, ChallengeTag } from '../modules/challenge/type';
import { currentUserState } from '../modules/user/atom';
import { getChallengeDefaultImgUrl } from './CreateChallenge';

export const tagsNameObj = {
  VEGAN: '비건',
  VEGANRECIPE: '비건 레시피',
  VEGANBEAUTY: '비건 뷰티',
  VEGANFASHION: '비건 패션',
  PESCOVEGAN: '페스코',
  FLEXITERIANVEGAN: '플렉시테리언',
  ZERO_WASTE: '제로 웨이스트',
  ZEROENERGE: '제로 에너지',
  PLOGGING: '쓰레기 줍기',
  TUMBLER: '텀블러 사용',
  RECYCLING: '재활용',
  ETC: '기타',
  LIFESTYLE: '생활습관',
  ENVIRONMENT_DAY: '환경의 날',
  EARTH_DAY: '지구의 날',
  PLANT_DAY: '식목일',
  WATER_DAY: '물의 날',
  SEA_DAY: '바다의 날',
  BUY_NOTHING_DAY: '아무것도 사지 않는 날',
  VEGAN_DAY: '비건의 날',
  ENERGE_DAY: '에너지의 날',
};

const tagsData = [
  { cat: 'VEGAN', value: 'VEGAN', name: '비건' },
  { cat: 'VEGAN', value: 'VEGANRECIPE', name: '비건 레시피' },
  { cat: 'VEGAN', value: 'VEGANBEAUTY', name: '비건 뷰티' },
  { cat: 'VEGAN', value: 'VEGANFASHION', name: '비건 패션' },
  { cat: 'VEGAN', value: 'PESCOVEGAN', name: '페스코' },

  { cat: 'ENVIRONMENT', value: 'ZERO_WASTE', name: '제로 웨이스트' },
  { cat: 'ENVIRONMENT', value: 'ZEROENERGE', name: '제로 에너지' },
  { cat: 'ENVIRONMENT', value: 'PLOGGING', name: '쓰레기 줍기' },
  { cat: 'ENVIRONMENT', value: 'TUMBLER', name: '텀블러 사용' },
  { cat: 'ENVIRONMENT', value: 'RECYCLING', name: '재활용' },

  { cat: 'ETC', value: 'ETC', name: '기타' },
  { cat: 'ETC', value: 'LIFESTYLE', name: '생활습관' },
  { cat: 'ETC', value: 'ENVIRONMENT_DAY', name: '환경의 날' },
  { cat: 'ETC', value: 'EARTH_DAY', name: '지구의 날' },
  { cat: 'ETC', value: 'PLANT_DAY', name: '식목일' },
  { cat: 'ETC', value: 'WATER_DAY', name: '물의 날' },
  { cat: 'ETC', value: 'SEA_DAY', name: '바다의 날' },
  { cat: 'ETC', value: 'BUY_NOTHING_DAY', name: '아무것도 사지 않는 날' },
  { cat: 'ETC', value: 'VEGAN_DAY', name: '비건의 날' },
  { cat: 'ETC', value: 'ENERGE_DAY', name: '에너지의 날' },
];

const categoryData = [
  ['', '전체'],
  ['VEGAN', '비건'],
  ['ENVIRONMENT', '환경'],
];

const orderData = [
  ['RECENTLY', '최신순'],
  ['POPULAR', '인기순'],
];

function test(sdate: string) {
  const [y, m, d] = sdate.split('T')[0].split('-');
  let today = new Date().getTime();
  let dday = new Date(+y, +m - 1, +d).getTime();
  let gap = dday - today;
  let result = Math.ceil(gap / (1000 * 60 * 60 * 24));
  return `D-${result}`;
}

export default function ChallengeList() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(location.search);
  const categoryParam = urlSearchParams.get('cat') || '';
  const queryParam = urlSearchParams.get('query') || '';
  const orderParam = urlSearchParams.get('order') || 'RECENTLY';
  const pageParam = urlSearchParams.get('page') || '1';
  const searchTypeParam = urlSearchParams.get('type') || 'TITLE';
  const tagListParam = urlSearchParams.get('tagList') || '';
  const tagList = tagListParam ? tagListParam.split(',') : [];
  const currentUser = useRecoilValue(currentUserState);
  const [openTags, setOpenTags] = useState(true);

  const { data } = useQuery(
    [
      `${categoryParam}Challenge/${orderParam}/${pageParam}/${queryParam}/${searchTypeParam}/${tagListParam}`,
      categoryParam,
      queryParam,
      orderParam,
      pageParam,
      searchTypeParam,
      tagListParam,
    ],
    () =>
      getChallengeList({
        query: queryParam,
        page: Number(pageParam),
        order: orderParam,
        category: categoryParam,
        searchType: searchTypeParam,
        tagList: tagListParam,
      })
  );

  console.log('Challenge data:', data);

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

  const handleChageTagList = (value: ChallengeTag) => {
    if (!tagList.includes(value) && tagList.length > 2) return;

    if (tagList.includes(value)) {
      if (tagList.length === 1) {
        clearSearchParams('tagList')();
      } else {
        changeSearchParams({
          name: 'tagList',
          value: tagList.filter((tag) => tag !== value).join(','),
        })();
      }
    } else {
      changeSearchParams({
        name: 'tagList',
        value: [...tagList, value].join(','),
      })();
    }
  };

  const handleChangeCategory = (value: string) => {
    value === ''
      ? navigate('/challenge')
      : changeSearchParams([
          ['cat', value],
          ['page', '1'],
          ['order', 'RECENTLY'],
        ])();
  };

  const handleCancleSearch = () => {
    changeSearchParams([
      ['order', 'RECENTLY'],
      ['page', '1'],
    ])();
    clearSearchParams(['query', 'type'])();
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
    changeSearchParams([
      ['query', keyword],
      ['type', type],
      ['page', '1'],
    ])();
  };
  return (
    <section className="w-full max-w-6xl px-5 md:px-10">
      <div className="bg-gray-2 text-start p-3 md:p-6">
        <h1 className="font-bold text-xl md:text-2xl">챌린지</h1>
        <p className="text-sm md:text-base">
          지구를 지키는 다양한 챌린지 활동에 참여해봐요{':>'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row mt-5">
        <ul className="flex flex-row md:flex-col items-start mb-5 md:mb-0 md:pt-2 md:px-3 md:mr-5">
          {categoryData.map(([value, name]) => (
            <li
              key={value}
              onClick={() => handleChangeCategory(value)}
              className={`md:mb-3 cursor-pointer mx-2 md:mr-0 
                ${categoryParam === value ? 'font-bold text-jghd-green' : ''}
              `}
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="flex flex-col flex-1 items-start">
          <form onSubmit={onSubmit} className="flex w-full mb-4 text-sm md:text-base">
            <select
              name="type"
              defaultValue="title?"
              className="border border-r-0 px-2 outline-none"
            >
              <option value="TITLE">제목</option>
              <option value="CONTENT">내용</option>
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

          <div className="ml-1">
            <button
              className="flex items-center mb-1 cursor-pointer"
              onClick={() => setOpenTags((prev) => !prev)}
            >
              태그로 찾기{' '}
              <span className="ml-1 text-sm select-none">{openTags ? '▲' : '▼'}</span>
            </button>
            {openTags &&
              tagsData.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => handleChageTagList(tag.value as ChallengeTag)}
                  className={`select-none border border-gray-3 rounded-sm px-2 py-1 mr-1 mt-1 text-sm
                    ${
                      tagList.includes(tag.value) ? 'bg-gray-3 text-white' : 'text-gray-4'
                    }
                  `}
                >
                  {tag.name}
                </button>
              ))}
          </div>

          <div className="w-full flex items-center justify-between mt-2 mb-6">
            <ul className="flex items-center">
              {orderData.map(([value, name], i) => (
                <div
                  key={value}
                  className="flex items-center p-1 mr-1 text-sm md:text-base"
                >
                  <span
                    className={`font-extrabold mr-1 ${
                      orderParam === value ? 'text-jghd-green' : 'text-gray-4'
                    }`}
                  >
                    ·
                  </span>
                  <li
                    key={value}
                    className={`cursor-pointer text-gray-4 ${
                      orderParam === value ? 'font-medium text-black' : ''
                    }`}
                    onClick={changeSearchParams([
                      ['order', value],
                      ['page', '1'],
                    ])}
                  >
                    {name}
                  </li>
                </div>
              ))}
            </ul>
            {currentUser && (
              <button
                onClick={() => navigate('/challenge/new')}
                className="bg-jghd-green text-white px-2 text-sm md:text-base py-1 md:px-4 md:py-2 rounded-md"
              >
                개설하기
              </button>
            )}
          </div>

          {/* https://tailwindcss.com/docs/grid-template-columns */}
          <ul className="w-full mb-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {data?.challengeList?.map((c) => (
              <li
                key={c.challengeId}
                onClick={() => console.log(c.challengeId)}
                className={`border rounded-sm p-2 w-full ${
                  c.challengeStatus !== 'BEFORE' ? 'opacity-60' : ''
                }`}
              >
                <div className="relative">
                  <img
                    className={`rounded-sm w-full`}
                    src={
                      c.challengeImgUrl === 'imgUrl' || c.challengeImgUrl === ''
                        ? getChallengeDefaultImgUrl('ETC')
                        : c.challengeImgUrl
                    }
                  />
                  <div className="flex items-center absolute top-2 right-2 bg-black bg-opacity-40 px-2 rounded-sm text-white text-sm">
                    <BsPersonFill />
                    {c.currentParticipantsCount}
                  </div>
                </div>
                <div className="p-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{c.challengeTitle}</h2>
                    <p>
                      {(c.challengeStatus === 'BEFORE' && test(c.challengeStartDate)) ||
                        (c.challengeStatus === 'INPROGRESS' && '진행중') ||
                        (c.challengeStatus === 'END' && '종료')}
                    </p>
                  </div>
                  <ul className="flex text-sm flex-wrap">
                    {c.challengeTagList.map((t: ChallengeTag) => (
                      <li key={t} className="mr-1">
                        #{tagsNameObj[t]}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          {data && data.challengeList.length > 0 && (
            <PageList currentPage={data?.currentPage} endPage={data?.totalPage} />
          )}
        </div>
      </div>
    </section>
  );
}
