import { DateData, getEmptyStringArr, getSunday } from '../../utils/dateUtils';
import {
  getCurrentDate,
  getDay,
  getLastDate,
  getNearMonday,
  getNearSaturday,
} from '../../utils/dateUtils';
import { AuthFrequency, ChallengePeroid, GetEndDataParams } from './type';

function removeWeekendData(dates: { year: number; month: number; date: number; day: number }[]) {
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
  // const year = 2022;
  // const month = 11;
  // const date = 26;
  // const day = 1;
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

function endDateHelper(eDate: DateData, func: (param: GetEndDataParams) => DateData) {
  return func({ ...eDate, opt: true });
}

function getEverydayEndData({ year, month, date, day, opt = false }: GetEndDataParams): DateData {
  // console.log('getEverydayEndData :', year, month, date, day);

  const lastDate = getLastDate(year, month);
  let [tempYear, tempMonth, tempDate, tempDay] = [year, month, date, day];

  if (opt) {
    tempDate += 7;
  } else {
    if (day === 0) tempDate += 1;
    else tempDate += 7 - day;
  }

  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = tempDate - lastDate;
    tempDay = getDay(tempYear, tempMonth, tempDate);
  }

  return { year: tempYear, month: tempMonth, date: tempDate, day: 0 };
}

function getWeekdayEndData({ year, month, date, day, opt = false }: GetEndDataParams): DateData {
  // console.log('getWeekdayEndData :', year, month, date, day);

  const lastDate = getLastDate(year, month);
  let [tempYear, tempMonth, tempDate, tempDay] = [year, month, date, day];

  if (opt) {
    tempDate += 3;
    tempDay = 1;
  }
  tempDate += 5 - tempDay;

  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = tempDate - lastDate;
    tempDay = getDay(tempYear, tempMonth, tempDate);
  }

  return { year: tempYear, month: tempMonth, date: tempDate, day: 5 };
}

function getWeekendEndDate({ year, month, date, day, opt = false }: GetEndDataParams): DateData {
  // console.log('getWeekendEndDate :', year, month, date, day);

  const lastDate = getLastDate(year, month);
  let [tempYear, tempMonth, tempDate, tempDay] = [year, month, date, day];

  if (day === 6) tempDate += 1;
  if (opt) tempDate += 7;

  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = tempDate - lastDate;
    tempDay = getDay(tempYear, tempMonth, tempDate);
  }

  return { year: tempYear, month: tempMonth, date: tempDate, day: 0 };
}

function getNTimesAWeekEndData({
  year,
  month,
  date,
  day,
  opt = false,
}: GetEndDataParams): DateData {
  const lastDate = getLastDate(year, month);
  let [tempYear, tempMonth, tempDate, tempDay] = [year, month, date, day];

  if (opt) tempDate += 7;
  else tempDate += 6;

  if (tempDate > lastDate) {
    tempMonth += 1;
    if (tempMonth > 11) {
      tempYear += 1;
      tempMonth = 0;
    }
    tempDate = tempDate - lastDate;
    tempDay = getDay(tempYear, tempMonth, tempDate);
  }

  return { year: tempYear, month: tempMonth, date: tempDate, day: 0 };
}

export function getChallengeEndDate(
  authFrequency: AuthFrequency,
  peroid: ChallengePeroid,
  startDate: string
) {
  // console.log('getChallengeEndDate :', authFrequency, peroid, startDate);

  const [y, m, de, dy] = startDate.split('.');
  const [year, month, date, day] = [+y, +m, +de, +dy];

  // 매일
  const oneweekEverydayEndDate = getEverydayEndData({ year, month, date, day });
  const twoweekEverydayEndDate = endDateHelper(oneweekEverydayEndDate, getEverydayEndData);
  const threeweekEverydayEndData = endDateHelper(twoweekEverydayEndDate, getEverydayEndData);
  const fourweekEverydayEndData = endDateHelper(threeweekEverydayEndData, getEverydayEndData);

  // 평일 매일
  const oneweekWeekdayEndDate = getWeekdayEndData({ year, month, date, day });
  const twoweekWeekdayEndDate = endDateHelper(oneweekWeekdayEndDate, getWeekdayEndData);
  const threeweekWeekdayEndDate = endDateHelper(twoweekWeekdayEndDate, getWeekdayEndData);
  const fourweekWeekdayEndDate = endDateHelper(threeweekWeekdayEndDate, getWeekdayEndData);

  // 주말 매일
  const oneweekWeekendEndDate = getWeekendEndDate({ year, month, date, day });
  const twoweekWeekendEndDate = endDateHelper(oneweekWeekendEndDate, getWeekendEndDate);
  const threeweekWeekendEndDate = endDateHelper(twoweekWeekendEndDate, getWeekendEndDate);
  const fourweekWeekendEndDate = endDateHelper(threeweekWeekendEndDate, getWeekendEndDate);

  // 주 n일
  const n1weekWeekendEndDate = getNTimesAWeekEndData({ year, month, date, day });
  const n2weekWeekendEndDate = endDateHelper(n1weekWeekendEndDate, getNTimesAWeekEndData);
  const n3weekWeekendEndDate = endDateHelper(n2weekWeekendEndDate, getNTimesAWeekEndData);
  const n4weekWeekendEndDate = endDateHelper(n3weekWeekendEndDate, getNTimesAWeekEndData);

  switch (authFrequency) {
    case 'EVERYDAY':
      if (peroid === 'ONEWEEK') return oneweekEverydayEndDate;
      else if (peroid === 'TWOWEEK') return twoweekEverydayEndDate;
      else if (peroid === 'THREEWEEK') return threeweekEverydayEndData;
      else return fourweekEverydayEndData;
    case 'WEEKDAY':
      if (peroid === 'ONEWEEK') return oneweekWeekdayEndDate;
      else if (peroid === 'TWOWEEK') return twoweekWeekdayEndDate;
      else if (peroid === 'THREEWEEK') return threeweekWeekdayEndDate;
      else return fourweekWeekdayEndDate;
    case 'WEEKEND':
      if (peroid === 'ONEWEEK') return oneweekWeekendEndDate;
      else if (peroid === 'TWOWEEK') return twoweekWeekendEndDate;
      else if (peroid === 'THREEWEEK') return threeweekWeekendEndDate;
      else return fourweekWeekendEndDate;
    default:
      if (peroid === 'ONEWEEK') return n1weekWeekendEndDate;
      else if (peroid === 'TWOWEEK') return n2weekWeekendEndDate;
      else if (peroid === 'THREEWEEK') return n3weekWeekendEndDate;
      else return n4weekWeekendEndDate;
  }
}
