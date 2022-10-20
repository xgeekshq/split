import Icon from '../../../icons/Icon';
import Flex from '../../../Primitives/Flex';
import Text from '../../../Primitives/Text';
import { ButtonAddMember } from './styles';

const AddMemberBtn = () => {
	return (
		<Flex css={{ width: '100%', mt: '$10' }} direction="column" gap="8">
			<Flex align="center" css={{ justifyContent: 'end' }}>
				<ButtonAddMember>
					<Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
					<Text
						css={{ ml: '$10', fontSize: '$14', lineHeight: '$18', fontWeight: '700' }}
					>
						Add new member
					</Text>
				</ButtonAddMember>
			</Flex>
		</Flex>
	);
};

export default AddMemberBtn;
