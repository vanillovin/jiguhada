import { DateData, getEmptyStringArr, getSunday } from './../../utils';
import {
  getCurrentDate,
  getDay,
  getLastDate,
  getNearMonday,
  getNearSaturday,
} from '../../utils';
import { AuthFrequency, GetEndDataParams } from './type';

function removeWeekendData(
  dates: { year: number; month: number; date: number; day: number }[]
) {
  return dates.filter(({ day }) => day > 0 && day < 6);
}

function getEverydayData({ year, month, date }: DateData) {
  const lastDate = getLastDate(year, month);
  const lastMonth = 11;
  const overflow7 = date + 7 > lastDate;
  const overflowDay7 = Math.abs(lastDate - (date + 7));
  const everydayData = !overflow7
    ? getEmptyStringArr(7).map((_, i) => ({
        year,
        month,
        date: date + i + 1,
        day: getDay(year, month, date + i + 1),
      }))
    : [
        ...getEmptyStringArr(7 - overflowDay7).map((_, i) => ({
          year,
          month,
          date: date + i + 1,
          day: getDay(year, month, date + i + 1),
        })),
        ...getEmptyStringArr(overflowDay7).map((_, i) => ({
          year: month + 1 > lastMonth ? year + 1 : year,
          month: month + 1 > lastMonth ? 0 : month + 1,
          date: i + 1,
          day: getDay(
            month + 1 > lastMonth ? year + 1 : year,
            month + 1 > lastMonth ? 0 : month + 1,
            i + 1
          ),
        })),
      ];
  return everydayData;
}

function getWeekdayData({ year, month, date }: DateData) {
  const lastDate = getLastDate(year, month);
  const lastMonth = 11;
  const overflow9 = date + 9 > lastDate;
  const overflowDay9 = Math.abs(lastDate - (date + 9));
  const nineDays = !overflow9
    ? getEmptyStringArr(9).map((_, i) => ({
        year,
        month,
        date: date + i + 1,
        day: getDay(year, month, date + i + 1),
      }))
    : [
        ...getEmptyStringArr(9 - overflowDay9).map((_, i) => ({
          year,
          month,
          date: date + i + 1,
          day: getDay(year, month, date + i + 1),
        })),
        ...getEmptyStringArr(overflowDay9).map((_, i) => ({
          year: month + 1 > lastMonth ? year + 1 : year,
          month: month + 1 > lastMonth ? 0 : month + 1,
          date: i + 1,
          day: getDay(
            month + 1 > lastMonth ? year + 1 : year,
            month + 1 > lastMonth ? 0 : month + 1,
            i + 1
          ),
        })),
      ];
  const weekdayData = removeWeekendData(nineDays);
  return weekdayData;
}

function getWeekendData({ year, month, date, day }: DateData) {
  const firstSat = getNearSaturday(year, month, date, day);
  const { year: fYear, month: fMonth, date: fDate, day: fDay } = firstSat;
  const firstSun = getSunday(firstSat);
  const secondSat = getNearSaturday(fYear, fMonth, fDate, fDay);
  const secondSun = getSunday(secondSat);
  const weekendData = [firstSat, firstSun, secondSat, secondSun];
  return weekendData;
}

function getNWeekData({ year, month, date, day }: DateData) {
  const firstMon = getNearMonday({ year, month, date, day });
  const { year: fmy, month: fmm, date: fmd, day: fmday } = firstMon;
  const secondMon = getNearMonday({ year: fmy, month: fmm, date: fmd, day: fmday });
  const nWeekData = [firstMon, secondMon];
  return nWeekData;
}

export function getChallengeStartDate(authFrequency: AuthFrequency) {
  const { year, month, date, day } = getCurrentDate();
  switch (authFrequency) {
    case 'EVERYDAY':
      return getEverydayData({ year, month, date, day });
    case 'WEEKDAY':
      return getWeekdayData({ year, month, date, day });
    case 'WEEKEND':
      return getWeekendData({ year, month, date, day });
    default:
      return getNWeekData({ year, month, date, day });
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
