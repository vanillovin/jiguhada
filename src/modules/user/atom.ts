import { parse } from 'path';
import { atom } from 'recoil';
import { ICurrentUser } from './type';

// const authAtom = atom({
//   key: 'auth',
//   // get initial state from local storage to enable user to stay logged in
//   default: JSON.parse(localStorage.getItem('user')),
// });

const localStorageEffect =
  <T>(key: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(key);

    if (savedValue != null) {
      const parsedValue = JSON.parse(savedValue);
      const expiredTime = new Date(
        parsedValue.accessTokenExpiredDate
      ).getTime();
      new Date().getTime() < expiredTime
        ? setSelf(JSON.parse(savedValue))
        : localStorage.removeItem('current_user');
    }

    onSet((newValue: T, _: any, isReset: boolean): void => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

const currentUserState = atom<ICurrentUser | null>({
  key: 'CurrentUser',
  default: null,
  effects: [localStorageEffect('current_user')],
});

export { currentUserState };
