import { Category } from '../modules/board/type';

export interface DateData {
  year: number;
  month: number;
  date: number;
  day: number;
}

export function getBoardCatText(name: Category) {
  if (!name) return '';
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

export function getNearSaturday(year: number, month: number, date: number, day: number) {
  // console.log('getNearSaturday:', year, month, date, day);

  const lastDate = getLastDate(year, month);
  let tempYear = year;
  let tempMonth = month;
  let tempDate = date;
  let tempDay = day;

  // 현재 주말이면 다음주주말로 표시해야하니까 일단 월요일로만들기 => 토+2, 일+1
  if (day === 6) {
    tempDate += 2;
    tempDay += 2;
  } else if (day === 0) {
    tempDate += 1;
    tempDay += 1;
  }

  // ex) 2021.12.31 -> 2021.12.33
  // 원하는 결과 : 2022 12 31 토 -> 2023 1 7 토 (o)
  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = tempDate - lastDate;
    tempDay = getDay(tempYear, tempMonth, tempDate);
  }

  // 말월말일체크 & 토요일(6)될때까지day+=1
  const daysLeftUntilSat = 6 - tempDay;
  const overflow = tempDate + daysLeftUntilSat > lastDate;
  const overflowDay = tempDate + daysLeftUntilSat - lastDate;
  if (overflow) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = overflowDay;
  } else {
    tempDate += daysLeftUntilSat;
  }

  return { year: tempYear, month: tempMonth, date: tempDate, day: 6 };
}

export function getSunday({ year, month, date }: DateData) {
  // 4.30 토 ~ 5.1 일 or 2022.12.31 토 ~ 2023.1.1 일
  const lastDate = getLastDate(year, month);
  let tempYear = year;
  let tempMonth = month;
  let tempDate = date + 1;
  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = 1;
  }
  return { year: tempYear, month: tempMonth, date: tempDate, day: 0 };
}

export function getNearMonday({ year, month, date, day }: DateData): DateData {
  const lastDate = getLastDate(year, month);
  let tempYear = year;
  let tempMonth = month;
  let tempDate = date;
  let tempDay = day;
  if (day === 0) tempDate += 1;
  else if (day === 1) tempDate += 7;
  else tempDate += 8 - tempDay;
  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = tempDate - lastDate;
    tempDay = getDay(tempYear, tempMonth, tempDate);
  }
  return { year: tempYear, month: tempMonth, date: tempDate, day: 1 };
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

export const getEmptyStringArr = (length: number) => Array.from({ length }).fill('');
