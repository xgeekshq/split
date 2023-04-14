import { faker } from '@faker-js/faker';

import BoardType from '@/types/board/board';
import ColumnType from '@/types/column';
import { TeamFactory } from '@/utils/factories/team';
import { BoardUserFactory, UserFactory } from '@/utils/factories/user';
import { buildTestFactory } from '@/utils/testing';

export const BoardFactory = buildTestFactory<BoardType>(() => {
  const _id = faker.database.mongodbObjectId();
  const title = faker.company.name();
  const updatedAt = faker.date.recent().toDateString();
  const columns: ColumnType[] = [];
  const isPublic = faker.datatype.boolean();
  const password = faker.internet.password();
  const dividedBoards: BoardType[] = [];
  const recurrent = faker.datatype.boolean();
  const team = TeamFactory.create();
  const users = BoardUserFactory.createMany();
  const createdBy = UserFactory.create();
  const isSubBoard = faker.datatype.boolean();
  const boardNumber = faker.datatype.number({ min: 0, max: 10 });
  const maxVotes = faker.datatype.number({ min: 6, max: 10 });
  const votes: string | undefined = undefined;
  const submitedByUser = undefined;
  const hideCards = faker.datatype.boolean();
  const hideVotes = faker.datatype.boolean();
  const submitedAt = undefined;
  const slackEnable = false;
  const responsibles: string[] = [];
  const addCards = faker.datatype.boolean();
  const postAnonymously = faker.datatype.boolean();
  const phase = undefined;

  return {
    _id,
    title,
    updatedAt,
    columns,
    isPublic,
    password,
    dividedBoards,
    recurrent,
    team,
    users,
    createdBy,
    isSubBoard,
    boardNumber,
    maxVotes,
    votes,
    submitedByUser,
    hideCards,
    hideVotes,
    submitedAt,
    slackEnable,
    responsibles,
    addCards,
    postAnonymously,
    phase,
  };
});
