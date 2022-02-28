import BoardType from "../../types/board/board";
import CardType from "../../types/card/card";

const countVotes = (board: BoardType, userId: string) => {
  if (!userId || !board) return 0;
  return board.columns.reduce((acc, column) => {
    column.cards.forEach((card) => {
      card.votes
        .filter((vote) => vote === userId)
        .forEach(() => {
          acc++;
        });
      card.items.forEach((item) => {
        item.votes
          .filter((vote) => vote === userId)
          .forEach(() => {
            acc++;
          });
      });
    });
    return acc;
  }, 0);
};

export const getCardVotes = (card: CardType) => {
  let votes = [...card.votes];
  card.items.forEach((item) => {
    votes = votes.concat(item.votes);
  });
  return votes;
};

export const votesOfUserInCard = (card: CardType, userId: string) => {
  const votes = getCardVotes(card);
  return votes.includes(userId);
};

export default countVotes;
