import { Category } from './modules/board/type';

export function getBoardCatText(name: Category) {
  if (name === 'VEGAN') return '비건';
  if (name === 'FREE') return '자유게시판';
  if (name === 'ENVIRONMENT') return '환경';
  if (name === 'QUESTION') return 'Q&A';
}

export function getDateText(date: string) {
  // 2022-09-19T10:26:22
  return `${date
    ?.split('T')[0]
    .replaceAll('-', '.')
    .substring(2, date.split('T')[0].length)} ${date
    ?.split('T')[1]
    .substring(0, 5)}`;
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
