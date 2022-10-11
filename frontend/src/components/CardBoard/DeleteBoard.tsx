import Icon from 'components/icons/Icon';
import AlertCustomDialog from 'components/Primitives/AlertCustomDialog';
import { AlertDialogTrigger } from 'components/Primitives/AlertDialog';
import Flex from 'components/Primitives/Flex';
import Tooltip from 'components/Primitives/Tooltip';
import useBoard from 'hooks/useBoard';

type DeleteBoardProps = { boardId: string; boardName: string; socketId: string | undefined };

const DeleteBoard: React.FC<DeleteBoardProps> = ({ boardId, boardName, socketId }) => {
	const { deleteBoard } = useBoard({ autoFetchBoard: false });

	// Socket IO Hook
	// const socketId = useSocketIO(boardId);

	const handleDelete = () => {
		deleteBoard.mutate({ id: boardId, socketId });
	};

	console.log(deleteBoard);

	return (
		<AlertCustomDialog
			cancelText="Cancel"
			confirmText="Delete"
			css={undefined}
			defaultOpen={false}
			handleConfirm={handleDelete}
			text={`Do you really want to delete the board “${boardName}”?`}
			title="Delete board"
		>
			<Tooltip content="Delete board">
				<AlertDialogTrigger asChild>
					<Flex pointer>
						<Icon
							name="trash-alt"
							css={{
								color: '$primary400',
								width: '$20',
								height: '$20'
							}}
						/>
					</Flex>
				</AlertDialogTrigger>
			</Tooltip>
		</AlertCustomDialog>
	);
};

export default DeleteBoard;
