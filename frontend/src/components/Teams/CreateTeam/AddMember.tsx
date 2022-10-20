import { styled } from '../../../styles/stitches/stitches.config';
import Icon from '../../icons/Icon';
import Flex from '../../Primitives/Flex';
import Text from '../../Primitives/Text';

const ButtonAddMember = styled('button', {
	color: 'black',
	textDecoration: 'underline',
	backgroundColor: 'transparent',
	border: 0,
	fontSize: '13px',
	'&:hover': {
		cursor: 'pointer'
	}
});

const AddMember = () => {
	return (
		<Flex css={{ width: '100%', mt: '$10' }} direction="column" gap="8">
			<Flex align="center" css={{ justifyContent: 'end' }}>
				<ButtonAddMember>
					<Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
					<Text css={{ ml: '$5', fontSize: '$14', lineHeight: '$18', fontWeight: '700' }}>
						Add new member
					</Text>
				</ButtonAddMember>
			</Flex>
		</Flex>
	);
};

export default AddMember;
