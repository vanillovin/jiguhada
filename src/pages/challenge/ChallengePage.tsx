import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';
import { useLocation, useNavigate } from 'react-router-dom';

import PageList from '../../components/PageList';
import { CahllengeCategory, ChallengeTag } from '../../modules/challenge/type';
import { currentUserState } from '../../modules/user/atom';
import { tagsData } from '../../modules/challenge/data';
import ChallengeItem from '../../components/challenge/ChallengeItem';
import { useGetChallengeList } from '../../hooks/queries/challenge';
import {
  changeSearchParams,
  ChangeSearchParamsParam,
  clearSearchParams,
  ClearSearchParamsParam,
} from '../../utils/urlUtils';

interface Tag {
  checked: boolean;
  value: ChallengeTag;
  name: string;
}

export default function ChallengePage() {
  const location = useLocation();
  const navigate = useNavigate();
  let urlSearchParams = new URLSearchParams(location.search);
  const categoryParam = urlSearchParams.get('cat') || '';
  const queryParam = urlSearchParams.get('query') || '';
  const orderParam = urlSearchParams.get('order') || 'RECENTLY';
  const pageParam = urlSearchParams.get('page') || '1';
  const searchTypeParam = urlSearchParams.get('type') || 'TITLE';
  const statusParam = urlSearchParams.get('status') || '';
  const tagListParam = urlSearchParams.get('tagList') || '';
  const tagList = tagListParam ? tagListParam.split(',') : [];
  const currentUser = useRecoilValue(currentUserState);
  const [openTags, setOpenTags] = useState(true);

  const params = {
    queryParam,
    pageParam,
    orderParam,
    categoryParam,
    searchTypeParam,
    statusParam,
    tagListParam: tagList as ChallengeTag[],
  };

  const { data } = useGetChallengeList(params, {
    onSuccess: (res) => {
      console.log('getChallengeList onSuccess res :', res);
    },
    onError: (err) => {
      console.log('getChallengeList onError err :', err);
      toast.error(err.message);
    },
  });

  console.log('ChallengeList data:', data, urlSearchParams.toString());

  const onNavigate = () => navigate(`${location.pathname}?${urlSearchParams.toString()}`);

  const changePath = (value: ChangeSearchParamsParam) => {
    urlSearchParams = changeSearchParams(urlSearchParams, value);
    onNavigate();
  };

  const clearPath = (value: ClearSearchParamsParam) => {
    urlSearchParams = clearSearchParams(urlSearchParams, value);
    onNavigate();
  };

  const handleChageTagList = (value: ChallengeTag) => {
    if (!tagList.includes(value) && tagList.length > 2) return;

    if (tagList.includes(value)) {
      if (tagList.length === 1) {
        clearPath('tagList');
      } else {
        changePath({
          name: 'tagList',
          value: tagList.filter((tag) => tag !== value).join(','),
        });
      }
    } else {
      changePath({
        name: 'tagList',
        value: [...tagList, value].join(','),
      });
    }
  };

  const handleChangeCategory = (value: string) => {
    value === ''
      ? navigate('/challenge')
      : changePath([
          ['cat', value],
          ['page', '1'],
          ['order', 'RECENTLY'],
        ]);
  };

  const handleCancleSearch = () => {
    changePath([
      ['order', 'RECENTLY'],
      ['page', '1'],
    ]);
    clearPath(['query', 'type']);
    const keywordInput = document.getElementById('keyword') as HTMLInputElement;
    keywordInput.value = '';
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleChangeStatus = (value: string) => {
    if (value === '') {
      clearPath('status');
    } else {
      changePath([
        ['status', value],
        ['page', '1'],
      ]);
    }
  };

  return (
    <section className="w-full max-w-6xl px-5 md:px-10">
      <div className="bg-gray-2 text-start p-3 md:p-6">
        <h1 className="font-bold text-xl md:text-2xl">챌린지</h1>
        <p className="text-sm md:text-base">지구를 지키는 다양한 챌린지 활동에 참여해봐요{':>'}</p>
      </div>

      <div className="flex flex-col md:flex-row mt-5">
        <ul className="flex flex-row md:flex-col items-start mb-5 md:mb-0 md:pt-2 md:px-3 md:mr-6">
          {challengeListCategoryData.map(([value, name]) => (
            <li
              key={value}
              onClick={() => handleChangeCategory(value)}
              className={`md:mb-3 cursor-pointer mx-2 md:mx-0 md:mr-0 
                ${categoryParam === value ? 'font-bold text-jghd-green' : ''}
              `}
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="flex flex-col flex-1 items-start">
          <form onSubmit={handleSearch} className="flex w-full mb-4 text-sm md:text-base">
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
              <button type="button" onClick={handleCancleSearch} className="bg-red-200 w-24 mr-2">
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
              태그로 찾기 <span className="ml-1 text-sm select-none">{!openTags ? '▶' : '▼'}</span>
            </button>
            {openTags
              ? categoryParam === ''
                ? Object.keys(tagsData).map((cat) => {
                    return (
                      <div key={cat} className={`flex itmes-center my-1 ml-1`}>
                        <h3 className="pt-2 w-10">
                          {(cat === 'VEGAN' && '비건') || (cat === 'ETC' && '기타') || '환경'}
                        </h3>
                        <div className="flex-wrap flex-1">
                          {tagsData[cat as CahllengeCategory].map((tag) => (
                            <TagButton
                              key={tag.name}
                              handleChageTagList={handleChageTagList}
                              tagList={tagList as ChallengeTag[]}
                              tag={tag as Tag}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })
                : tagsData[categoryParam as CahllengeCategory].map((tag) => (
                    <TagButton
                      key={tag.name}
                      handleChageTagList={handleChageTagList}
                      tagList={tagList as ChallengeTag[]}
                      tag={tag as Tag}
                    />
                  ))
              : null}
          </div>

          <div className="w-full flex justify-between mt-2 mb-6 items-start">
            <div>
              <ul className="flex items-center">
                {challengeListOrderData.map(([value, name], i) => (
                  <li key={value} className="flex items-center p-1 mr-1 text-sm md:text-base">
                    <p
                      key={value}
                      className={`cursor-pointer text-gray-3 ${
                        orderParam === value ? 'font-semibold text-gray-700' : ''
                      }`}
                      onClick={() => handleChangeOrder(value)}
                    >
                      {name}
                    </p>
                  </li>
                ))}
              </ul>
              <ul className="flex items-center">
                {challengeListStatusData.map(([value, name], i) => (
                  <li key={value} className="flex items-center p-1 mr-1 text-sm md:text-base">
                    <div
                      className={`${
                        statusParam === value ? 'bg-jghd-green' : 'bg-gray-3'
                      } w-1 h-1 rounded-full mr-1`}
                    ></div>
                    <p
                      key={value}
                      className={`cursor-pointer text-gray-3 ${
                        statusParam === value ? 'font-semibold text-gray-700' : ''
                      }`}
                      onClick={() => handleChangeStatus(value)}
                    >
                      {name}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {currentUser && (
              <button
                onClick={() => navigate('/challenge/new')}
                className="bg-jghd-green text-white px-2 text-sm md:text-base py-1 md:px-4 md:py-2 rounded-md font-medium"
              >
                개설하기
              </button>
            )}
          </div>

          <ul className="w-full mb-4 grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {data?.challengeList?.map((c) => (
              <ChallengeItem key={c.challengeId} c={c} />
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

const challengeListCategoryData = [
  ['', '전체'],
  ['VEGAN', '비건'],
  ['ENVIRONMENT', '환경'],
  ['ETC', '기타'],
];

const challengeListOrderData = [
  ['RECENTLY', '최신순'],
  ['POPULAR', '인기순'],
];

const challengeListStatusData = [
  ['', '전체'],
  ['BEFORE', '시작전'],
  ['INPROGRESS', '진행'],
  ['END', '종료'],
];

function TagButton({
  handleChageTagList,
  tagList,
  tag,
}: {
  handleChageTagList: (value: ChallengeTag) => void;
  tagList: ChallengeTag[];
  tag: Tag;
}) {
  return (
    <button
      onClick={() => handleChageTagList(tag.value)}
      className={`select-none border border-gray-3 rounded-sm px-2 py-1 text-sm mr-1 mt-1 ${
        tagList.includes(tag.value) ? 'bg-gray-3 text-white' : 'text-gray-4'
      }
    `}
    >
      {tag.name}
    </button>
  );
}
