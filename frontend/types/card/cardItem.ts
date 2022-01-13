export type CardGroupDragItem = {
  index: number;
  id: string;
  columnId: string;
  color: string;
  type: "CARD_GROUP";
};

export interface CardItemType {
  _id: string;
  text: string;
  // comments: CommentType[];
  // votes: string[];
  createdBy: string;
}
