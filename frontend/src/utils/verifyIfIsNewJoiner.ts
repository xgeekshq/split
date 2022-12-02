import dayjs from 'dayjs';

export const verifyIfIsNewJoiner = (userAzureCreatedAt: Date | undefined, joinedAt: string) => {
  const currentDate = dayjs();

  const dateToCompare = userAzureCreatedAt ? dayjs(userAzureCreatedAt) : dayjs(joinedAt);

  const maxDateToBeNewJoiner = dateToCompare.add(3, 'month');

  return currentDate.isBefore(maxDateToBeNewJoiner) || currentDate.isSame(maxDateToBeNewJoiner);
};
