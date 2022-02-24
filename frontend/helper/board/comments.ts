import CardType from "../../types/card/card";
import CommentType from "../../types/comment/comment";

export const getCommentsFromCardGroup = (card: CardType) => {
  const comments: CommentType[] = [];
  card.comments.forEach((comment) => comments.push({ ...comment, isNested: false }));

  card.items?.forEach((item) => {
    item.comments.forEach((comment) => comments.push({ ...comment, isNested: true }));
  });
  return comments;
};
