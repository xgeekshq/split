import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import { User } from '@/types/user/user';
import { ROUTES } from '@/utils/routes';

type UserTitleProps = {
  user: User;
  hasPermissions: boolean;
};

// const StyledBoardTitle = styled(Text, {
//   textOverflow: 'ellipsis',
//   whiteSpace: 'nowrap',
//   overflow: 'hidden',
//   maxWidth: '$260',
// });

const UserTitle = ({ user, hasPermissions }: UserTitleProps) => {
  const getTitle = () => (
    <Text link={hasPermissions} fontWeight="bold" size="sm" overflow="wrap">
      {user.firstName} {user.lastName}
    </Text>
  );

  if (hasPermissions) {
    return <Link href={ROUTES.UserPage(user._id)}>{getTitle()}</Link>;
  }

  return getTitle();
};

export default UserTitle;
