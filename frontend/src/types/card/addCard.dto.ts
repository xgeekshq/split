import CardType, { CardToAdd } from '@/types/card/card';
import { User } from '@/types/user/user';

export default interface AddCardDto {
  boardId: string;

  colIdToAdd: string;

  card: CardToAdd;

  socketId?: string;

  newCard?: CardType;

  user?: User;
}
