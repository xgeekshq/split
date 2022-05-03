import BoardDto from '../../../../modules/boards/dto/board.dto';

export const boardId = '620676ee647f46966277f3a8';

export const mockedBoard = (userId: string): BoardDto => ({
  title: 'Test Board',
  maxVotes: '6',
  columns: [
    {
      title: 'col1',
      color: 'red',
      cards: [
        {
          text: 'Card1',
          comments: [],
          items: [
            {
              text: 'Card1',
              comments: [{ text: 'NewComment', createdBy: userId }],
              createdBy: userId,
              votes: [],
            },
          ],
          votes: [],
          createdBy: userId,
        },
      ],
    },
    { title: 'col2', color: 'blue', cards: [] },
    { title: 'col3', color: 'green', cards: [] },
  ],
  isPublic: true,
  users: [],
  hideCards: false,
  hideVotes: false,
  postAnonymously: false,
  dividedBoards: [],
});

export const boardsMocked = [
  {
    ...mockedBoard,
  },
  {
    ...mockedBoard,
    _id: '2',
    title: 'Test Board 2',
  },
];
