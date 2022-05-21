import * as moment from 'moment-business-days';

export const lastDayOfNextMonth = () => moment().add(1, 'month').endOf('month');

export const getDiffInDays = (date1, date2) => date1.diff(date2, 'days');

export const getDayOfTheDate = (date) => date.format('D');

export const subtractWeekFromDate = (date) =>
  moment(date).isBusinessDay()
    ? date.subtract(7, 'days')
    : moment(date).prevBusinessDay().subtract(7, 'days');

export const getCurrentMonthAndYear = () =>
  moment().format('MMMM-YYYY').toLowerCase();

export const getNextMonth = () => Number(moment().add(1, 'month').format('MM'));

export const getDay = () =>
  Number(getDayOfTheDate(subtractWeekFromDate(lastDayOfNextMonth())));
