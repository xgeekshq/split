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
		/*
		 * In some way this component or it's children is updating on an unmounted component.
		 * To fix, this component must be closed before operate the async action.
		 */
		handleClose();
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
			variant="danger"
			addEllipsis={cardTitle.length > 100}
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
