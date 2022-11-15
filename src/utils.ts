import { Category } from './modules/board/type';

export function getBoardCatText(name: Category) {
  if (name === 'VEGAN') return '비건';
  if (name === 'FREE') return '자유게시판';
  if (name === 'ENVIRONMENT') return '환경';
  if (name === 'QUESTION') return 'Q&A';
  return '기타';
}

export function getToday(index: number) {
  return ['일', '월', '화', '수', '목', '금', '토'].find((_, i) => i === index);
}

export function getDay(year: number, month: number, date: number) {
  return new Date(year, month, date).getDay();
}

export function getCurrentDate() {
  const currDate = new Date();
  return {
    currDate,
    year: currDate.getFullYear(),
    month: currDate.getMonth(),
    date: currDate.getDate(),
    day: currDate.getDay(),
  };
}

// export function getCustomDate(year: number, month: number, date: number) {
//   const customDate = new Date(year, month, date);
//   return {
//     cYear: customDate.getFullYear(),
//     cMonth: customDate.getMonth(),
//     cDate: customDate.getDate(),
//     cDay: customDate.getDay(),
//   };
// }

export function getDateText(date: string) {
  // 2022-09-19T10:26:22
  return `${date
    ?.split('T')[0]
    .replaceAll('-', '.')
    .substring(2, date.split('T')[0].length)} ${date?.split('T')[1].substring(0, 5)}`;
}

export function getLastDate(year: number, month: number) {
  // 마지막 날짜 구하기 new Date(년, 월, 0)
  return new Date(year, month + 1, 0).getDate();
}

export function removeWeekend(year: number, month: number, days: number[]) {
  return days.filter((n) => getDay(year, month, n) > 0 && getDay(year, month, n) < 6);
}

export function removeWeek(year: number, month: number, days: number[]) {
  return days.filter((n) => getDay(year, month, n) === 0 && getDay(year, month, n) === 6);
}

export function getNearSaturday(month: number, date: number, day: number) {
  // console.log(month, date, day);
  // 말일 체크 && 2주
  const lastDate = getLastDate(new Date().getFullYear(), month);
  let tempMonth = month;
  let tempDate = date;
  let tempDay = day;
  if (day === 6) {
    tempDate += 2;
    tempDay = 1;
  } else if (day === 0) {
    tempDate += 1;
    tempDay = 1;
  }
  while (tempDay !== 6) {
    if (tempDate >= lastDate) {
      // console.log('lastDate!');
      tempDate = 0;
      tempMonth += 1;
      continue;
    }
    tempDay++;
    tempDate++;
    // console.log(tempDay);
  }
  return [tempMonth, tempDate, tempDay];
}

export function getNearMonday(month: number, date: number, day: number) {
  const lastDate = getLastDate(new Date().getFullYear(), month);
  let tempMonth = month;
  let tempDate = date;
  let tempDay = day;
  if (day === 1) {
    tempDate += 1;
    tempDay = 2;
  } else if (day === 6) {
    tempDate += 1;
    tempDay = 0;
  }
  while (tempDay !== 1) {
    if (tempDate >= lastDate) {
      console.log('lastDate!', lastDate);
      tempDate = 1;
      tempMonth += 1;
    }
    if (tempDay === 6) {
      tempDate += 1;
      tempDay = 0;
    }
    tempDay++;
    tempDate++;
  }
  return [tempMonth, tempDate, tempDay];
}

export function displayedAt(createdAt: number) {
  const milliSeconds = new Date().getTime() - createdAt;
  const seconds = milliSeconds / 1000;
  if (seconds < 60) return `방금 전`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}분 전`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}시간 전`;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}일 전`;
  const weeks = days / 7;
  if (weeks < 5) return `${Math.floor(weeks)}주 전`;
  const months = days / 30;
  if (months < 12) return `${Math.floor(months)}개월 전`;
  const years = days / 365;
  return `${Math.floor(years)}년 전`;
}
