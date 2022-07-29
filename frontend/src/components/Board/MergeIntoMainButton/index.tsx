import AlertCustomDialog from 'components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from 'components/Primitives/AlertDialog';
import Button from 'components/Primitives/Button';
import useCards from 'hooks/useCards';

type Props = {
	boardId: string;
};
const MergeIntoMainButton: React.FC<Props> = ({ boardId }) => {
	const { mergeBoard } = useCards();

	return (
		<AlertCustomDialog
			defaultOpen={false}
			title="Merge board into main board"
			text="If you merge your sub-team's board into the main board it can not be edited anymore afterwards. Are you sure you want to merge it?"
			cancelText="Cancel"
			confirmText="Merge into main board"
			handleConfirm={() => {
				mergeBoard.mutate(boardId);
			}}
			variant="primary"
		>
			<AlertDialogTrigger asChild>
				<Button
					variant="primaryOutline"
					size="sm"
					css={{
						fontWeight: '$medium',
						width: '$206'
					}}
				>
					Merge into main board
				</Button>
			</AlertDialogTrigger>
		</AlertCustomDialog>
	);
};

export default MergeIntoMainButton;
