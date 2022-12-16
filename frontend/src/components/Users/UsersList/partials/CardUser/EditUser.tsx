import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Tooltip from '@/components/Primitives/Tooltip';
import { User } from '@/types/user/user';
import Link from 'next/link';

type EditUserProps = { user: User };

const EditUser: React.FC<EditUserProps> = ({ user }) => (
  <Tooltip content="Edit User">
    <Flex pointer>
      <Link href={`/users/${user._id}`}>
        <Icon
          name="edit"
          css={{
            color: '$primary400',
            width: '$20',
            height: '$20',
          }}
        />
      </Link>
    </Flex>
  </Tooltip>
);

export default EditUser;
