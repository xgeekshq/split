import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import { CardItemType } from 'types/card/cardItem';
import CardItem from './CardItem';

interface CardItemListProps {
	items: CardItemType[];
	color: string;
	submitedByTeam?: string;
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

const CardItemList: React.FC<CardItemListProps> = ({
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
	isSubmited
}) => {
	return (
		<Flex direction="column">
			{items.map((item, idx) => (
				<Flex key={item._id} css={{ width: '100%' }} direction="column">
					{idx !== 0 && (
						<Flex css={{ width: '100%' }} align="center">
							<Separator
								orientation="horizontal"
								css={{ backgroundColor: 'white' }}
							/>
							<Icon
								name="double-vertical-separator"
								css={{ width: '$14', height: '$14', borderRadius: '$round' }}
							/>
							<Separator
								orientation="horizontal"
								css={{ backgroundColor: 'white' }}
							/>
						</Flex>
					)}
					<CardItem
						key={item._id}
						item={item}
						color={color}
						teamName={submitedByTeam}
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
