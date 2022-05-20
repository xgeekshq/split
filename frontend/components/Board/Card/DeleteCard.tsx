import useCards from '../../../hooks/useCards';
import AlertCustomDialog from '../../Primitives/AlertCustomDialog';

interface DeleteProps {
	cardId: string;
	boardId: string;
	socketId: string | undefined;
	cardItemId?: string;
	handleClose: () => void;
}

const DeleteCard: React.FC<DeleteProps> = ({
	cardId,
	boardId,
	socketId,
	handleClose,
	cardItemId
}) => {
	const { deleteCard } = useCards();

	const handleDelete = () => {
		deleteCard.mutate({
			cardId,
			boardId,
			socketId,
			isCardGroup: !cardItemId,
			cardItemId
		});
	};

	return (
		<AlertCustomDialog
			cancelText="Cancel"
			confirmText="Delete card"
			handleClose={handleClose}
			handleConfirm={handleDelete}
			title="Delete card"
			defaultOpen
			text="Do you really want to delete this card?"
			css={{ left: '35%' }}
		/>
	);
};

export default DeleteCard;
