import dayjs from 'dayjs';

export const verifyIfIsNewJoiner = (
  providerAccountCreatedAt: Date | undefined,
  joinedAt: string,
) => {
  const currentDate = dayjs();

  const dateToCompare = providerAccountCreatedAt
    ? dayjs(providerAccountCreatedAt)
    : dayjs(joinedAt);

  const maxDateToBeNewJoiner = dateToCompare.add(3, 'month');

  return maxDateToBeNewJoiner.isAfter(currentDate);
};
