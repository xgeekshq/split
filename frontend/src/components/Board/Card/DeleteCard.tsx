import AlertCustomDialog from 'components/Primitives/AlertCustomDialog';
import useCards from 'hooks/useCards';

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
			defaultOpen
			addEllipsis={cardTitle.length > 100}
			cancelText="Cancel"
			confirmText="Delete card"
			handleClose={handleClose}
			handleConfirm={handleDelete}
			title="Delete card"
			variant="danger"
			text={
				<>
					Do you really want to delete <span>{cardTitle}</span> card?
				</>
			}
		/>
	);
};

DeleteCard.defaultProps = {
	cardItemId: undefined
};

export default DeleteCard;
