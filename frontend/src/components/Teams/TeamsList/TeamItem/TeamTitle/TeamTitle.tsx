import Link from 'next/link';

import Text from '@/components/Primitives/Text/Text';
import { ROUTES } from '@/utils/routes';

export type TeamTitleProps = {
  title: string;
  teamId: string;
};

const TeamTitle = ({ teamId, title }: TeamTitleProps) => (
  <Link key={teamId} href={ROUTES.TeamPage(teamId)}>
    <Text size="sm" fontWeight="bold" overflow="wrap">
      {title}
    </Text>
  </Link>
);

export default TeamTitle;
