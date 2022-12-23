import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import { User } from '@/types/user/user';
import Link from 'next/link';

type EditUserProps = { user: User };

const EditUser: React.FC<EditUserProps> = ({ user }) => (
  <Flex pointer>
    <Link
      href={`/users/${user._id}?firstName=${user.firstName}&lastName=${user.lastName}&isSAdmin=${user.isSAdmin}`}
    >
      <Icon
        name="edit"
        css={{
          color: '$primary400',
          width: '$20',
          height: '$20',
          '&:hover': {
            backgroundColor: '#d7e0e0',
            borderRadius: '1em',
          },
        }}
      />
    </Link>
  </Flex>
);

export default EditUser;
