import { styled } from '../../stitches.config';
import Icon from '../icons/Icon';
import Flex from '../Primitives/Flex';
import Text from '../Primitives/Text';

const TextWhite = styled(Text, { color: 'white', mt: '$24' });
const LiWhite = styled('li', Text, { color: '$primary100', fontSize: '$14', lineHeight: '$20' });
const UnorderedList = styled('ul', { paddingInlineStart: '$26' });

const CreateBoardTipBar = () => {
	return (
		<Flex
			direction="column"
			justify="center"
			css={{
				minHeight: 'calc(100vh - $sizes$92)',
				// overflowY: 'auto',
				backgroundColor: '$primary800',
				padding: '$32',
				maxWidth: '$384',
				position: 'fixed',
				rigth: 0
			}}
		>
			<Icon
				name="blob-idea"
				css={{
					width: '47px',
					height: '$48'
				}}
			/>
			<TextWhite heading="6">Sub-teams</TextWhite>
			<UnorderedList>
				<LiWhite>The participants of the sub-teams are generated randomly.</LiWhite>

				<LiWhite>
					The number of participants is splitted equally between all sub-teams.
				</LiWhite>

				<LiWhite>For each sub-team there is one responsible selected.</LiWhite>
			</UnorderedList>
			<TextWhite heading="6">Responsibles</TextWhite>
			<UnorderedList>
				<LiWhite>
					Responsibles are normal users with the rights to merge the cards at the end of
					each sub-teams retro into the main board.
				</LiWhite>

				<LiWhite>
					Responsibles also are in charge of scheduling and conducting the sub-teams
					retrospective.
				</LiWhite>
			</UnorderedList>
			<TextWhite heading="6" css={{ mb: '$8' }}>
				Stakeholder
			</TextWhite>
			<LiWhite as="span">The stakeholder will not be assigned to any sub-team.</LiWhite>
		</Flex>
	);
};

export default CreateBoardTipBar;
