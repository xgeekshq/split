export const createMockedCardDto = (colIdToAdd: string) => ({
  colIdToAdd,
  card: {
    text: 'Card1',
    comments: [],
    votes: [],
    items: [],
  },
  socketId: '1',
});
