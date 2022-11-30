export interface ICurrentUser {
  accessToken: string;
  accessTokenExpiredDate: string;
  nickname: string;
  userImgUrl: string;
  userid: number;
  username: number;
}

export interface SignupData {
  username: string;
  nickname: string;
  password: string;
  userImageUrl: string;
  socialType: 'GENERAL' | 'KAKAO';
}

export interface IUserInfo {
  errorCode?: string;
  message?: string;
  username: string;
  nickname: string;
  imgUrl: string;
  socialType: 'GENERAL' | 'KAKAO';
  userInfoPublic: 'PUBLIC' | 'PRIVATE';
}
