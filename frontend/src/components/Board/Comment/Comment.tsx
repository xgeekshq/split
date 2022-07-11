import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import useComments from 'hooks/useComments';
import CommentType from 'types/comment/comment';
import DeleteCommentDto from 'types/comment/deleteComment.dto';
import AddCardOrComment from '../AddCardOrComment';
import PopoverCommentSettings from './PopoverSettings';

interface CommentProps {
	comment: CommentType;
	cardId: string;
	cardItemId?: string;
	boardId: string;
	socketId: string;
	isSubmited: boolean;
}

const Comment: React.FC<CommentProps> = React.memo(
	({ comment, cardId, cardItemId, boardId, socketId, isSubmited }) => {
		const { deleteComment } = useComments();
		const { data: session } = useSession({ required: false });
		const userId = session?.user.id;

		const [editing, setEditing] = useState(false);

		const handleDeleteComment = () => {
			const deleteCommentDto: DeleteCommentDto = {
				boardId,
				cardItemId,
				commentId: comment._id,
				cardId,
				socketId,
				isCardGroup: !cardItemId
			};

			deleteComment.mutate(deleteCommentDto);
		};

		const handleEditing = () => {
			setEditing(!editing);
		};

		return (
			<Flex
				css={{
					border: '1px solid $colors$primaryBase',
					width: '100%',
					borderRadius: '16px 16px 0px 16px',
					p: '$12'
				}}
				direction="column"
			>
				{!editing && (
					<Flex direction="column">
						<Flex justify="between" css={{ width: '100%' }}>
							<Text size="xs">{comment.text}</Text>
							{!isSubmited && userId === comment.createdBy._id && (
								<PopoverCommentSettings
									handleEditing={handleEditing}
									handleDeleteComment={handleDeleteComment}
								/>
							)}
						</Flex>
						<Text size="xs" weight="medium">
							{comment.createdBy.firstName} {comment.createdBy.lastName}
						</Text>
					</Flex>
				)}
				{editing && (
					<AddCardOrComment
						isUpdate
						isCard={false}
						colId="1"
						boardId={boardId}
						socketId={socketId}
						commentId={comment._id}
						cardText={comment.text}
						cardItemId={cardItemId}
						cardId={cardId}
						cancelUpdate={handleEditing}
					/>
				)}
			</Flex>
		);
	}
);

export default Comment;
