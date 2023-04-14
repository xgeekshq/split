import { CreateTeamDto, Team, TeamChecked } from '@/types/team/team';
import { faker } from '@faker-js/faker';

import { buildTestFactory } from '@/utils/testing';
import { CreateTeamUserFactory, TeamUserFactory } from '@/utils/factories/user';

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

export const TeamCheckedFactory = buildTestFactory<TeamChecked>(() => {
  const _id = faker.database.mongodbObjectId();
  const name = faker.company.name();
  const isChecked = faker.datatype.boolean();

  return {
    _id,
    name,
    isChecked,
  };
});

export const CreateTeamFactory = buildTestFactory<CreateTeamDto>(() => {
  const name = faker.company.name();
  const users = CreateTeamUserFactory.createMany();

  return {
    name,
    users,
  };
});
