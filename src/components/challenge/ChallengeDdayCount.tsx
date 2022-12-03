import { useState, useEffect } from 'react';

function ChallengeDdayCount({ challengeStartDate }: { challengeStartDate: string }) {
  const [time, setTime] = useState('00:00:00');

  useEffect(() => {
    const today = new Date().getTime();
    const [y, m, d] = challengeStartDate.split('T')[0].split('-');
    const dday = new Date(+y, +m - 1, +d).getTime();
    // const dday = new Date(2022, 11, 4).getTime();
    const diff = dday - today;
    // const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const diffMin = Math.floor((diff / (1000 * 60)) % 60);
    const diffSec = Math.floor((diff / 1000) % 60);
    const id = setInterval(() => {
      setTime(
        `${diffHour < 10 ? `0${diffHour}` : diffHour}:${
          diffMin < 10 ? `0${diffMin}` : diffMin
        }:${diffSec < 10 ? `0${diffSec}` : diffSec}`
      );
    }, 1000);
    return () => clearInterval(id);
  }, [time]);

  return (
    <div className="w-full bg-black bg-opacity-40 absolute left-0 bottom-0 text-center text-white text-sm py-1">
      마감까지 {time}
    </div>
  );
}

export default ChallengeDdayCount;
