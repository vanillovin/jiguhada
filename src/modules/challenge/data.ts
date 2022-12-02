import { AuthFrequency } from './type';

// Challenge
export const challengeAuthFrequencyNames = {
  EVERYDAY: '매일',
  WEEKDAY: '평일 매일',
  WEEKEND: '주말 매일',
  SIXTHAWEEK: '주 6일',
  FIFTHAWEEK: '주 5일',
  FORTHAWEEK: '주 4일',
  THIRDAWEEK: '주 3일',
  TWICEAWEEK: '주 2일',
  ONCEAWEEK: '주 1일',
};

export const challengePeroidNames = {
  ONEWEEK: '1주 동안',
  TWOWEEK: '2주 동안',
  THREEWEEK: '3주 동안',
  FOURWEEK: '4주 동안',
};

// ChallengeList
export const challengeListTagsNameObj = {
  VEGAN: '비건',
  VEGANRECIPE: '비건 레시피',
  VEGANBEAUTY: '비건 뷰티',
  VEGANFASHION: '비건 패션',
  PESCOVEGAN: '페스코',
  FLEXITERIANVEGAN: '플렉시테리언',
  ZERO_WASTE: '제로 웨이스트',
  ZEROENERGE: '제로 에너지',
  PLOGGING: '쓰레기 줍기',
  TUMBLER: '텀블러 사용',
  RECYCLING: '재활용',
  ETC: '기타',
  LIFESTYLE: '생활습관',
  ENVIRONMENT_DAY: '환경의 날',
  EARTH_DAY: '지구의 날',
  PLANT_DAY: '식목일',
  WATER_DAY: '물의 날',
  SEA_DAY: '바다의 날',
  BUY_NOTHING_DAY: '아무것도 사지 않는 날',
  VEGAN_DAY: '비건의 날',
  ENERGE_DAY: '에너지의 날',
};

// CreateChallenge
export const getChallengeDefaultImgUrl = (cat: string) =>
  `https://jiguhada-user-img.s3.ap-northeast-2.amazonaws.com/challenge-profile-img/challenge-${
    cat ? cat.toLowerCase() : 'vegan'
  }.png`;

export const categoryData = [
  { value: 'VEGAN', name: '비건' },
  { value: 'ENVIRONMENT', name: '환경' },
  { value: 'ETC', name: '기타' },
];

export const tagsData = {
  VEGAN: [
    { checked: false, value: 'VEGAN', name: '비건' },
    { checked: false, value: 'VEGANRECIPE', name: '비건 레시피' },
    { checked: false, value: 'VEGANBEAUTY', name: '비건 뷰티' },
    { checked: false, value: 'VEGANFASHION', name: '비건 패션' },
    { checked: false, value: 'PESCOVEGAN', name: '페스코' },
    { checked: false, value: 'FLEXITERIANVEGAN', name: '플렉시테리언' },
  ],
  ENVIRONMENT: [
    { checked: false, value: 'ZERO_WASTE', name: '제로 웨이스트' },
    { checked: false, value: 'ZEROENERGE', name: '제로 에너지' },
    { checked: false, value: 'PLOGGING', name: '쓰레기 줍기' },
    { checked: false, value: 'TUMBLER', name: '텀블러 사용' },
    { checked: false, value: 'RECYCLING', name: '재활용' },
  ],
  ETC: [
    { checked: false, value: 'ETC', name: '기타' },
    { checked: false, value: 'LIFESTYLE', name: '생활습관' },
    { checked: false, value: 'ENVIRONMENT_DAY', name: '환경의 날' },
    { checked: false, value: 'EARTH_DAY', name: '지구의 날' },
    { checked: false, value: 'PLANT_DAY', name: '식목일' },
    { checked: false, value: 'WATER_DAY', name: '물의 날' },
    { checked: false, value: 'SEA_DAY', name: '바다의 날' },
    { checked: false, value: 'BUY_NOTHING_DAY', name: '아무것도 사지 않는 날' },
    { checked: false, value: 'VEGAN_DAY', name: '비건의 날' },
    { checked: false, value: 'ENERGE_DAY', name: '에너지의 날' },
  ],
};

export const challengePeroidData = [
  { value: 'ONEWEEK', name: '1주 동안' },
  { value: 'TWOWEEK', name: '2주 동안' },
  { value: 'THREEWEEK', name: '3주 동안' },
  { value: 'FOURWEEK', name: '4주 동안' },
];

export const authFrequencyData: {
  value: AuthFrequency;
  name: string;
  desc: string;
}[] = [
  {
    value: 'EVERYDAY',
    name: '월~일 매일 인증하기',
    desc: '인증 요일은 월, 화, 수, 목, 금, 토, 일 입니다.',
  },
  {
    value: 'WEEKDAY',
    name: '월~금 매일 인증하기',
    desc: '인증 요일은 월, 화, 수, 목, 금 입니다.',
  },
  {
    value: 'WEEKEND',
    name: '토~일 매일 인증하기',
    desc: '인증 요일은 토, 일 입니다.',
  },
  {
    value: 'SIXTHAWEEK',
    name: '주 6일 인증하기',
    desc: '월, 화, 수, 목, 금, 토, 일 중에 6일 인증해주세요.',
  },
  {
    value: 'FIFTHAWEEK',
    name: '주 5일 인증하기',
    desc: '월, 화, 수, 목, 금, 토, 일 중에 5일 인증해주세요.',
  },
  {
    value: 'FORTHAWEEK',
    name: '주 4일 인증하기',
    desc: '월, 화, 수, 목, 금, 토, 일 중에 4일 인증해주세요.',
  },
  {
    value: 'THIRDAWEEK',
    name: '주 3일 인증하기',
    desc: '월, 화, 수, 목, 금, 토, 일 중에 3일 인증해주세요.',
  },
  {
    value: 'TWICEAWEEK',
    name: '주 2일 인증하기',
    desc: '월, 화, 수, 목, 금, 토, 일 중에 2일 인증해주세요.',
  },
  {
    value: 'ONCEAWEEK',
    name: '주 1일 인증하기',
    desc: '월, 화, 수, 목, 금, 토, 일 중에 1일 인증해주세요.',
  },
];
