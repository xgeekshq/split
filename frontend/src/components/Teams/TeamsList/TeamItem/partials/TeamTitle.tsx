import Link from 'next/link';

import Text from '@/components/Primitives/Text';
import { ROUTES } from '@/utils/routes';

export type TeamTitleProps = {
  title: string;
  teamId: string;
  isTeamPage?: boolean;
};

const TeamTitle = ({ teamId, title, isTeamPage }: TeamTitleProps) => {
  const renderTitle = () => (
    <Text link={isTeamPage} size="sm" fontWeight="bold" overflow="wrap">
      {title}
    </Text>
  );

  if (isTeamPage) {
    return (
      <Link key={teamId} href={ROUTES.TeamPage(teamId)}>
        {renderTitle()}
      </Link>
    );
  }

  return renderTitle();
};

export default TeamTitle;
