import { useState } from 'react';
import { BsPersonFill } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import PageList from '../components/PageList';
import { getChallengeList } from '../modules/challenge/api';
import { CahllengeCategory, ChallengeTag } from '../modules/challenge/type';
import { currentUserState } from '../modules/user/atom';
import {
  challengeAuthFrequencyNames,
  challengeListCategoryData,
  challengeListOrderData,
  challengeListTagsNameObj,
  challengePeroidNames,
  getChallengeDefaultImgUrl,
  tagsData,
} from '../modules/challenge/data';

function test(sdate: string) {
  const [y, m, d] = sdate.split('T')[0].split('-');
  let today = new Date().getTime();
  let dday = new Date(+y, +m - 1, +d).getTime();
  let gap = dday - today;
  let result = Math.ceil(gap / (1000 * 60 * 60 * 24));
  return result;
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
      `ChallengeList`,
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
      }),
    {
      refetchOnWindowFocus: false,
    }
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
          {challengeListCategoryData.map(([value, name]) => (
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
              className="flex items-center mb-2 cursor-pointer font-medium"
              onClick={() => setOpenTags((prev) => !prev)}
            >
              태그로 찾기{' '}
              <span className="ml-1 text-sm select-none">{!openTags ? '▶' : '▼'}</span>
            </button>
            {openTags
              ? categoryParam === ''
                ? Object.keys(tagsData).map((cat) => {
                    return (
                      <div key={cat} className={`flex itmes-center my-1 ml-1`}>
                        <h3 className="pt-2 w-10">
                          {(cat === 'VEGAN' && '비건') ||
                            (cat === 'ETC' && '기타') ||
                            '환경'}
                        </h3>
                        <div className="flex-wrap flex-1">
                          {tagsData[cat as CahllengeCategory].map((tag) => (
                            <button
                              key={tag.name}
                              onClick={() =>
                                handleChageTagList(tag.value as ChallengeTag)
                              }
                              className={`select-none border border-gray-3 rounded-sm px-2 py-1 text-sm mr-1 mt-1
                          ${
                            tagList.includes(tag.value)
                              ? 'bg-gray-3 text-white'
                              : 'text-gray-4'
                          }
                        `}
                            >
                              {tag.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                : tagsData[categoryParam as CahllengeCategory].map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleChageTagList(tag.value as ChallengeTag)}
                      className={`select-none border border-gray-3 rounded-sm px-2 py-1 text-sm mr-1 mt-1
                          ${
                            tagList.includes(tag.value)
                              ? 'bg-gray-3 text-white'
                              : 'text-gray-4'
                          }
                        `}
                    >
                      {tag.name}
                    </button>
                  ))
              : null}
          </div>

          <div className="w-full flex items-center justify-between mt-2 mb-6">
            <ul className="flex items-center">
              {challengeListOrderData.map(([value, name], i) => (
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
                onClick={() => navigate(`/challenge/${c.challengeId}`)}
                className={`border rounded-sm p-2 w-full cursor-pointer ${
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
                  <div className="flex items-center absolute top-2 right-2 bg-black bg-opacity-40 p-1 rounded-sm text-white text-xs">
                    <BsPersonFill size={14} />
                    {c.currentParticipantsCount}명
                  </div>
                  {/* {test(c.challengeStartDate) === 1 && (
                    <div className="w-full bg-black bg-opacity-40 absolute left-0 bottom-0 text-center text-white text-sm py-1">
                      마감까지 00:00:00
                    </div>
                  )} */}
                </div>
                <div className="p-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{c.challengeTitle}</h2>
                    <p className="text-sm">
                      {(c.challengeStatus === 'BEFORE' &&
                        `D-${test(c.challengeStartDate)}`) ||
                        (c.challengeStatus === 'INPROGRESS' && '진행중') ||
                        (c.challengeStatus === 'END' && '종료')}
                    </p>
                  </div>
                  <ul className="flex text-sm flex-wrap mt-1">
                    <li className="mr-1 font-medium">
                      #{challengeAuthFrequencyNames[c.authFrequency]}
                    </li>
                    <li className="mr-1 font-medium">
                      #{challengePeroidNames[c.challengePeroid]}
                    </li>
                    {/* <li className="mr-1">#{c.authFrequency}</li> */}
                    {c.challengeTagList.map((t: ChallengeTag) => (
                      <li key={t} className="mr-1 font-medium">
                        #{challengeListTagsNameObj[t]}
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
