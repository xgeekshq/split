import Tooltip from '../../../Primitives/Tooltip';
import { Title } from './partials/Title';

type CardTitleProps = {
	userIsParticipating: boolean;
	boardId: string;
	title: string;
	isSubBoard: boolean | undefined;
	mainBoardId?: string;
};

const CardTitle: React.FC<CardTitleProps> = ({
	userIsParticipating,
	boardId,
	title,
	isSubBoard,
	mainBoardId
}) => {
	return isSubBoard ? (
		<Tooltip content="It’s a sub-team board. A huge team got splitted into sub teams.">
			<Title
				userIsParticipating={userIsParticipating}
				boardId={boardId}
				title={title}
				isSubBoard={isSubBoard}
				mainBoardId={mainBoardId}
			/>
		</Tooltip>
	) : (
		<Title
			userIsParticipating={userIsParticipating}
			boardId={boardId}
			title={title}
			isSubBoard={isSubBoard}
			mainBoardId={mainBoardId}
		/>
	);
};

CardTitle.defaultProps = {
	mainBoardId: undefined
};

export default CardTitle;
