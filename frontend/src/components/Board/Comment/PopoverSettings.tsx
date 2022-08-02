import React from 'react';

import Icon from 'components/icons/Icon';
import {
	Popover,
	PopoverContent,
	PopoverItem,
	PopoverTrigger
} from 'components/Primitives/Popover';
import Text from 'components/Primitives/Text';

interface PopoverSettingsContentProps {
	setEditCard: () => void;
	setDeleteCard?: () => void;
}

const PopoverCommentSettingsContent: React.FC<PopoverSettingsContentProps> = ({
	setEditCard,
	setDeleteCard
}) => {
	PopoverCommentSettingsContent.defaultProps = {
		setDeleteCard: undefined
	};

	return (
		<PopoverContent>
			<PopoverItem align="center" gap="8" onClick={setEditCard}>
				<Icon
					name="edit"
					css={{
						width: '$20',
						height: '$20'
					}}
				/>
				<Text size="sm" weight="medium">
					Edit comment
				</Text>
			</PopoverItem>
			<PopoverItem align="center" gap="8" onClick={setDeleteCard}>
				<Icon
					name="trash-alt"
					css={{
						width: '$20',
						height: '$20'
					}}
				/>
				<Text size="sm" weight="medium">
					Delete comment
				</Text>
			</PopoverItem>
		</PopoverContent>
	);
};

interface PopoverSettingsProps {
	handleEditing: () => void;
	handleDeleteComment?: () => void;
}

const PopoverCommentSettings: React.FC<PopoverSettingsProps> = React.memo(
	({ handleEditing, handleDeleteComment }) => {
		PopoverCommentSettings.defaultProps = {
			handleDeleteComment: undefined
		};
		return (
			<Popover>
				<PopoverTrigger
					css={{
						position: 'relative',
						'&:hover': {
							backgroundColor: '$primary500',
							color: 'white'
						}
					}}
				>
					<Icon css={{ width: '$20', height: '$20' }} name="menu-dots" />
				</PopoverTrigger>
				<PopoverCommentSettingsContent
					setDeleteCard={handleDeleteComment}
					setEditCard={handleEditing}
				/>
			</Popover>
		);
	}
);

export default PopoverCommentSettings;
