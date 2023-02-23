import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import { CardItemType } from '@/types/card/cardItem';
import CardItem from './CardItem';

interface CardItemListProps {
  items: CardItemType[];
  color: string;
  columnId: string;
  boardId: string;
  cardGroupId: string;
  socketId: string;
  cardGroupPosition: number;
  userId: string;
  isMainboard: boolean;
  isSubmited: boolean;
  hideCards: boolean;
  isDefaultText: boolean;
  hasAdminRole: boolean;
  postAnonymously: boolean;
  cardTextDefault?: string;
  isRegularBoard?: boolean;
}

const CardItemList: React.FC<CardItemListProps> = ({
  items,
  color,
  columnId,
  boardId,
  cardGroupId,
  socketId,
  cardGroupPosition,
  userId,
  isMainboard,
  isSubmited,
  hideCards,
  isDefaultText,
  hasAdminRole,
  postAnonymously,
  cardTextDefault,
}) => (
  <Flex direction="column">
    {items.map((item, idx) => (
      <Flex key={item._id} css={{ width: '100%' }} direction="column">
        {idx !== 0 && (
          <Flex align="center" css={{ width: '100%' }}>
            <Separator css={{ backgroundColor: 'white' }} />
            <Icon
              css={{ width: '$14', height: '$14', borderRadius: '$round' }}
              name="double-vertical-separator"
            />
            <Separator css={{ backgroundColor: 'white' }} />
          </Flex>
        )}
        <CardItem
          key={item._id}
          anonymous={item.anonymous}
          boardId={boardId}
          cardGroupId={cardGroupId}
          cardGroupPosition={cardGroupPosition}
          color={color}
          columnId={columnId}
          firstOne={idx === 0}
          hideCards={hideCards}
          isMainboard={isMainboard}
          isSubmited={isSubmited}
          item={item}
          lastOne={idx + 1 === items.length}
          socketId={socketId}
          userId={userId}
          isDefaultText={isDefaultText}
          hasAdminRole={hasAdminRole}
          postAnonymously={postAnonymously}
          cardTextDefault={cardTextDefault}
        />
      </Flex>
    ))}
  </Flex>
);

export default CardItemList;
