import { styled } from '@/styles/stitches/stitches.config';

import Text from '@/components/Primitives/Text';

type CardTitleProps = {
  firstName: string;
  lastName: string;
};

const StyledBoardTitle = styled(Text, {
  fontWeight: '$bold',
  fontSize: '$14',
  letterSpacing: '$0-17',
  '&[data-disabled="true"]': { opacity: 0.4 },
  '@hover': {
    '&:hover': {
      '&[data-disabled="true"]': {
        textDecoration: 'none',
        cursor: 'default',
      },
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
});

const CardTitle: React.FC<CardTitleProps> = ({ firstName, lastName }) => {
  const getTitle = () => (
    <StyledBoardTitle>
      {firstName} {lastName}
    </StyledBoardTitle>
  );

  return getTitle();
};

export default CardTitle;
