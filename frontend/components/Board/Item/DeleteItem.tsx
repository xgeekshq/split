interface DeleteProps {
  type: string;
  itemId: string;
  cardId: string;
  cardItemId?: string;
  boardId: string;
  socketId: string | undefined;
}

const DeleteItem: React.FC<DeleteProps> = () => {
  // const { deleteCard } = useCards();
  // const { deleteComment } = useComments();

  // const handleDelete = (event: ClickEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.stopPropagation();
  //   if (type === "CARD") {
  //     deleteCard.mutate({
  //       cardId: itemId,
  //       boardId,
  //       socketId,
  //     });
  //   }

  //   if (type === "COMMENT") {
  //     deleteComment.mutate({
  //       cardId,
  //       cardItemId,
  //       boardId,
  //       socketId,
  //       commentId: itemId,
  //       isCardGroup: cardItemId === undefined,
  //     });
  //   }
  // };

  // return (
  //   <BoardAlertDialog
  //     defaultOpen={false}
  //     text={`Are you sure you want to delete this ${type.toLowerCase()}?`}
  //     handleClose={(e) => e.stopPropagation()}
  //     handleConfirm={handleDelete}
  //   />
  // );
  return null;
};

export default DeleteItem;
