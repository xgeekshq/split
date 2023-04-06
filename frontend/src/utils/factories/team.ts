import { Team } from '@/types/team/team';
import { faker } from '@faker-js/faker';

import { buildTestFactory } from '@/utils/testing';
import { TeamUserFactory } from '@/utils/factories/user';

export const TeamFactory = buildTestFactory<Team>(() => {
  const id = faker.database.mongodbObjectId();
  const name = faker.company.name();
  const users = TeamUserFactory.createMany();
  const boardsCount = faker.datatype.number(10);

  return {
    id,
    name,
    users,
    boardsCount,
  };
});
