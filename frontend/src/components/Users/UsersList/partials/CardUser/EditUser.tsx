import Link from 'next/link';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { User } from '@/types/user/user';
import { ROUTES } from '@/utils/routes';

type EditUserProps = { user: User };

const EditUser = ({ user }: EditUserProps) => (
  <Flex pointer>
    <Link href={ROUTES.UserPage(user._id)}>
      <Flex>
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
      </Flex>
    </Link>
  </Flex>
);

export default EditUser;
