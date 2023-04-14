import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/utils/routes';

export type MemberTitleProps = {
  name: string;
  userId: string;
  hasPermissions: boolean;
};

const MemberTitle = ({ userId, name, hasPermissions }: MemberTitleProps) => {
  const renderName = () => (
    <Text fontWeight="bold" link={hasPermissions} overflow="wrap" size="sm">
      {name}
    </Text>
  );

  if (hasPermissions) {
    return (
      <Link key={userId} href={ROUTES.UserPage(userId)}>
        {renderName()}
      </Link>
    );
  }

  return renderName();
};

export default MemberTitle;
