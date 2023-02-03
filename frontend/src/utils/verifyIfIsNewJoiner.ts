import { addDays, addMonths, isAfter } from 'date-fns';

export const verifyIfIsNewJoiner = (joinedAt: string, providerAccountCreatedAt?: string) => {
  let dateToCompare = new Date(providerAccountCreatedAt || joinedAt);

  dateToCompare = addDays(dateToCompare, 15);

  const maxDateToBeNewJoiner = addMonths(dateToCompare, 3);

  return isAfter(maxDateToBeNewJoiner, new Date());
};
