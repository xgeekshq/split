import BoardType from '@/types/board/board';

const getRemainingVotes = (data: BoardType, userId: string) => {
  const votesByUser = data.users.find((user) => user.user._id === userId)?.votesCount;

  return Number(data.maxVotes) - (votesByUser ?? 0);
};

export { getRemainingVotes };
