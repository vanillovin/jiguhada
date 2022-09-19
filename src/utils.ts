export function getBoardCatText(
  name: 'ENVIRONMENT' | 'FREE' | 'VEGAN' | 'QUESTION'
) {
  if (name === 'VEGAN') return '비건';
  if (name === 'FREE') return '자유게시판';
  if (name === 'ENVIRONMENT') return '환경';
  if (name === 'QUESTION') return 'Q&A';
}

export function getDateText(date: string) {
  // 2022-09-19T10:26:22
  return `${date
    .split('T')[0]
    .replaceAll('-', '.')
    .substring(2, date.split('T')[0].length)} ${date
    .split('T')[1]
    .substring(0, 5)}`;
}
