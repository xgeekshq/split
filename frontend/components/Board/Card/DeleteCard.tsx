import useCards from '../../../hooks/useCards';
import AlertCustomDialog from '../../Primitives/AlertCustomDialog';

interface DeleteProps {
	cardId: string;
	cardTitle: string;
	boardId: string;
	socketId: string | undefined;
	cardItemId?: string;
	handleClose: () => void;
}

const DeleteCard = ({
	cardId,
	cardTitle,
	boardId,
	socketId,
	handleClose,
	cardItemId
}: DeleteProps) => {
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
			title={
				<>
					Delete card <span>{cardTitle}</span>
				</>
			}
			defaultOpen
			variant="danger"
			text="Do you really want to delete this card?"
		/>
	);
};

DeleteCard.defaultProps = {
	cardItemId: undefined
};

export default DeleteCard;
