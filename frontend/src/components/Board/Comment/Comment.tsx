import React, { useState } from 'react';

import Icon from 'components/icons/Icon';
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
	hideCards: boolean;
	userId: string;
}

const Comment: React.FC<CommentProps> = React.memo(
	({ comment, cardId, cardItemId, boardId, socketId, isSubmited, hideCards, userId }) => {
		const { deleteComment } = useComments();

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
							<Text
								size="xs"
								css={{
									filter:
										hideCards && comment.createdBy._id !== userId
											? 'blur($sizes$6)'
											: 'none'
								}}
							>
								{comment.text}
							</Text>
							{isSubmited && userId === comment.createdBy._id && (
								<Icon
									name="menu-dots"
									css={{
										width: '$20',
										height: '$20'
									}}
								/>
							)}
							{!isSubmited && userId === comment.createdBy._id && (
								<PopoverCommentSettings
									handleEditing={handleEditing}
									handleDeleteComment={handleDeleteComment}
								/>
							)}
						</Flex>
						<Text
							size="xs"
							weight="medium"
							css={{
								filter:
									hideCards && comment.createdBy._id !== userId
										? 'blur($sizes$6)'
										: 'none'
							}}
						>
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
