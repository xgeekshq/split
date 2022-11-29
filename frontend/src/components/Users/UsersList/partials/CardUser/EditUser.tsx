import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import { User } from '@/types/user/user';

type EditUserProps = { user: User };

const EditUser: React.FC<EditUserProps> = () => (
  <Tooltip content="Edit User">
    <Flex pointer>
      <Icon
        name="edit"
        css={{
          color: '$primary400',
          width: '$20',
          height: '$20',
        }}
      />
    </Flex>
  </Tooltip>
);

export default EditUser;
