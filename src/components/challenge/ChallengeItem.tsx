import { Link } from 'react-router-dom';
import { BsPersonFill } from 'react-icons/bs';

import {
  challengeAuthFrequencyNames,
  challengeListTagsNameObj,
  challengePeroidNames,
  getChallengeDefaultImgUrl,
} from '../../modules/challenge/data';
import ChallengeDdayCount from './ChallengeDdayCount';
import { IChallenge, ChallengeTag } from '../../modules/challenge/type';

function calculateDday(sdate: string) {
  const [y, m, d] = sdate.split('T')[0].split('-');
  let today = new Date().getTime();
  let dday = new Date(+y, +m - 1, +d).getTime();
  let gap = dday - today;
  let result = Math.ceil(gap / (1000 * 60 * 60 * 24));
  return result;
}

function ChallengeItem({ challenge }: { challenge: IChallenge }) {
  return (
    <Link
      to={`/challenge/${challenge.challengeId}`}
      className={`border rounded-sm p-4 sm:p-3 md:p-2 w-full cursor-pointer ${
        challenge.challengeStatus !== 'BEFORE' || calculateDday(challenge.challengeStartDate) < 0
          ? 'opacity-60'
          : ''
      }`}
    >
      <div className="relative">
        <img
          className={`rounded-sm w-full sm:h-48 md:max-h-44`}
          src={
            challenge.challengeImgUrl === 'imgUrl' || challenge.challengeImgUrl === ''
              ? getChallengeDefaultImgUrl('ETC')
              : challenge.challengeImgUrl
          }
        />
        <div
          className="flex items-center absolute top-2 right-2 bg-black bg-opacity-40 
          py-1 px-2 rounded-sm text-white text-sm"
        >
          <BsPersonFill size={14} />
          {challenge.currentParticipantsCount}명
        </div>
        {calculateDday(challenge.challengeStartDate) === 1 && (
          <ChallengeDdayCount challengeStartDate={challenge.challengeStartDate} />
        )}
      </div>
      <div className="p-1 mt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{challenge.challengeTitle}</h2>
          <p className="text-sm">
            {(challenge.challengeStatus === 'BEFORE' && '시작 전') ||
              (challenge.challengeStatus === 'INPROGRESS' && '진행 중') ||
              (challenge.challengeStatus === 'END' && '종료')}
          </p>
        </div>
        <ul className="flex text-sm flex-wrap mt-1">
          <li className="mr-1 font-medium">
            #{challengeAuthFrequencyNames[challenge.authFrequency]}
          </li>
          <li className="mr-1 font-medium">#{challengePeroidNames[challenge.challengePeroid]}</li>
          {challenge.challengeTagList.map((t: ChallengeTag) => (
            <li key={t} className="mr-1 font-medium">
              #{challengeListTagsNameObj[t]}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default ChallengeItem;
