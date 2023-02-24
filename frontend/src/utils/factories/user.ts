import { User } from '@/types/user/user';
import { faker } from '@faker-js/faker';
import { buildTestFactory } from '@/utils/testing';

import { BoardUser } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import { ListUsersType } from '@/components/Primitives/Avatar/AvatarGroup';
import { TeamUser } from '@/types/team/team.user';

export const UserFactory = buildTestFactory<User>(() => {
  const _id = faker.database.mongodbObjectId();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName);
  const isSAdmin = faker.datatype.boolean();
  const joinedAt = faker.datatype.datetime().toString();

  return {
    _id,
    firstName,
    lastName,
    email,
    isSAdmin,
    joinedAt,
  };
});

export const BoardUserFactory = buildTestFactory<BoardUser>(() => {
  const id = faker.database.mongodbObjectId();
  const user = UserFactory.create();
  const role = faker.helpers.arrayElement([
    BoardUserRoles.MEMBER,
    BoardUserRoles.RESPONSIBLE,
    BoardUserRoles.STAKEHOLDER,
  ]);
  const votesCount = faker.datatype.number(16);

  return {
    id,
    user,
    role,
    votesCount,
  };
});

export const AvatarGroupUsersFactory = buildTestFactory<ListUsersType>(() => {
  const _id = faker.database.mongodbObjectId();
  const user = UserFactory.create();
  const role = faker.helpers.arrayElement([
    BoardUserRoles.MEMBER,
    BoardUserRoles.RESPONSIBLE,
    BoardUserRoles.STAKEHOLDER,

    TeamUserRoles.ADMIN,
    TeamUserRoles.MEMBER,
    TeamUserRoles.STAKEHOLDER,
  ]);

  return {
    _id,
    user,
    role,
  };
});

export const TeamUserFactory = buildTestFactory<TeamUser>(() => {
  const user = UserFactory.create();
  const role = faker.helpers.arrayElement([
    TeamUserRoles.ADMIN,
    TeamUserRoles.MEMBER,
    TeamUserRoles.STAKEHOLDER,
  ]);
  const isNewJoiner = faker.datatype.boolean();

  return {
    user,
    role,
    isNewJoiner,
  };
});
