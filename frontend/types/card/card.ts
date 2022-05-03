import CommentType from "../comment/comment";
import { Team } from "../team/team";
import { User } from "../user/user";
import { CardItemToAdd, CardItemType } from "./cardItem";

export default interface CardType {
  _id: string;
  text: string;
  votes: string[];
  comments: CommentType[];
  items: CardItemType[];
  createdBy?: User;
  createdByTeam?: Team;
}

export interface CardToAdd extends Omit<CardType, "_id" | "items"> {
  items: CardItemToAdd[];
}

export interface CardDragItem {
  index: number;
  columnId: string;
  color: string;
  card: CardType;
  cardGroupId?: string;
  userId: string;
  type: "CARD" | "CARD_GROUP";
}
