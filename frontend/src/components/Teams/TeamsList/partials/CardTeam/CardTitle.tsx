import Link from 'next/link';

import Text from '@/components/Primitives/Text';

type CardTitleProps = {
  title: string;
  teamId: string;
  isTeamPage?: boolean;
};

const CardTitle = ({ teamId, title, isTeamPage }: CardTitleProps) => {
  const renderTitle = () => (
    <Text link={isTeamPage} size="sm" fontWeight="bold" overflow="wrap">
      {title}
    </Text>
  );

  if (isTeamPage) {
    return (
      <Link
        key={teamId}
        href={{
          pathname: `teams/[teamId]`,
          query: { teamId },
        }}
      >
        {renderTitle()}
      </Link>
    );
  }

  return renderTitle();
};

export default CardTitle;
