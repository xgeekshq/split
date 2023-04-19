// CHECK: Should add ellipsis to User Name
import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';
import { User } from '@/types/user/user';

export type UserTitleProps = {
  user: User;
  hasPermissions: boolean;
};

const UserTitle = ({ user, hasPermissions }: UserTitleProps) => {
  const getTitle = () => (
    <Text data-testid="userTitle" fontWeight="bold" link={hasPermissions} overflow="wrap" size="sm">
      {user.firstName} {user.lastName}
    </Text>
  );

  if (hasPermissions) {
    return <Link href={ROUTES.UserPage(user._id)}>{getTitle()}</Link>;
  }

  return getTitle();
};

export default UserTitle;
