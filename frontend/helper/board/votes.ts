import BoardType from "../../types/board/board";
import CardType from "../../types/card/card";

const countVotes = (board: BoardType, userId: string) => {
  let votes = 0;
  if (userId && board) {
    for (let i = 0; i < board.columns.length; i++) {
      const column = board.columns[i];
      for (let j = 0; j < column.cards.length; j++) {
        const card = column.cards[j];
        if (card.votes.includes(userId)) {
          for (let k = 0; k < card.votes.length; k++) {
            if (card.votes[k] === userId) {
              votes++;
            }
          }
        }
        for (let x = 0; x < card.items.length; x++) {
          const item = card.items[x];
          if (item.votes.includes(userId)) {
            for (let y = 0; y < item.votes.length; y++) {
              if (item.votes[y] === userId) {
                votes++;
              }
            }
          }
        }
      }
    }
  }
  return votes;
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
