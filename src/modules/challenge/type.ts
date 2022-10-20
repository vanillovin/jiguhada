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

type ChallengeTag =
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

export interface CreateChallenge {
  challengeTag: ChallengeTag[];
  title: string;
  challengeDetails: string;
  challengeCategory: 'VEGAN' | 'ENVIRONMENT' | 'ETC';
  challengeImg: string;
  challengeAddDetails: string;
  challengeAddImg: string;
  participantsCount: 0;
  authMethodContent: string;
  authMethodImg: string;
  authMethodFailImg: string;
  challengeStartDate: string;
  challengePeroid: 'ONEWEEK' | 'TWOWEEK' | 'THREEWEEK' | 'FOURWEEK';
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
