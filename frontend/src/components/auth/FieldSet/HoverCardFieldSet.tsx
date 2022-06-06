import { QuestionMarkCircledIcon } from '@modulz/radix-icons';

import { styled } from 'styles/stitches/stitches.config';

import {
	HoverCardArrow,
	HoverCardContent,
	HoverCardRoot,
	HoverCardTrigger
} from 'components/Primitives/HoverCard';
import Text from 'components/Primitives/Text';
import UnorderedList from 'components/Primitives/UnorderedList';

const ListItem = styled('li', Text, { fontSize: '$8' });
const StyledHoverCardContent = styled(HoverCardContent, {
	border: 'solid',
	borderWidth: 'thin',
	borderColor: 'black',
	p: '$6'
});
const StyledUnorderedList = styled(UnorderedList, { pl: '$20', py: '$8', pr: '$6' });
const StyledHoverCardTrigger = styled(HoverCardTrigger, { ml: '$2', pt: '1px' });

const HoverCardFieldSet: React.FC = () => {
	return (
		<HoverCardRoot>
			<StyledHoverCardTrigger>
				<QuestionMarkCircledIcon />
			</StyledHoverCardTrigger>
			<StyledHoverCardContent sideOffset={0}>
				<StyledUnorderedList variant="wOutMargin">
					<ListItem>7 characters</ListItem>
					<ListItem>1 uppercase</ListItem>
					<ListItem>1 lowercase</ListItem>
					<ListItem>1 number</ListItem>
					<ListItem>1 special character</ListItem>
				</StyledUnorderedList>
				<HoverCardArrow css={{ fill: 'Black' }} />
			</StyledHoverCardContent>
		</HoverCardRoot>
	);
};

export default HoverCardFieldSet;
