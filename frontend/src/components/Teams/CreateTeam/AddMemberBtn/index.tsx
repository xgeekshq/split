import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Icon from '@/components/icons/Icon';
import { ButtonAddMember } from './styles';

const AddMemberBtn = () => (
  <Flex css={{ width: '100%', mt: '$10' }} direction="column" gap="8">
    <Flex align="center" css={{ justifyContent: 'end' }}>
      <ButtonAddMember>
        <Icon css={{ width: '$16', height: '$16' }} name="plus" />{' '}
        <Text css={{ ml: '$10', fontSize: '$14', lineHeight: '$18' }} fontWeight="bold">
          Add new member
        </Text>
      </ButtonAddMember>
    </Flex>
  </Flex>
);

export default AddMemberBtn;
