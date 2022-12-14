// https://stackoverflow.com/questions/41139763/how-to-declare-a-fixed-length-array-in-typescript
// interface FixedLengthArray<L extends number, T> extends ArrayLike<T> {
//   length: L;
// }

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
  achievementRate: number;
  challengeCategory: string;
  challengeId: number;
  challengeTag: ChallengeTag[];
  challengeTitle: string;
  // challengeDetails: string;
  challengeImg: string;
  challengeAddDetails: string;
  challengeAddImgs: string;
  challengeManagerId: number;
  challengeManagerName: string;
  challengeManagerImgUrl: string;
  participantsCount: number;
  currrentParticipantsCount: number;
  authMethodContent: string;
  authMethodImgUrl: string;
  authMethodFailImgUrl: string;
  challengeStartDate: string;
  challengePeroid: string;
  challengeEndDate: string;
  authFrequency: string;
  authCountPerDay: 1;
  authAvailableTimeType: string;
  authAvailableStartTime: string;
  authAvailableEndTime: string;
  isOfficial: boolean;
  challengeStatus: ChallengeStatus;
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
