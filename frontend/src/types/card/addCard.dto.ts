import { User } from '@/types/user/user';
import CardType, { CardToAdd } from '@/types/card/card';

export default interface AddCardDto {
  boardId: string;

  colIdToAdd: string;

  card: CardToAdd;

  socketId?: string;

  newCard?: CardType;

  user?: User;
}
