import { CardToAdd } from "./card";

export default interface AddCardDto {
  boardId: string;

  colIdToAdd: string;

  card: CardToAdd;

  socketId?: string;
}
