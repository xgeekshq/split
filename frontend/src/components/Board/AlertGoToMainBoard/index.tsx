import Link from 'next/link';

import AlertBox from 'components/Primitives/AlertBox';
import Button from 'components/Primitives/Button';

type Props = {
	submitedAt: string | Date;
	mainBoardId: string;
};
const AlertGoToMainBoard: React.FC<Props> = ({ submitedAt, mainBoardId }) => {
	const date = typeof submitedAt === 'string' ? new Date(submitedAt) : submitedAt;

	return (
		<AlertBox
			css={{ flex: '1' }}
			type="info"
			title={`Sub-team board successfully merged into main board ${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`}
			text="The sub-team board can not be edited anymore. If you want to edit cards, go to the main board and edit the according card there."
		>
			<Link
				key={mainBoardId}
				href={{
					pathname: `[boardId]`,
					query: { boardId: mainBoardId }
				}}
			>
				<Button size="sm">Go to main board</Button>
			</Link>
		</AlertBox>
	);
};

export default AlertGoToMainBoard;
