import { faker } from '@faker-js/faker';

import { ListUsersType } from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import { TeamUserRoles } from '@/enums/teams/userRoles';
import { BoardUser } from '@/types/board/board.user';
import { CreatedTeamUser, TeamUser } from '@/types/team/team.user';
import { UserList } from '@/types/team/userList';
import { User, UserWithTeams } from '@/types/user/user';
import { buildTestFactory } from '@/utils/testing';

export const UserFactory = buildTestFactory<User>(() => {
  const _id = faker.database.mongodbObjectId();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const isSAdmin = faker.datatype.boolean();
  const joinedAt = faker.date.anytime().toString();

  const user: User = {
    _id,
    firstName,
    lastName,
    email,
    isSAdmin,
    joinedAt,
  };

  return user;
});

export const SessionUserFactory = buildTestFactory(() => {
  const id = faker.database.mongodbObjectId();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const isSAdmin = faker.datatype.boolean();
  const joinedAt = faker.date.anytime().toString();
  const accessToken = {
    token: faker.commerce.product(),
    expiresIn: faker.date.soon().toString(),
  };

  const user = {
    id,
    firstName,
    lastName,
    email,
    isSAdmin,
    joinedAt,
    accessToken,
    isMember: false,
  };

  return user;
});

export const BoardUserFactory = buildTestFactory<BoardUser>(() => {
  const id = faker.database.mongodbObjectId();
  const user = UserFactory.create();
  const role = faker.helpers.arrayElement([
    BoardUserRoles.MEMBER,
    BoardUserRoles.RESPONSIBLE,
    BoardUserRoles.STAKEHOLDER,
  ]);
  const votesCount = faker.number.int(16);

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
  const team = faker.database.mongodbObjectId();
  const role = faker.helpers.arrayElement([
    TeamUserRoles.ADMIN,
    TeamUserRoles.MEMBER,
    TeamUserRoles.STAKEHOLDER,
  ]);
  const isNewJoiner = faker.datatype.boolean();

  return {
    user,
    team,
    role,
    isNewJoiner,
    canBeResponsible: !isNewJoiner,
  };
});

export const CreateTeamUserFactory = buildTestFactory<CreatedTeamUser>(() => {
  const _id = faker.database.mongodbObjectId();
  const team = faker.database.mongodbObjectId();
  const user = UserFactory.create()._id;
  const role = faker.helpers.arrayElement([
    TeamUserRoles.ADMIN,
    TeamUserRoles.MEMBER,
    TeamUserRoles.STAKEHOLDER,
  ]);
  const isNewJoiner = faker.datatype.boolean();

  return {
    _id,
    user,
    team,
    role,
    isNewJoiner,
    canBeResponsible: !isNewJoiner,
  };
});

export const UserListFactory = buildTestFactory<UserList>(() => {
  const _id = faker.database.mongodbObjectId();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const isSAdmin = faker.datatype.boolean();
  const joinedAt = faker.date.anytime().toString();
  const isChecked = faker.datatype.boolean();

  return {
    _id,
    firstName,
    lastName,
    email,
    isSAdmin,
    joinedAt,
    isChecked,
  };
});

export const UserWithTeamsFactory = buildTestFactory<UserWithTeams>(() => {
  const user = UserFactory.create();
  const teamsNames = faker.helpers.arrayElements([
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
    faker.company.name(),
  ]);

  return {
    user,
    teamsNames,
  };
});
