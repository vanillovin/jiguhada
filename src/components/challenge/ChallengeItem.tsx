import { BsPersonFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import {
  challengeAuthFrequencyNames,
  challengeListTagsNameObj,
  challengePeroidNames,
  getChallengeDefaultImgUrl,
} from '../../modules/challenge/data';
import { Challenge, ChallengeTag } from '../../modules/challenge/type';
import ChallengeDdayCount from './ChallengeDdayCount';

function test(sdate: string) {
  const [y, m, d] = sdate.split('T')[0].split('-');
  let today = new Date().getTime();
  let dday = new Date(+y, +m - 1, +d).getTime();
  let gap = dday - today;
  let result = Math.ceil(gap / (1000 * 60 * 60 * 24));
  return result;
}

function ChallengeItem({ c }: { c: Challenge }) {
  const navigate = useNavigate();

  return (
    <li
      key={c.challengeId}
      onClick={() => navigate(`/challenge/${c.challengeId}`)}
      className={`border rounded-sm p-4 sm:p-3 md:p-2 w-full cursor-pointer ${
        c.challengeStatus !== 'BEFORE' || test(c.challengeStartDate) < 0
          ? 'opacity-60'
          : ''
      }`}
    >
      <div className="relative">
        <img
          className={`rounded-sm w-full sm:h-48 md:max-h-44`}
          src={
            c.challengeImgUrl === 'imgUrl' || c.challengeImgUrl === ''
              ? getChallengeDefaultImgUrl('ETC')
              : c.challengeImgUrl
          }
        />
        <div
          className="flex items-center absolute top-2 right-2 bg-black bg-opacity-40 
          py-1 px-2 rounded-sm text-white text-sm"
        >
          <BsPersonFill size={14} />
          {c.currentParticipantsCount}명
        </div>
        {test(c.challengeStartDate) === 1 && (
          <ChallengeDdayCount challengeStartDate={c.challengeStartDate} />
        )}
      </div>
      <div className="p-1 mt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{c.challengeTitle}</h2>
          <p className="text-sm">
            {
              // (test(c.challengeStartDate) > 0
              //   ? `D-${test(c.challengeStartDate)}`
              // : '진행 중') ||
              (c.challengeStatus === 'BEFORE' && '시작 전') ||
                (c.challengeStatus === 'INPROGRESS' && '진행 중') ||
                (c.challengeStatus === 'END' && '종료')
            }
          </p>
        </div>
        <ul className="flex text-sm flex-wrap mt-1">
          <li className="mr-1 font-medium">
            #{challengeAuthFrequencyNames[c.authFrequency]}
          </li>
          <li className="mr-1 font-medium">#{challengePeroidNames[c.challengePeroid]}</li>
          {c.challengeTagList.map((t: ChallengeTag) => (
            <li key={t} className="mr-1 font-medium">
              #{challengeListTagsNameObj[t]}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default ChallengeItem;
