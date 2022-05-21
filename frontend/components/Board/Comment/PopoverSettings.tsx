import React from 'react';

import Icon from '../../icons/Icon';
import { Popover, PopoverContent, PopoverItem, PopoverTrigger } from '../../Primitives/Popover';
import Text from '../../Primitives/Text';

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
			<PopoverItem onClick={setEditCard} gap="8" align="center">
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
			<PopoverItem gap="8" align="center" onClick={setDeleteCard}>
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
				<PopoverTrigger css={{ position: 'relative' }}>
					<Icon name="menu-dots" css={{ width: '$20', height: '$20' }} />
				</PopoverTrigger>
				<PopoverCommentSettingsContent
					setEditCard={handleEditing}
					setDeleteCard={handleDeleteComment}
				/>
			</Popover>
		);
	}
);

export default PopoverCommentSettings;
