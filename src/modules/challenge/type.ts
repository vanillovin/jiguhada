// https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
// interface FixedLengthArray<L extends number, T> extends ArrayLike<T> {
//   length: L;
// }

import { Category } from '../board/type';

export type AuthFrequency =
  | 'EVERYDAY'
  | 'WEEKDAY'
  | 'WEEKEND'
  | 'SIXTHAWEEK'
  | 'FIFTHAWEEK'
  | 'FORTHAWEEK'
  | 'THIRDAWEEK'
  | 'TWICEAWEEK'
  | 'ONCEAWEEK';

export interface GetEndDataParams {
  year: number;
  month: number;
  date: number;
  day: number;
  opt?: boolean; // option
  // { [key: string]: boolean | number; };
}

export type ChallengeTag =
  | 'ZERO_WASTE'
  | 'ZEROENERGE'
  | 'PLOGGING'
  | 'TUMBLER'
  | 'RECYCLING'
  | 'VEGAN'
  | 'VEGANRECIPE'
  | 'VEGANBEAUTY'
  | 'VEGANFASHION'
  | 'PESCOVEGAN'
  | 'FLEXITERIANVEGAN'
  | 'ETC'
  | 'LIFESTYLE'
  | 'ENVIRONMENT_DAY'
  | 'EARTH_DAY'
  | 'PLANT_DAY'
  | 'WATER_DAY'
  | 'SEA_DAY'
  | 'BUY_NOTHING_DAY'
  | 'VEGAN_DAY'
  | 'ENERGE_DAY';

export type CahllengeCategory = 'VEGAN' | 'ENVIRONMENT' | 'ETC';

export type ChallengePeroid = 'ONEWEEK' | 'TWOWEEK' | 'THREEWEEK' | 'FOURWEEK';

export type ChallengeStatus = 'BEFORE' | 'INPROGRESS' | 'END';

export type AuthIsApprove = 'APPROVE' | 'WAIT' | 'REFUSE';

export interface GetChallengeListParams {
  queryParam: string;
  pageParam: number | string;
  orderParam: string;
  categoryParam: string;
  searchTypeParam: string;
  statusParam: string;
  tagListParam: ChallengeTag[];
}

export interface CreateChallengeRes {
  achievementRate: number;
  authAvailableEndTime: string;
  authAvailableStartTime: string;
  authAvailableTimeType: string;
  authCountPerDay: 1;
  authFrequency: string;
  authMethodContent: string;
  authMethodFailImgUrl: string;
  authMethodImgUrl: string;
  challengeAddDetails: string;
  challengeAddImgs: string;
  challengeCategory: string;
  challengeDetails: string;
  challengeEndDate: string;
  challengeId: number;
  challengeImg: string;
  challengeManagerId: number;
  challengeManagerImgUrl: string;
  challengeManagerName: string;
  challengePeroid: ChallengePeroid;
  challengeStartDate: string;
  challengeStatus: ChallengeStatus;
  challengeTag: ChallengeTag[];
  challengeTitle: string;
  currrentParticipantsCount: number;
  isOfficial: boolean;
  participantsCount: number;
}

export interface CreateChallengeReq {
  challengeTag: ChallengeTag[];
  title: string;
  challengeDetails: string;
  challengeCategory: CahllengeCategory;
  challengeImg: string;
  challengeAddDetails: string;
  challengeAddImg: string;
  participantsCount: 0;
  authMethodContent: string;
  authMethodImg: string;
  authMethodFailImg: string;
  challengeStartDate: string;
  challengePeroid: ChallengePeroid;
  challengeEndDate: string;
  authFrequency: AuthFrequency;
  authCountPerDay: number;
  authAvailableTimeType: 'ALLDAY' | 'CUSTOMTIME';
  authAvailableStartTime: {
    hour: number;
    minute: number;
    second: 0;
    nano: 0;
  };
  authAvailableEndTime: {
    hour: number;
    minute: number;
    second: 0;
    nano: 0;
  };
}

export interface IChallenge {
  catecory: CahllengeCategory;
  authFrequency: AuthFrequency;
  achievementRate: number;
  challengeDetails: string;
  challengeEndDate: string;
  challengeId: number;
  challengeImgUrl: string;
  challengePeroid: ChallengePeroid;
  challengeStartDate: string;
  challengeStatus: ChallengeStatus;
  challengeTagList: ChallengeTag[];
  challengeTitle: string;
  currentParticipantsCount: number;
  participantsCount: number;
}

export interface ChallengeList {
  challengeList: IChallenge[];
  currentPage: number;
  totalChallengeCount: number;
  totalPage: number;
}

export interface IsJoinChallenge {
  challengeId: number;
  userId: number;
  joinStatus: 'JOIN' | 'NOTJOIN';
  isChallengeMaster: boolean;
}

export interface GetChallenge {
  achievementRate: number; // 달성률
  challengeCategory: string; // 카테고리
  challengeId: number; // 아이디
  challengeTag: ChallengeTag[]; // 태그
  challengeTitle: string; // 제목
  // challengeDetails: string;
  challengeImg: string; // 이미지
  challengeAddDetails: string; // 세부사항 추가
  challengeAddImgs: string; //
  challengeManagerId: number; //
  challengeManagerName: string;
  challengeManagerImgUrl: string;
  participantsCount: number; // 참가자 수
  currrentParticipantsCount: number; // 현재 참가자 수
  authMethodContent: string; // 인증 내용
  authMethodImgUrl: string; // 인증 이미지
  authMethodFailImgUrl: string; // 인증 실패 이미지
  challengeStartDate: string; // 챌린지 시작 날짜
  challengePeroid: string; // 기간
  challengeEndDate: string; // 종료 날짜
  authFrequency: AuthFrequency; // 인증 빈도
  authCountPerDay: 1; // 일별 인증 횟수
  authAvailableTimeType: string; // 인증 가능 시간 유형
  authAvailableStartTime: string; // 인증 사용 가능 시작 시간
  authAvailableEndTime: string; // 인증 가능한 종료 시간
  isOfficial: boolean; // 공식?
  challengeStatus: ChallengeStatus; // 상태 "BEFORE" | "INPROGRESS" | "END"
}

export interface IChallengeAuthCommentList {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  challengeAuthList: [
    {
      challengeAuthId: number;
      userId: number;
      username: string;
      nickname: string;
      userProfileImgUrl: string;
      authContent: string;
      authImgUrl: string;
      authIsApprove: AuthIsApprove;
    }
  ];
}
