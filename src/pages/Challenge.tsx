import { useEffect, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';
import { useQuery } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Error from '../components/Error';
import { getChallengeRequest, getIsJoinChallengeRequest } from '../modules/challenge/api';
import {
  challengeAuthFrequencyNames,
  challengeListTagsNameObj,
  challengePeroidNames,
} from '../modules/challenge/data';
import { GetChallenge, IsJoinChallenge } from '../modules/challenge/type';
import { currentUserState } from '../modules/user/atom';
import { getBoardCatText, getDateText } from '../utils';

interface ErrorInfo {
  errorCode: string;
  message: string;
}

export default function Challenge() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState);
  const { id } = useParams<{ id: string }>();
  const { data, error } = useQuery<GetChallenge, ErrorInfo>(
    ['Challenge', id],
    () => getChallengeRequest(currentUser?.accessToken, Number(id)),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
  console.log('Challenge data:', data, '/ error:', error);
  const [isJoin, setIsJoin] = useState<IsJoinChallenge | null>();

  useEffect(() => {
    if (currentUser) {
      getIsJoinChallengeRequest(currentUser.userid, Number(id)).then((data) => {
        setIsJoin(data);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (error?.errorCode === 'REQUEST_NOT_INCLUDE_TOKEN') {
      if (confirm('로그인 하시겠습니까?')) {
        navigate('/register', {
          state: { path: location.pathname },
        });
      } else {
        navigate(-1);
      }
    }
  }, [error, navigate]);

  if (error?.errorCode === 'BAD_REQUEST') return <Error message={error.message} />;

  return (
    <section className="w-full max-w-6xl px-5 md:px-10">
      <div className="flex w-full border">
        <img src={data?.challengeImg} className="w-1/4" />
        <div className="bg-gray-1 flex flex-1 items-center justify-between px-4 py-2">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{data?.challengeTitle}</h1>
            <ul className="flex flex-wrap items-center">
              {data?.challengeTag?.map((tag) => (
                <li key={tag} className="mr-1 font-medium text-sm md:text-base">
                  #{challengeListTagsNameObj[tag]}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-end flex-wrap text-gray-5 text-sm md:text-base">
            <p>{getDateText(data?.challengeStartDate)} -</p>
            <p>{getDateText(data?.challengeEndDate)}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col p-2 border my-2">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">챌린지 정보</h3>
          {currentUser && isJoin?.joinStatus === 'NOTJOIN' ? (
            <button className="cursor-pointer bg-jghd-red py-1 px-2 text-white rounded-sm">
              참가하기
            </button>
          ) : (
            <div className="bg-jghd-red py-1 px-2 text-white rounded-sm">
              현재 참가 중인 챌린지입니다
            </div>
          )}
        </div>
        <div className="border-b p-2">
          <h4 className="font-medium">평균 달성률</h4>
          <div className="text-sm text-gray-4 mt-1">
            <div className="w-full h-8 border border-amber-300">
              <div style={{ width: `${80}%` }} className="h-full bg-amber-100" />
            </div>
            <div className="w-full flex">
              {/* {data?.achievementRate > 0 && ( */}
              <div>0</div>
              {/* )} */}
              <div style={{ width: `${80 - 2}%` }} className=""></div>
              <div>80</div>
              {data?.achievementRate < 100 && <div className="flex-1 text-end">100</div>}
            </div>
          </div>
        </div>

        <div className="flex p-2">
          <div className="w-1/2">
            <h3 className="font-medium flex items-center mb-2">
              <BsPersonFill size={18} />
              현재 {data?.currrentParticipantsCount} /
              <span className="font-bold ml-1">{data?.participantsCount}</span> 명
            </h3>
            <ul className="flex flex-wrap">
              <li className="bg-gray-200 rounded-md mr-1 mb-1 px-1">
                {data?.isOfficial ? '공식 챌린지' : '개설 챌린지'}
              </li>
              <li className="bg-gray-200 rounded-md mr-1 mb-1 px-1">
                {challengeAuthFrequencyNames[data?.authFrequency]}
              </li>
              <li className="bg-gray-200 rounded-md mr-1 mb-1 px-1">
                {challengePeroidNames[data?.challengePeroid]}
              </li>
            </ul>
          </div>
          <div className="w-1/2">
            <h3 className="font-medium mb-2">챌린지 호스트</h3>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-1"
                src={data?.challengeManagerImgUrl}
              />
              <h4>{data?.challengeManagerName}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="md:h-[650px] flex flex-col md:flex-row w-full rounded-sm border">
        <div className="flex flex-col w-full md:w-3/5 h-[450px] md:h-full md:border-r">
          <div className="w-full flex justify-between border-b p-3">
            <div className="flex flex-col md:flex-row">
              <div className="flex items-center mb-1 md:items-start md:flex-col mr-3 md:mb-0">
                <h2 className="text-sm md:text-base font-medium">{id}</h2>
                <h3 className="text-sm text-gray-4 mt-0 ml-1 md:mt-1 md:ml-0">
                  {getBoardCatText(data?.challengeCategory)}
                </h3>
              </div>
              <div className="flex flex-col justify-between">
                <h1 className="font-semibold md:text-lg">{data?.challengeTitle}</h1>
                <h2 className="flex items-center text-sm md:text-base">
                  {/* {post?.nickname} ·{' '} */}
                  <span className="ml-1 text-gray-3 text-xs">{/* {date} */}</span>
                </h2>
              </div>
            </div>
            <div className="relative">
              <button onClick={() => {}}>
                <BiDotsHorizontalRounded size={28} />
              </button>
            </div>
          </div>
          <div
            className="w-full h-full px-3 pt-4 pb-7 scroll-smooth overflow-auto bg-gray-1 
                      text-sm md:text-base leading-6 md:leading-7"
          >
            <h2 className="font-medium text-lg">챌린지 소개</h2>
            <p>{data?.challengeAddDetails}</p>

            <h2 className="font-medium text-lg mt-4">챌린지 기간</h2>
            <p>
              {getDateText(data?.challengeStartDate)} -{' '}
              {getDateText(data?.challengeEndDate)}
            </p>

            <h2 className="font-medium text-lg mt-4">챌린지 인증 방법</h2>
            <p>{data?.authMethodContent}</p>
            {(data?.authMethodImgUrl || data?.authMethodFailImgUrl) && (
              <div className="flex">
                <div className="text-center mr-2">
                  {data.authMethodImgUrl ? (
                    <img
                      className="w-44 h-52 rounded-tl-sm rounded-tr-sm"
                      src={data?.authMethodImgUrl}
                    />
                  ) : (
                    <div className="text-gray-3 w-44 h-52 rounded-tl-sm rounded-tr-sm border border-b-0 flex items-center justify-center">
                      사진이 없어요!
                    </div>
                  )}
                  <div className="text-white bg-green-600 rounded-bl-sm rounded-br-sm">
                    O
                  </div>
                </div>
                <div className="text-center">
                  {data.authMethodFailImgUrl ? (
                    <img
                      className="w-44 h-52 rounded-tl-sm rounded-tr-sm"
                      src={data?.authMethodFailImgUrl}
                    />
                  ) : (
                    <div className="text-gray-3 w-44 h-52 rounded-tl-sm rounded-tr-sm border border-b-0 flex items-center justify-center">
                      사진이 없어요!
                    </div>
                  )}
                  <div className="text-white bg-red-600 rounded-bl-sm rounded-br-sm">
                    X
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/5 h-[450px] md:h-full flex flex-col justify-between border-t md:border-t-0">
          <div className="p-3 overflow-y-auto cmt">
            <p className="mb-2 font-medium text-sm md:text-base">인증수 {0}개</p>
            {/* <CommentList id={id as string} /> */}
          </div>

          <div>
            <form className="flex items-center border-t" onSubmit={() => {}}>
              <input
                id="comment"
                name="content"
                className="outline-none flex-1 py-2 px-3"
              />
              {/* <button
                type="button"
                onClick={() => {}}
                className={`py-1 px-3 ${true ? 'text-jghd-blue' : ''}`}
              >
                첨부
              </button> */}
              <button
                type="submit"
                // disabled
                onClick={() => {}}
                className={`py-1 px-3 ${true ? 'text-jghd-green' : ''}`}
              >
                입력
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
