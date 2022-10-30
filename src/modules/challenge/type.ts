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
  y: number;
  m: number;
  d: number;
  o?: boolean; // option
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

type ChallengePeroid = 'ONEWEEK' | 'TWOWEEK' | 'THREEWEEK' | 'FOURWEEK';

export interface CreateChallenge {
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

export interface Challenge {
  achievementRate: number;
  challengeDetails: string;
  challengeEndDate: string;
  challengeId: number;
  challengeImgUrl: string;
  challengePeroid: ChallengePeroid;
  challengeStartDate: string;
  challengeStatus: 'BEFORE' | 'INPROGRESS' | 'END';
  challengeTagList: ChallengeTag[];
  challengeTitle: string;
  currentParticipantsCount: number;
  participantsCount: number;
}

export interface ChallengeList {
  challengeList: Challenge[];
  currentPage: number;
  totalChallengeCount: number;
  totalPage: number;
}

export interface GetChallenge {
  challengeCategory: string;
  challengeId: number;
  challengeTag: ChallengeTag[];
  challengeTitle: string;
  challengeDetails: string;
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
  isOfficial: false;
  challengeStatus: string;
  achievementRate: number;
}
