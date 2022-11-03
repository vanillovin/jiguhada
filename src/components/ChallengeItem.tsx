function test(sdate: string) {
  const [y, m, d] = sdate.split('T')[0].split('-');
  let today = new Date().getTime();
  let dday = new Date(+y, +m - 1, +d).getTime();
  let gap = dday - today;
  let result = Math.ceil(gap / (1000 * 60 * 60 * 24));
  return `D-${result}`;
}

export default function ChallengeItem({ challengeId }) {
  return (
    <li
      onClick={() => navigate(`/challenge/${challengeId}`)}
      className={`border rounded-sm p-2 w-full cursor-pointer ${
        challengeStatus !== 'BEFORE' ? 'opacity-60' : ''
      }`}
    >
      <div className="relative">
        <img
          className={`rounded-sm w-full`}
          src={
            challengeImgUrl === 'imgUrl' || challengeImgUrl === ''
              ? getChallengeDefaultImgUrl('ETC')
              : challengeImgUrl
          }
        />
        <div className="flex items-center absolute top-2 right-2 bg-black bg-opacity-40 p-1 rounded-sm text-white text-xs">
          <BsPersonFill size={14} />
          {currentParticipantsCount}명
        </div>
        {true && (
          <div className="w-full bg-black bg-opacity-40 absolute left-0 bottom-0 text-center text-white text-sm py-1">
            마감까지 00:00:00
          </div>
        )}
      </div>
      <div className="p-1">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{challengeTitle}</h2>
          <p className="text-sm">
            {(challengeStatus === 'BEFORE' && test(challengeStartDate)) ||
              (challengeStatus === 'INPROGRESS' && '진행중') ||
              (challengeStatus === 'END' && '종료')}
          </p>
        </div>
        <ul className="flex text-sm flex-wrap">
          <li className="mr-1">#{challengePeroidName[challengePeroid]}</li>
          {/* <li className="mr-1">#{authFrequency}</li> */}
          {challengeTagList.map((t: ChallengeTag) => (
            <li key={t} className="mr-1">
              #{tagsNameObj[t]}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
