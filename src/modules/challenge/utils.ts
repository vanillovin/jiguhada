import {
  getCurrentDate,
  getDay,
  getLastDate,
  getNearMonday,
  getNearSaturday,
  removeWeekend,
} from '../../utils';
import { AuthFrequency, GetEndDataParams } from './type';

export function getChallengeStartDate(af: AuthFrequency) {
  const { year, month, date, day } = getCurrentDate();
  // const lastMonth = 11; // 말월
  const lastDate = getLastDate(year, month);
  const overflow = date + 7 > lastDate;
  const overflowDay = lastDate - (date + 7);

  const overflow9 = date + 9 > lastDate;
  // const overflowDay9 = lastDate - (date + 9);
  const nineDays = new Array(9).fill('').map((_, i) => date + i + 1);
  const weekDays = removeWeekend(year, month, nineDays);
  const removeOverLastDate = nineDays.filter((d, _) => d <= lastDate);
  const removeOAndW = removeWeekend(
    year,
    month,
    nineDays.filter((d, _) => d <= lastDate)
  );
  const nextMonthDays = removeWeekend(
    year,
    month + 1,
    new Array(9 - removeOverLastDate.length).fill('').map((_, i) => i + 1)
  );

  // 주말 매일
  const firstSat = getNearSaturday(month, date, day);
  const secondSat = getNearSaturday(firstSat[0], firstSat[1], firstSat[2]);
  const firstAndSecondWeekendData = [
    { month: firstSat[0], date: firstSat[1], day: 6 },
    { month: firstSat[0], date: firstSat[1] + 1, day: 0 },
    { month: secondSat[0], date: secondSat[1], day: 6 },
    { month: secondSat[0], date: secondSat[1] + 1, day: 0 },
  ];

  const firstMon = getNearMonday(month, date, day);
  const secondMon = getNearMonday(firstMon[0], firstMon[1], firstMon[2]);
  const firstAndSecondMondayData = [
    { month: firstMon[0], date: firstMon[1], day: firstMon[2] },
    { month: secondMon[0], date: secondMon[1], day: secondMon[2] },
  ];

  switch (af) {
    case 'EVERYDAY':
      return !overflow
        ? new Array(7).fill('').map((_, i) => ({
            month: month,
            date: date + i + 1,
            day: getDay(year, month, date + i + 1),
          }))
        : [
            ...new Array(7 - Math.abs(overflowDay)).fill('').map((_, i) => ({
              month: month,
              date: date + i + 1,
              day: getDay(year, month, date + i + 1),
            })),
            ...new Array(Math.abs(overflowDay)).fill('').map((_, i) => ({
              month: month + 1,
              date: i + 1,
              day: getDay(year, month, date + i + 1),
            })),
          ];
    case 'WEEKDAY':
      return !overflow9
        ? weekDays.map((d) => ({
            month: month,
            date: d,
            day: getDay(year, month, d),
          }))
        : [
            ...removeOAndW.map((d) => ({
              month: month,
              date: d,
              day: getDay(year, month, d),
            })),
            ...nextMonthDays.map((d) => ({
              month: month + 1,
              date: d,
              day: getDay(year, month + 1, d),
            })),
          ];
    case 'WEEKEND':
      return firstAndSecondWeekendData;
    default:
      return firstAndSecondMondayData;
  }
}

export function getChallengeEndData(af: AuthFrequency, p: string, s: string) {
  const year = new Date().getFullYear();
  const [m, de, dy] = s.split('.'); // string type
  const [month, date, day] = [+m, +de, +dy];

  function getEverydayEndData({ y, m, d }: GetEndDataParams) {
    const { year, month } = getCurrentDate();
    const lastDate = getLastDate(year, month);
    let [tempYear, tempMonth, tempDate] = [y, m, d];
    let day = getDay(y, m, d); // 시작일 요일
    let leftDay = 7 - day;
    tempDate += leftDay;
    if (tempDate > lastDate) {
      tempMonth += 1;
      tempDate = Math.abs(lastDate - tempDate);
    }
    return [tempYear, tempMonth, tempDate];
  }

  function getWeekdayEndData({ y, m, d, o = false }: GetEndDataParams) {
    const { year, month } = getCurrentDate();
    const lastDate = getLastDate(year, month);
    let [tempYear, tempMonth, tempDate] = [y, m, d];
    let day = getDay(y, m, d); // 시작일 요일
    if (day === 5 && o) {
      day = 1;
      tempDate += 3;
    }
    let leftDay = 5 - day;
    tempDate += leftDay;
    if (tempDate > lastDate) {
      tempMonth += 1;
      tempDate = Math.abs(lastDate - tempDate);
    }
    return [tempYear, tempMonth, tempDate];
  }

  function getWeekendEndDate({ y, m, d, o = false }: GetEndDataParams) {
    const { year, month } = getCurrentDate();
    const lastDate = getLastDate(year, month);
    let [tempYear, tempMonth, tempDate] = [y, m, d];
    let day = getDay(y, m, d); // 시작일 요일
    if (day === 6) tempDate += 1;
    if (o) tempDate += 7;
    if (tempDate > lastDate) {
      tempMonth += 1;
      tempDate = Math.abs(lastDate - tempDate);
    }
    return [tempYear, tempMonth, tempDate];
  }

  function getNTimesAWeekEndData({ y, m, d, o = false }: GetEndDataParams) {
    const { year, month } = getCurrentDate();
    const lastDate = getLastDate(year, month);
    let [tempYear, tempMonth, tempDate] = [y, m, d];
    if (o) tempDate += 7;
    else tempDate += 6;
    if (tempDate > lastDate) {
      tempMonth += 1;
      tempDate = Math.abs(lastDate - tempDate);
    }
    return [tempYear, tempMonth, tempDate];
  }

  switch (af) {
    case 'EVERYDAY':
      const e1 = getEverydayEndData({ y: year, m: +month, d: +date });
      const e2 = getEverydayEndData({ y: e1[0], m: e1[1], d: e1[2] });
      const e3 = getEverydayEndData({ y: e2[0], m: e2[1], d: e2[2] });
      const e4 = getEverydayEndData({ y: e3[0], m: e3[1], d: e3[2] });
      if (p === 'ONEWEEK') return e1;
      else if (p === 'TWOWEEK') return e2;
      else if (p === 'THREEWEEK') return e3;
      else return e4;
    case 'WEEKDAY':
      const w1 = getWeekdayEndData({ y: year, m: +month, d: +date });
      const w2 = getWeekdayEndData({ y: w1[0], m: w1[1], d: w1[2], o: true });
      const w3 = getWeekdayEndData({ y: w2[0], m: w2[1], d: w2[2], o: true });
      const w4 = getWeekdayEndData({ y: w3[0], m: w3[1], d: w3[2], o: true });
      if (p === 'ONEWEEK') return w1;
      else if (p === 'TWOWEEK') return w2;
      else if (p === 'THREEWEEK') return w3;
      else return w4;
    case 'WEEKEND':
      const k1 = getWeekendEndDate({ y: year, m: +month, d: +date });
      const k2 = getWeekendEndDate({ y: k1[0], m: k1[1], d: k1[2], o: true });
      const k3 = getWeekendEndDate({ y: k2[0], m: k2[1], d: k2[2], o: true });
      const k4 = getWeekendEndDate({ y: k3[0], m: k3[1], d: k3[2], o: true });
      if (p === 'ONEWEEK') return k1;
      else if (p === 'TWOWEEK') return k2;
      else if (p === 'THREEWEEK') return k3;
      else return k4;
    default:
      const n1 = getNTimesAWeekEndData({ y: year, m: +month, d: +date });
      const n2 = getNTimesAWeekEndData({ y: n1[0], m: n1[1], d: n1[2], o: true });
      const n3 = getNTimesAWeekEndData({ y: n2[0], m: n2[1], d: n2[2], o: true });
      const n4 = getNTimesAWeekEndData({ y: n3[0], m: n3[1], d: n3[2], o: true });
      if (p === 'ONEWEEK') return n1;
      else if (p === 'TWOWEEK') return n2;
      else if (p === 'THREEWEEK') return n3;
      else return n4;
  }
}
