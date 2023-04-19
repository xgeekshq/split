import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/constants/routes';

export type TeamTitleProps = {
  title: string;
  teamId: string;
};

const TeamTitle = ({ teamId, title }: TeamTitleProps) => (
  <Link key={teamId} href={ROUTES.TeamPage(teamId)}>
    <Text link fontWeight="bold" overflow="wrap" size="sm">
      {title}
    </Text>
  </Link>
);

export default TeamTitle;
