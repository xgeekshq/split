import moment from 'moment-business-days';

const lastDayOfNextMonth = () => moment().add(1, 'month').endOf('month');

const getDiffInDays = (date1, date2) => date1.diff(date2, 'days');

const getDayOfTheDate = (date) => date.format('D');

const subtractWeekFromDate = (date) =>
	moment(date).isBusinessDay()
		? date.subtract(7, 'days')
		: moment(date).prevBusinessDay().subtract(7, 'days');

const getCurrentMonthAndYear = () => moment().format('MMMM-YYYY').toLowerCase();

const getNextMonth = () => Number(moment().add(1, 'month').format('MM'));

const getDay = () => Number(getDayOfTheDate(subtractWeekFromDate(lastDayOfNextMonth())));

export {
	getCurrentMonthAndYear,
	getDay,
	getDiffInDays,
	getNextMonth,
	lastDayOfNextMonth,
	subtractWeekFromDate
};
