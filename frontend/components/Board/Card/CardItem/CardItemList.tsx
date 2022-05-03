import { CardItemType } from "../../../../types/card/cardItem";
import { Team } from "../../../../types/team/team";
import DoubleVerticalSeparatorIcon from "../../../icons/DoubleVerticalSeparator";
import Flex from "../../../Primitives/Flex";
import Separator from "../../../Primitives/Separator";
import CardItem from "./CardItem";

interface CardItemListProps {
  items: CardItemType[];
  color: string;
  submitedByTeam?: Team;
  columnId: string;
  boardId: string;
  cardGroupId: string;
  socketId: string;
  cardGroupPosition: number;
  anonymous: boolean;
  userId: string;
  isMainboard: boolean;
  isSubmited: boolean;
}

const CardItemList = ({
  items,
  color,
  submitedByTeam,
  columnId,
  boardId,
  cardGroupId,
  socketId,
  cardGroupPosition,
  anonymous,
  userId,
  isMainboard,
  isSubmited,
}: CardItemListProps) => {
  return (
    <Flex direction="column">
      {items.map((item, idx) => (
        <Flex key={item._id} css={{ width: "100%" }} direction="column">
          {idx !== 0 && (
            <Flex css={{ width: "100%" }} align="center">
              <Separator orientation="horizontal" css={{ backgroundColor: "white" }} />
              <DoubleVerticalSeparatorIcon css={{ borderRadius: "$round" }} />
              <Separator orientation="horizontal" css={{ backgroundColor: "white" }} />
            </Flex>
          )}
          <CardItem
            key={item._id}
            item={item}
            color={color}
            teamName={submitedByTeam?.name}
            lastOne={idx + 1 === items.length}
            firstOne={idx === 0}
            columnId={columnId}
            boardId={boardId}
            cardGroupId={cardGroupId}
            socketId={socketId}
            cardGroupPosition={cardGroupPosition}
            anonymous={anonymous}
            userId={userId}
            isMainboard={isMainboard}
            isSubmited={isSubmited}
          />
        </Flex>
      ))}
    </Flex>
  );
};

export default CardItemList;
