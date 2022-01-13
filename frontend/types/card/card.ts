import { CardItemType } from "./cardItem";

export default interface CardType {
  _id: string;
  text: string;
  // votes: string[];
  // comments: CommentType[];
  items?: CardItemType[];
  createdBy: string;
}

export interface CardDragItem {
  index: number;
  columnId: string;
  id: string;
  color: string;
  card: CardType;
  userId: string;
  cardGroupId?: string;
  type: "CARD" | "CARD_GROUP";
}
